import * as Location from 'expo-location';
import { Platform } from 'react-native';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface LocationError {
  code: string;
  message: string;
}

export interface AddressResult {
  streetNumber?: string | null;
  street?: string | null;
  city?: string | null;
  region?: string | null;
  subregion?: string | null;
  postalCode?: string | null;
  country?: string | null;
  isoCountryCode?: string | null;
  name?: string | null;
  district?: string | null;
  timezone?: string | null;
}

export interface PlaceSuggestion {
  id: string;
  displayName: string;
  address: string;
  latitude: number;
  longitude: number;
  country?: string | null;
}

// Alert function type for consistent error handling
type AlertFunction = (message: string, title?: string) => void;

/**
 * Get current location using browser's Geolocation API (web fallback)
 */
const getCurrentLocationWeb = (alertFn?: AlertFunction): Promise<LocationCoords | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser');
      alertFn?.('Your browser does not support location services.', 'Location Not Supported');
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Web geolocation error:', error);
        alertFn?.('Unable to get your current location. Please enable location access in your browser.', 'Location Error');
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    );
  });
};

/**
 * Request location permissions and get current location
 */
export const getCurrentLocation = async (alertFn?: AlertFunction): Promise<LocationCoords | null> => {
  try {
    // On web, use browser's Geolocation API
    if (Platform.OS === 'web') {
      return await getCurrentLocationWeb(alertFn);
    }

    // On native platforms, use Expo Location
    const servicesEnabled = await Location.hasServicesEnabledAsync();
    if (!servicesEnabled) {
      alertFn?.('Please enable Location Services to get your current position.', 'Location Services Disabled');
      return null;
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      alertFn?.('PardoMart needs location access to show nearby stores and calculate delivery options.', 'Location Permission Required');
      return null;
    }

    // Get current position with timeout
    const locationPromise = Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Location request timed out')), 20000);
    });
    
    try {
      const location = await Promise.race([locationPromise, timeoutPromise]);
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (err) {
      // Fallback to last known position if available
      const lastKnown = await Location.getLastKnownPositionAsync();
      if (lastKnown) {
        return {
          latitude: lastKnown.coords.latitude,
          longitude: lastKnown.coords.longitude,
        };
      }
      throw err;
    }
  } catch (error) {
    console.error('Error getting location:', error);
    alertFn?.('Unable to get your current location. Please check your location settings.', 'Location Error');
    return null;
  }
};

/**
 * Check if location services are enabled
 */
export const isLocationEnabled = async (): Promise<boolean> => {
  try {
    // On web, check if geolocation is available
    if (Platform.OS === 'web') {
      return !!navigator.geolocation;
    }
    
    return await Location.hasServicesEnabledAsync();
  } catch (error) {
    console.error('Error checking location services:', error);
    return false;
  }
};

/**
 * Get location permissions status
 */
export const getLocationPermissionStatus = async (): Promise<Location.PermissionStatus> => {
  try {
    // On web, we can't really check permission status beforehand
    if (Platform.OS === 'web') {
      return navigator.geolocation 
        ? Location.PermissionStatus.UNDETERMINED 
        : Location.PermissionStatus.DENIED;
    }
    
    const { status } = await Location.getForegroundPermissionsAsync();
    return status;
  } catch (error) {
    console.error('Error getting location permission status:', error);
    return Location.PermissionStatus.UNDETERMINED;
  }
};

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export const calculateDistance = (
  coord1: LocationCoords,
  coord2: LocationCoords
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(coord2.latitude - coord1.latitude);
  const dLon = toRadians(coord2.longitude - coord1.longitude);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.latitude)) *
      Math.cos(toRadians(coord2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

/**
 * Convert degrees to radians
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Format distance for display
 */
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  } else {
    return `${distance.toFixed(1)}km`;
  }
};

/**
 * Watch location changes using browser's watchPosition (web)
 */
const watchLocationWeb = (
  callback: (location: LocationCoords) => void,
  errorCallback?: (error: LocationError) => void,
  alertFn?: AlertFunction
): number | null => {
  if (!navigator.geolocation) {
    alertFn?.('Your browser does not support location tracking.', 'Location Not Supported');
    if (errorCallback) {
      errorCallback({
        code: 'NOT_SUPPORTED',
        message: 'Geolocation is not supported by this browser',
      });
    }
    return null;
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      callback({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    (error) => {
      alertFn?.('Unable to track your location. Please check your browser settings.', 'Location Tracking Error');
      if (errorCallback) {
        errorCallback({
          code: 'WATCH_ERROR',
          message: error.message,
        });
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 30000, // 30 seconds
    }
  );
};

/**
 * Watch location changes (for real-time updates)
 */
export const watchLocation = async (
  callback: (location: LocationCoords) => void,
  errorCallback?: (error: LocationError) => void,
  alertFn?: AlertFunction
): Promise<Location.LocationSubscription | number | null> => {
  try {
    // On web, use browser's watchPosition
    if (Platform.OS === 'web') {
      return watchLocationWeb(callback, errorCallback, alertFn);
    }

    // On native platforms, use Expo Location
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      alertFn?.('PardoMart needs location access to track your location for better service.', 'Location Permission Required');
      if (errorCallback) {
        errorCallback({
          code: 'PERMISSION_DENIED',
          message: 'Location permission not granted',
        });
      }
      return null;
    }

    return await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 30000, // Update every 30 seconds
        distanceInterval: 100, // Update when moved 100 meters
      },
      (location: Location.LocationObject) => {
        callback({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    );
  } catch (error) {
    console.error('Error watching location:', error);
    alertFn?.('Failed to start location tracking. Please check your location settings.', 'Location Tracking Error');
    if (errorCallback) {
      errorCallback({
        code: 'WATCH_ERROR',
        message: 'Failed to watch location changes',
      });
    }
    return null;
  }
};

/**
 * Stop watching location changes
 */
export const stopWatchingLocation = (watchId: Location.LocationSubscription | number | null) => {
  if (!watchId) return;

  try {
    if (Platform.OS === 'web') {
      // On web, watchId is a number
      navigator.geolocation.clearWatch(watchId as number);
    } else {
      // On native, watchId is a LocationSubscription
      (watchId as Location.LocationSubscription).remove();
    }
  } catch (error) {
    console.error('Error stopping location watch:', error);
  }
};

/**
 * Search for places using Nominatim API (fallback when Google Maps not available)
 */
export const searchPlaces = async (
  query: string,
  alertFn?: AlertFunction
): Promise<PlaceSuggestion[]> => {
  if (!query || query.trim().length < 3) {
    return [];
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
    );
    
    if (!response.ok) {
      throw new Error(`Search failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.map((item: any) => ({
      id: item.place_id?.toString() || `${item.lat}_${item.lon}`,
      displayName: item.display_name || 'Unknown location',
      address: formatNominatimAddress(item),
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      country: item.address?.country_code ? String(item.address.country_code).toUpperCase() : null,
    }));
  } catch (error) {
    console.error('Place search error:', error);
    alertFn?.('Unable to search for places. Please try again.', 'Search Error');
    return [];
  }
};

/**
 * Format Nominatim address for display
 */
const formatNominatimAddress = (item: any): string => {
  const addr = item.address || {};
  const parts = [];
  
  // Add house number and street
  if (addr.house_number && addr.road) {
    parts.push(`${addr.house_number} ${addr.road}`);
  } else if (addr.road) {
    parts.push(addr.road);
  }
  
  // Add city/town/village
  const city = addr.city || addr.town || addr.village || addr.suburb;
  if (city) {
    parts.push(city);
  }
  
  // Add state
  if (addr.state) {
    parts.push(addr.state);
  }
  
  return parts.join(', ') || item.display_name || 'Unknown location';
};

/**
 * Convert coordinates to a structured address object
 * This is more reliable for creating new addresses than reverseGeocode, which returns a formatted string.
 */
export const getStructuredAddress = async (
  latitude: number,
  longitude: number,
  alertFn?: AlertFunction
): Promise<LocationCoords & Partial<AddressResult> | null> => {
  try {
    // On web, use Nominatim and map its response to a Location-like object
    if (Platform.OS === 'web') {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      if (!response.ok) throw new Error('Nominatim request failed');
      const data = await response.json();
      if (data && data.address) {
        const addr = data.address;
        return {
          latitude,
          longitude,
          streetNumber: addr.house_number || null,
          street: addr.road || null,
          city: addr.city || addr.town || addr.village || null,
          region: addr.state || addr.region || null,
          subregion: addr.suburb || addr.county || null,
          postalCode: addr.postcode || null,
          country: addr.country || null,
          isoCountryCode: addr.country_code ? String(addr.country_code).toUpperCase() : null,
          name: data.name || null,
        };
      }
      return null;
    }

    // On native, use Expo Location's powerful reverse geocoding
    const results = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (results && results.length > 0) {
      // Combine coords with the first address result
      return {
        latitude,
        longitude,
        ...results[0],
      };
    }

    return null;
  } catch (error) {
    console.error('Structured reverse geocoding error:', error);
    alertFn?.('Unable to get detailed address for this location.', 'Geocoding Error');
    return null;
  }
};

/**
 * Get a concise place name for given coordinates
 */
export const getPlaceName = async (
  latitude: number,
  longitude: number,
  alertFn?: AlertFunction
): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        if (data) {
          const addr = data.address || {};
          const candidate = data.name || addr.amenity || addr.shop || addr.tourism || addr.building || addr.road || addr.neighbourhood || addr.suburb || addr.city || addr.town || addr.village;
          if (candidate) {
            return `${candidate}`;
          }
          if (data.display_name) {
            return data.display_name.split(',')[0];
          }
        }
      } catch (error) {
        console.warn('Web place name lookup failed:', error);
      }
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }

    const results = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (results && results.length > 0) {
      const r = results[0];
      return r.name || r.street || r.district || r.city || r.region || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  } catch (error) {
    console.error('Place name lookup error:', error);
    alertFn?.('Unable to determine the place name for this location.', 'Place Name Error');
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  }
};

/**
 * Validate coordinates are within valid ranges
 */
export const validateCoordinates = (latitude: number, longitude: number): boolean => {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    !isNaN(latitude) &&
    !isNaN(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180 &&
    !(latitude === 0 && longitude === 0)
  );
};

/**
 * Create an alert function that uses the showError pattern
 * This helper ensures consistent error handling across the app
 */
export const createAlertFunction = (
  showError: (message: string, title?: string) => void,
  showWarning?: (message: string, title?: string) => void,
  showInfo?: (message: string, title?: string) => void
): AlertFunction => {
  return (message: string, title?: string) => {
    // Determine alert type based on title or message content
    if (title && (title.toLowerCase().includes('warning') || title.toLowerCase().includes('permission'))) {
      showWarning?.(message, title) || showError(message, title);
    } else if (title && title.toLowerCase().includes('info')) {
      showInfo?.(message, title) || showError(message, title);
    } else {
      showError(message, title);
    }
  };
};
