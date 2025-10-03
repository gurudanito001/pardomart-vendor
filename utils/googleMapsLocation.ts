import { Platform } from 'react-native';
import { analyzeGoogleMapsError, retryWithBackoff, validateGoogleMapsEnvironment } from './errorRecovery';
import {
  CACHE_CONFIG,
  PerformanceMonitor,
  placeDetailsCache,
  placeSearchCache,
  reverseGeocodeCache
} from './performanceOptimizations';

export interface GooglePlacesSuggestion {
  id: string;
  displayName: string;
  address: string;
  latitude: number;
  longitude: number;
  country?: string | null;
  placeId: string;
  types: string[];
}

export interface GooglePlaceDetails {
  streetNumber?: string | null;
  street?: string | null;
  city?: string | null;
  region?: string | null;
  subregion?: string | null;
  postalCode?: string | null;
  country?: string | null;
  isoCountryCode?: string | null;
  name?: string | null;
  latitude: number;
  longitude: number;
  placeId: string;
  formattedAddress: string;
}

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
const DEFAULT_COUNTRY = process.env.EXPO_PUBLIC_DEFAULT_COUNTRY || 'ng';

// Google Maps JavaScript API globals (for web platform)
declare global {
  interface Window {
    google?: any;
    initGoogleMaps?: () => void;
  }
}

/**
 * Check if Google Maps API is properly configured
 */
export const isGoogleMapsConfigured = (): boolean => {
  return Boolean(GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY.trim() !== '');
};

/**
 * Validate Google Maps environment and provide detailed feedback
 */
export const checkGoogleMapsConfiguration = (): {
  isValid: boolean;
  issues: string[];
  recommendations: string[];
} => {
  return validateGoogleMapsEnvironment();
};

/**
 * Validate that Google Maps API is configured, throw error if not
 */
const ensureGoogleMapsConfigured = (): void => {
  if (!isGoogleMapsConfigured()) {
    throw new Error('Google Maps API key is required but not configured. Please set EXPO_PUBLIC_GOOGLE_MAPS_API_KEY in your environment.');
  }
};

/**
 * Load Google Maps JavaScript API (web only)
 */
const loadGoogleMapsAPI = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (Platform.OS !== 'web') {
      resolve();
      return;
    }

    // Check if already loaded
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Google Maps API')));
      return;
    }

    // Load the API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=weekly&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps API'));

    document.head.appendChild(script);
  });
};

/**
 * Initialize Google Maps services for web
 */
const initializeGoogleMapsServices = async () => {
  if (Platform.OS !== 'web') return null;

  await loadGoogleMapsAPI();

  // Retry/wait loop to ensure google.maps and google.maps.places are available
  const maxAttempts = 10;
  const delayMs = 100;
  let attempt = 0;
  while (
    (!window.google || !window.google.maps || !window.google.maps.places) &&
    attempt < maxAttempts
  ) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    attempt++;
  }

  if (!window.google || !window.google.maps || !window.google.maps.places) {
    throw new Error('Google Maps API failed to initialize: places library not available');
  }

  // Prefer the modular importLibrary API to guarantee availability
  if (window.google.maps.importLibrary) {
    try {
      const [placesLib, geoLib] = await Promise.all([
        window.google.maps.importLibrary('places'),
        // Geocoder may live under 'geocoding' in the modular API
        window.google.maps.importLibrary('geocoding').catch(() => window.google.maps.importLibrary('maps')),
      ]);
      const PlacesServiceCtor = (placesLib as any).PlacesService;
      const GeocoderCtor = (geoLib as any).Geocoder || (window.google.maps as any).Geocoder;
      const container = document.createElement('div');
      return {
        placesService: new PlacesServiceCtor(container),
        geocoder: new GeocoderCtor(),
      };
    } catch {
      // fall through to legacy namespace
    }
  }

  // Legacy global namespace fallback
  return {
    placesService: new (window as any).google.maps.places.PlacesService(document.createElement('div')),
    geocoder: new (window as any).google.maps.Geocoder(),
  };
};

/**
 * Enhanced place search using Google Places API with caching and performance monitoring
 */
export const searchPlacesGoogle = async (
  query: string,
  location?: { latitude: number; longitude: number },
  alertFn?: (message: string) => void
): Promise<GooglePlacesSuggestion[]> => {
  return retryWithBackoff(async () => searchPlacesGoogleInternal(query, location, alertFn));
};

const searchPlacesGoogleInternal = async (
  query: string,
  location?: { latitude: number; longitude: number },
  alertFn?: (message: string) => void
): Promise<GooglePlacesSuggestion[]> => {
  if (!query || query.trim().length < 3) {
    return [];
  }

  ensureGoogleMapsConfigured();

  // Create cache key
  const cacheKey = `search_${query}_${location?.latitude || 'null'}_${location?.longitude || 'null'}`;
  
  // Check cache first
  const cachedResult = placeSearchCache.get(cacheKey) as GooglePlacesSuggestion[] | null;
  if (cachedResult) {
    return cachedResult;
  }

  try {
    const result = await PerformanceMonitor.measureAsync('place_search', async () => {
      if (Platform.OS === 'web') {
        // Use Google Maps JavaScript API for web
        const services = await initializeGoogleMapsServices();
        if (!services) throw new Error('Google Maps services not available');

        return new Promise<GooglePlacesSuggestion[]>(async (resolve, reject) => {
          try {
            // Prefer the new AutocompleteSuggestion API when available (2025 migration)
            const AutoSuggest = window.google.maps.places?.AutocompleteSuggestion;
            const hasNewApi = AutoSuggest && typeof AutoSuggest.fetchAutocompleteSuggestions === 'function';

            if (hasNewApi) {
              const sessionToken = window.google.maps.places?.AutocompleteSessionToken
                ? new window.google.maps.places.AutocompleteSessionToken()
                : undefined;

              const req: any = {
                input: query.trim(),
                includedRegionCodes: [String(DEFAULT_COUNTRY).toUpperCase()],
                sessionToken,
              };
              if (location) {
                req.locationBias = {
                  center: { lat: location.latitude, lng: location.longitude },
                  radius: 50000,
                };
              }

              const resp = await AutoSuggest.fetchAutocompleteSuggestions(req);
              const suggestions = resp?.suggestions || [];
              if (!suggestions.length) {
                resolve([]);
                return;
              }

              const detailedResults = await Promise.all(
                suggestions.slice(0, 5).map(async (s: any) => {
                  try {
                    const placeId = s?.placePrediction?.placeId || s?.placeId || s?.prediction?.place_id;
                    if (!placeId) return null;
                    const details = await getPlaceDetailsGoogleInternal(placeId);
                    const displayText = s?.placePrediction?.text?.text || s?.description || '';
                    return {
                      id: placeId,
                      displayName: displayText || details.formattedAddress,
                      address: displayText || details.formattedAddress,
                      latitude: details.latitude,
                      longitude: details.longitude,
                      country: details.isoCountryCode,
                      placeId,
                      types: s?.placePrediction?.types || s?.types || [],
                    } as GooglePlacesSuggestion;
                  } catch (error) {
                    console.warn('Failed to get place details for suggestion', error);
                    return null;
                  }
                })
              );

              resolve(detailedResults.filter((r): r is GooglePlacesSuggestion => Boolean(r)));
              return;
            }

            // Fallback (avoid AutocompleteService): use Places Autocomplete HTTP API
            const baseUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
            const params = new URLSearchParams({
              input: query.trim(),
              key: GOOGLE_MAPS_API_KEY!,
              language: 'en',
              types: 'address',
              components: `country:${DEFAULT_COUNTRY}`,
            });
            if (location) {
              params.append('location', `${location.latitude},${location.longitude}`);
              params.append('radius', '50000');
            }
            const resp = await fetch(`${baseUrl}?${params.toString()}`);
            if (!resp.ok) {
              reject(new Error(`Google Places API HTTP error: ${resp.status} ${resp.statusText}`));
              return;
            }
            const data = await resp.json();
            if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
              reject(new Error(`Google Places API error: ${data.status}${data.error_message ? ` - ${data.error_message}` : ''}`));
              return;
            }
            const predictions = data.predictions || [];
            if (!predictions.length) {
              resolve([]);
              return;
            }
            const detailedResults = await Promise.all(
              predictions.slice(0, 5).map(async (prediction: any) => {
                try {
                  const details = await getPlaceDetailsGoogleInternal(prediction.place_id);
                  return {
                    id: prediction.place_id,
                    displayName: prediction.description,
                    address: prediction.structured_formatting?.main_text || prediction.description,
                    latitude: details.latitude,
                    longitude: details.longitude,
                    country: details.isoCountryCode,
                    placeId: prediction.place_id,
                    types: prediction.types || [],
                  } as GooglePlacesSuggestion;
                } catch (error) {
                  console.warn('Failed to get place details for:', prediction.place_id, error);
                  return null;
                }
              })
            );
            resolve(detailedResults.filter((r): r is GooglePlacesSuggestion => Boolean(r)));
          } catch (e) {
            reject(e);
          }
        });
      }

      // For native platforms, use direct Google Maps API
      const baseUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
      const params = new URLSearchParams({
        input: query.trim(),
        key: GOOGLE_MAPS_API_KEY!,
        language: 'en',
        types: 'address',
        components: `country:${DEFAULT_COUNTRY}`,
      });

      // Add location bias if provided
      if (location) {
        params.append('location', `${location.latitude},${location.longitude}`);
        params.append('radius', '50000'); // 50km radius
      }

      const response = await fetch(`${baseUrl}?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Google Places API HTTP error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'REQUEST_DENIED') {
        throw new Error('Google Places API access denied. Please check your API key and permissions.');
      }
      
      if (data.status === 'OVER_QUERY_LIMIT') {
        throw new Error('Google Places API quota exceeded. Please check your usage limits.');
      }
      
      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        throw new Error(`Google Places API error: ${data.status}${data.error_message ? ` - ${data.error_message}` : ''}`);
      }

      if (!data.predictions || data.predictions.length === 0) {
        return [];
      }

      // Get detailed information for each prediction
      const detailedResults = await Promise.all(
        data.predictions.slice(0, 5).map(async (prediction: any) => {
          try {
            const details = await getPlaceDetailsGoogleInternal(prediction.place_id);
            return {
              id: prediction.place_id,
              displayName: prediction.description,
              address: prediction.structured_formatting?.main_text || prediction.description,
              latitude: details.latitude,
              longitude: details.longitude,
              country: details.isoCountryCode,
              placeId: prediction.place_id,
              types: prediction.types || [],
            };
          } catch (error) {
            console.warn('Failed to get place details for:', prediction.place_id, error);
            return null;
          }
        })
      );

      // Filter out null results
      return detailedResults.filter((result): result is GooglePlacesSuggestion => result !== null);
    });

    // Cache the results
    placeSearchCache.set(cacheKey, result, CACHE_CONFIG.PLACE_SEARCH_CACHE_DURATION);
    
    return result;

  } catch (error) {
    console.error('Google Places search error:', error);
    const recovery = analyzeGoogleMapsError(error as Error);
    if (alertFn) {
      alertFn(recovery.userMessage);
    }
    throw error;
  }
};

/**
 * Get detailed place information using Google Places API with caching
 */
export const getPlaceDetailsGoogle = async (
  placeId: string,
  alertFn?: (message: string) => void
): Promise<GooglePlaceDetails> => {
  return retryWithBackoff(async () => getPlaceDetailsGoogleInternal(placeId, alertFn));
};

const getPlaceDetailsGoogleInternal = async (
  placeId: string,
  alertFn?: (message: string) => void
): Promise<GooglePlaceDetails> => {
  ensureGoogleMapsConfigured();

  // Check cache first
  const cachedResult = placeDetailsCache.get(placeId) as GooglePlaceDetails | null;
  if (cachedResult) {
    return cachedResult;
  }

  try {
    const result = await PerformanceMonitor.measureAsync('place_details', async () => {
      if (Platform.OS === 'web') {
        // Use Google Maps JavaScript API for web
        const services = await initializeGoogleMapsServices();
        if (!services) throw new Error('Google Maps services not available');

        return new Promise<GooglePlaceDetails>((resolve, reject) => {
          const request = {
            placeId: placeId,
            fields: ['address_components', 'formatted_address', 'geometry', 'name'],
          };

          services.placesService.getDetails(request, (place: any, status: any) => {
            if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
              reject(new Error(`Google Place Details API error: ${status}`));
              return;
            }

            const addressComponents = place.address_components || [];
            
            // Parse address components
            const getComponent = (types: string[]) => {
              const component = addressComponents.find((comp: any) => 
                types.some(type => comp.types.includes(type))
              );
              return component?.long_name || null;
            };

            const getShortComponent = (types: string[]) => {
              const component = addressComponents.find((comp: any) => 
                types.some(type => comp.types.includes(type))
              );
              return component?.short_name || null;
            };

            resolve({
              streetNumber: getComponent(['street_number']),
              street: getComponent(['route']),
              city: getComponent(['locality', 'sublocality']),
              region: getComponent(['administrative_area_level_1']),
              subregion: getComponent(['administrative_area_level_2']),
              postalCode: getComponent(['postal_code']),
              country: getComponent(['country']),
              isoCountryCode: getShortComponent(['country']),
              name: place.name,
              latitude: place.geometry.location.lat(),
              longitude: place.geometry.location.lng(),
              placeId: placeId,
              formattedAddress: place.formatted_address,
            });
          });
        });
      }

      // For native platforms, use direct Google Maps API
      const baseUrl = 'https://maps.googleapis.com/maps/api/place/details/json';
      const params = new URLSearchParams({
        place_id: placeId,
        key: GOOGLE_MAPS_API_KEY!,
        fields: 'address_components,formatted_address,geometry,name',
      });

      const response = await fetch(`${baseUrl}?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Google Place Details API HTTP error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'REQUEST_DENIED') {
        throw new Error('Google Place Details API access denied. Please check your API key and permissions.');
      }
      
      if (data.status === 'OVER_QUERY_LIMIT') {
        throw new Error('Google Place Details API quota exceeded. Please check your usage limits.');
      }
      
      if (data.status !== 'OK') {
        throw new Error(`Google Place Details API error: ${data.status}${data.error_message ? ` - ${data.error_message}` : ''}`);
      }

      const result = data.result;
      const addressComponents = result.address_components || [];
      
      // Parse address components
      const getComponent = (types: string[]) => {
        const component = addressComponents.find((comp: any) => 
          types.some(type => comp.types.includes(type))
        );
        return component?.long_name || null;
      };

      const getShortComponent = (types: string[]) => {
        const component = addressComponents.find((comp: any) => 
          types.some(type => comp.types.includes(type))
        );
        return component?.short_name || null;
      };

      return {
        streetNumber: getComponent(['street_number']),
        street: getComponent(['route']),
        city: getComponent(['locality', 'sublocality']),
        region: getComponent(['administrative_area_level_1']),
        subregion: getComponent(['administrative_area_level_2']),
        postalCode: getComponent(['postal_code']),
        country: getComponent(['country']),
        isoCountryCode: getShortComponent(['country']),
        name: result.name,
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
        placeId: placeId,
        formattedAddress: result.formatted_address,
      };
    });

    // Cache the result
    placeDetailsCache.set(placeId, result, CACHE_CONFIG.PLACE_DETAILS_CACHE_DURATION);
    
    return result;

  } catch (error) {
    console.error('Google Place Details error:', error);
    const recovery = analyzeGoogleMapsError(error as Error);
    if (alertFn) {
      alertFn(recovery.userMessage);
    }
    throw error;
  }
};

/**
 * Enhanced reverse geocoding using Google Maps Geocoding API with caching
 */
export const reverseGeocodeGoogle = async (
  latitude: number,
  longitude: number,
  alertFn?: (message: string) => void
): Promise<GooglePlaceDetails | null> => {
  return retryWithBackoff(async () => reverseGeocodeGoogleInternal(latitude, longitude, alertFn));
};

const reverseGeocodeGoogleInternal = async (
  latitude: number,
  longitude: number,
  alertFn?: (message: string) => void
): Promise<GooglePlaceDetails | null> => {
  ensureGoogleMapsConfigured();

  // Create cache key
  const cacheKey = `reverse_${latitude.toFixed(6)}_${longitude.toFixed(6)}`;
  
  // Check cache first
  const cachedResult = reverseGeocodeCache.get(cacheKey) as GooglePlaceDetails | null;
  if (cachedResult) {
    return cachedResult;
  }

  try {
    const result = await PerformanceMonitor.measureAsync('reverse_geocode', async () => {
      if (Platform.OS === 'web') {
        // Use Google Maps JavaScript API for web
        const services = await initializeGoogleMapsServices();
        if (!services) throw new Error('Google Maps services not available');

        return new Promise<GooglePlaceDetails | null>((resolve, reject) => {
          const latlng = new window.google.maps.LatLng(latitude, longitude);
          
          services.geocoder.geocode({
            location: latlng
          }, (results: any, status: any) => {
            if (status !== window.google.maps.GeocoderStatus.OK) {
              if (status === window.google.maps.GeocoderStatus.ZERO_RESULTS) {
                resolve(null);
                return;
              }
              reject(new Error(`Google Geocoding API error: ${status}`));
              return;
            }

            if (!results || results.length === 0) {
              resolve(null);
              return;
            }

            const result = results[0];
            const addressComponents = result.address_components || [];
            
            // Parse address components
            const getComponent = (types: string[]) => {
              const component = addressComponents.find((comp: any) => 
                types.some(type => comp.types.includes(type))
              );
              return component?.long_name || null;
            };

            const getShortComponent = (types: string[]) => {
              const component = addressComponents.find((comp: any) => 
                types.some(type => comp.types.includes(type))
              );
              return component?.short_name || null;
            };

            resolve({
              streetNumber: getComponent(['street_number']),
              street: getComponent(['route']),
              city: getComponent(['locality', 'sublocality']),
              region: getComponent(['administrative_area_level_1']),
              subregion: getComponent(['administrative_area_level_2']),
              postalCode: getComponent(['postal_code']),
              country: getComponent(['country']),
              isoCountryCode: getShortComponent(['country']),
              name: getComponent(['premise', 'establishment']) || null,
              latitude,
              longitude,
              placeId: result.place_id,
              formattedAddress: result.formatted_address,
            });
          });
        });
      }

      // For native platforms, use direct Google Maps API
      const baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
      const params = new URLSearchParams({
        latlng: `${latitude},${longitude}`,
        key: GOOGLE_MAPS_API_KEY!,
        result_type: 'street_address|premise',
      });

      const response = await fetch(`${baseUrl}?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Google Geocoding API HTTP error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'REQUEST_DENIED') {
        throw new Error('Google Geocoding API access denied. Please check your API key and permissions.');
      }
      
      if (data.status === 'OVER_QUERY_LIMIT') {
        throw new Error('Google Geocoding API quota exceeded. Please check your usage limits.');
      }
      
      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        throw new Error(`Google Geocoding API error: ${data.status}${data.error_message ? ` - ${data.error_message}` : ''}`);
      }

      if (!data.results || data.results.length === 0) {
        return null;
      }

      const result = data.results[0];
      const addressComponents = result.address_components || [];
      
      // Parse address components
      const getComponent = (types: string[]) => {
        const component = addressComponents.find((comp: any) => 
          types.some(type => comp.types.includes(type))
        );
        return component?.long_name || null;
      };

      const getShortComponent = (types: string[]) => {
        const component = addressComponents.find((comp: any) => 
          types.some(type => comp.types.includes(type))
        );
        return component?.short_name || null;
      };

      return {
        streetNumber: getComponent(['street_number']),
        street: getComponent(['route']),
        city: getComponent(['locality', 'sublocality']),
        region: getComponent(['administrative_area_level_1']),
        subregion: getComponent(['administrative_area_level_2']),
        postalCode: getComponent(['postal_code']),
        country: getComponent(['country']),
        isoCountryCode: getShortComponent(['country']),
        name: getComponent(['premise', 'establishment']) || null,
        latitude,
        longitude,
        placeId: result.place_id,
        formattedAddress: result.formatted_address,
      };
    });

    // Cache the result (including null results to avoid repeated API calls)
    reverseGeocodeCache.set(cacheKey, result, CACHE_CONFIG.REVERSE_GEOCODE_CACHE_DURATION);
    
    return result;

  } catch (error) {
    console.error('Google reverse geocoding error:', error);
    const recovery = analyzeGoogleMapsError(error as Error);
    if (alertFn) {
      alertFn(recovery.userMessage);
    }
    throw error;
  }
};
