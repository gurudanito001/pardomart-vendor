import { useCallback, useEffect, useState } from 'react';
import { PerformanceMonitor, initializePerformanceOptimizations, placeDetailsCache, placeSearchCache, reverseGeocodeCache } from '../utils/performanceOptimizations';
import { toast } from '../utils/toast';
import type { DeliveryAddress } from '../api/models';

// Import location utilities
import {
  AddressResult,
  LocationCoords,
  LocationError,
  PlaceSuggestion,
  calculateDistance,
  formatDistance,
  getCurrentLocation,
  getLocationPermissionStatus,
  getPlaceName,
  getStructuredAddress,
  isLocationEnabled,
  searchPlaces,
  stopWatchingLocation,
  watchLocation
} from '../utils/location';

// Import Google Maps utilities
import {
  GooglePlaceDetails,
  GooglePlacesSuggestion,
  getPlaceDetailsGoogle,
  isGoogleMapsConfigured,
  reverseGeocodeGoogle,
  searchPlacesGoogle
} from '../utils/googleMapsLocation';

export interface LocationState {
  location: LocationCoords | null;
  locationAddress: string;
  isLoadingLocation: boolean;
  hasLocationPermission: boolean | null;
  isLocationServiceEnabled: boolean | null;
}

/**
 * Consolidated location hook that provides comprehensive location services
 * with Google Maps integration, graceful fallbacks, and proper error handling
 */
// Hoisted validator to avoid TDZ issues when used before hook callbacks are initialized
const isValidCoords = (latitude: number, longitude: number): boolean => {
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

export const useLocation = () => {
  const showError = useCallback((m: string) => toast.error(m), []);
  const showWarning = useCallback((m: string) => toast.warning(m), []);
  const showInfo = useCallback((m: string) => toast.info(m), []);
  
  // State management
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [locationAddress, setLocationAddress] = useState<string>('Getting location...');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
  const [isLocationServiceEnabled, setIsLocationServiceEnabled] = useState<boolean | null>(null);
  const [watchId, setWatchId] = useState<any>(null);

  // Check location services and permissions on mount + initialize performance optimizations
  useEffect(() => {
    const checkLocationStatus = async () => {
      try {
        // Initialize performance optimizations
        initializePerformanceOptimizations();

        const serviceEnabled = await isLocationEnabled();
        setIsLocationServiceEnabled(serviceEnabled);

        const permissionStatus = await getLocationPermissionStatus();
        setHasLocationPermission(permissionStatus === 'granted');
      } catch (error) {
        console.error('Error checking location status:', error);
      }
    };

    checkLocationStatus();
  }, []);

  /**
   * Format address from DeliveryAddress object
   */
  const formatAddress = useCallback((address: DeliveryAddress): string => {
    return [address.addressLine1, address.city, address.state].filter(Boolean).join(', ');
  }, []);

  /**
   * Enhanced method to update location using coordinates with better error handling
   */
  const updateLocationFromCoords = useCallback(async (latitude: number, longitude: number) => {
    setLocation({ latitude, longitude });
    setIsLoadingLocation(true);

    try {
      await PerformanceMonitor.measureAsync('update_location_from_coords', async () => {
      // First try enhanced Google Maps reverse geocoding if available
      if (isGoogleMapsConfigured()) {
        const details = await reverseGeocodeGoogle(latitude, longitude);
        if (details) {
          const addressText = details.formattedAddress || 
            [details.street, details.city, details.region].filter(Boolean).join(', ');
          setLocationAddress(addressText || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          return;
        }
      }

      // Fallback to basic place name lookup
      const placeName = await getPlaceName(latitude, longitude);
      if (placeName && !placeName.includes(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)) {
        setLocationAddress(placeName);
        return;
      }

      // Final fallback to structured address
      const structuredAddress = await getStructuredAddress(latitude, longitude);
      const addressText = structuredAddress?.name || 
        structuredAddress?.street || 
        structuredAddress?.city || 
        `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      setLocationAddress(addressText);
      });

    } catch (error) {
      console.error('Error getting location address:', error);
      setLocationAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
    } finally {
      setIsLoadingLocation(false);
    }
  }, []);

  /**
   * Get current location with retry logic
   */
  const getCurrentLocationWithRetry = useCallback(async (
    maxRetries: number = 3
  ): Promise<LocationCoords | null> => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const coords = await getCurrentLocation();
        if (coords && isValidCoords(coords.latitude, coords.longitude)) {
          return coords;
        }
      } catch (error) {
        console.warn(`Location attempt ${attempt} failed:`, error);
        if (attempt === maxRetries) {
          showError('Unable to get your location after multiple attempts');
        }
      }

      // Wait before retry (except on last attempt)
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return null;
  }, [showError]);

  /**
   * Initialize location with multiple fallback strategies
   */
  const initializeLocation = useCallback(async (showGoogleMapsInfo: boolean = false) => {
    setIsLoadingLocation(true);

    try {
      return await PerformanceMonitor.measureAsync('initialize_location', async () => {
      // Show Google Maps availability info if requested
      if (showGoogleMapsInfo && !isGoogleMapsConfigured()) {
        showInfo('Google Maps API is not configured. Enhanced location features may not be available.');
      }

      const coords = await getCurrentLocationWithRetry(3);
      if (!coords) {
        setLocationAddress('Location unavailable');
        showError('Unable to determine your location. Please set a delivery address manually.');
        setIsLoadingLocation(false);
        return null;
      }

      await updateLocationFromCoords(coords.latitude, coords.longitude);
      return coords;
      });

    } catch (error) {
      console.error('Error initializing location:', error);
      showError('Failed to get your location. Please try again or set your address manually.');
      setLocationAddress('Location error');
      return null;
    } finally {
      setIsLoadingLocation(false);
    }
  }, [getCurrentLocationWithRetry, updateLocationFromCoords, showError, showInfo]);

  /**
   * Refresh current location
   */
  const refreshLocation = useCallback(async () => {
    setIsLoadingLocation(true);
    setLocationAddress('Updating location...');
    
    try {
      const coords = await getCurrentLocationWithRetry(2);
      if (coords) {
        await updateLocationFromCoords(coords.latitude, coords.longitude);
        showInfo('Location updated successfully');
        return coords;
      } else {
        setLocationAddress('Location unavailable');
        showError('Unable to refresh your location');
        return null;
      }
    } catch (error) {
      console.error('Error refreshing location:', error);
      setLocationAddress('Location error');
      showError('Failed to refresh location');
      return null;
    } finally {
      setIsLoadingLocation(false);
    }
  }, [getCurrentLocationWithRetry, updateLocationFromCoords, showInfo, showError]);

  /**
   * Search places with Google Maps or fallback to basic search
   */
  const searchForPlaces = useCallback(async (
    query: string,
    useCurrentLocation: boolean = true
  ): Promise<GooglePlacesSuggestion[] | PlaceSuggestion[]> => {
    if (!query || query.trim().length < 2) {
      return [];
    }

    try {
      let locationBias: LocationCoords | undefined;
      
      if (useCurrentLocation && location) {
        locationBias = location;
      }

      // Use Google Maps if configured
      if (isGoogleMapsConfigured()) {
        return await searchPlacesGoogle(query, locationBias);
      }

      // Fallback to basic search
      return await searchPlaces(query);
    } catch (error) {
      console.error('Place search error:', error);
      showError('Search temporarily unavailable. Please try again.');
      return [];
    }
  }, [location, showError]);

  /**
   * Get detailed place information (Google Maps only)
   */
  const getPlaceDetails = useCallback(async (
    placeId: string
  ): Promise<GooglePlaceDetails | null> => {
    if (!isGoogleMapsConfigured()) {
      showWarning('Google Maps API required for detailed place information');
      return null;
    }

    try {
      return await getPlaceDetailsGoogle(placeId);
    } catch (error) {
      console.error('Place details error:', error);
      showError('Failed to get place details');
      return null;
    }
  }, [showWarning, showError]);

  /**
   * Enhanced reverse geocoding
   */
  const reverseGeocode = useCallback(async (
    latitude: number,
    longitude: number
  ): Promise<GooglePlaceDetails | (LocationCoords & Partial<AddressResult>) | null> => {
    try {
      // Use Google Maps if configured
      if (isGoogleMapsConfigured()) {
        return await reverseGeocodeGoogle(latitude, longitude);
      }

      // Fallback to basic reverse geocoding
      return await getStructuredAddress(latitude, longitude);
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      showError('Failed to get address for this location');
      return null;
    }
  }, [showError]);

  /**
   * Watch location changes
   */
  const startWatchingLocation = useCallback(async () => {
    if (watchId) {
      stopWatchingLocation(watchId);
    }

    try {
      const newWatchId = await watchLocation(
        (newLocation: LocationCoords) => {
          setLocation(newLocation);
          updateLocationFromCoords(newLocation.latitude, newLocation.longitude);
        },
        (error: LocationError) => {
          console.error('Location watching error:', error);
          showError(`Location tracking error: ${error.message}`);
        }
      );
      
      setWatchId(newWatchId);
      return newWatchId;
    } catch (error) {
      console.error('Error starting location watch:', error);
      showError('Failed to start location tracking');
      return null;
    }
  }, [watchId, updateLocationFromCoords, showError]);

  /**
   * Stop watching location changes
   */
  const stopWatchingLocationChanges = useCallback(() => {
    if (watchId) {
      stopWatchingLocation(watchId);
      setWatchId(null);
    }
  }, [watchId]);

  /**
   * Calculate distance between two coordinates
   */
  const getDistance = useCallback((
    coord1: LocationCoords,
    coord2: LocationCoords
  ): number => {
    return calculateDistance(coord1, coord2);
  }, []);

  /**
   * Get formatted distance string
   */
  const getFormattedDistance = useCallback((
    coord1: LocationCoords,
    coord2: LocationCoords
  ): string => {
    const distance = calculateDistance(coord1, coord2);
    return formatDistance(distance);
  }, []);

  /**
   * Validate coordinates
   */
  const validateCoordinates = useCallback((latitude: number, longitude: number): boolean => {
    return isValidCoords(latitude, longitude);
  }, []);

  /**
   * Check if current location is valid
   */
  const hasValidLocation = useCallback((): boolean => {
    return !!(location && validateCoordinates(location.latitude, location.longitude));
  }, [location, validateCoordinates]);

  /**
   * Clean up on unmount
   */
  useEffect(() => {
    return () => {
      if (watchId) {
        stopWatchingLocation(watchId);
      }
    };
  }, [watchId]);

  /**
   * Get cache statistics for debugging
   */
  const getCacheStats = useCallback(() => {
    return {
      placeSearch: placeSearchCache.size(),
      reverseGeocode: reverseGeocodeCache.size(),
      placeDetails: placeDetailsCache.size(),
    };
  }, []);

  /**
   * Clear all caches
   */
  const clearCaches = useCallback(() => {
    placeSearchCache.clear();
    reverseGeocodeCache.clear();
    placeDetailsCache.clear();
  }, []);

  // Return consolidated location state and methods
  return {
    // Location state
    location,
    locationAddress,
    isLoadingLocation,
    hasLocationPermission,
    isLocationServiceEnabled,
    isWatchingLocation: !!watchId,

    // Core location methods
    initializeLocation,
    refreshLocation,
    getCurrentLocation: getCurrentLocationWithRetry,
    updateLocationFromCoords,

    // Place search and details
    searchForPlaces,
    getPlaceDetails,
    reverseGeocode,

    // Location tracking
    startWatchingLocation,
    stopWatchingLocation: stopWatchingLocationChanges,

    // Utility methods
    getDistance,
    getFormattedDistance,
    validateCoordinates,
    hasValidLocation,
    formatAddress,

    // Performance and debugging
    getCacheStats,
    clearCaches,

    // Status checks
    isGoogleMapsConfigured: isGoogleMapsConfigured(),
  };
};
