/**
 * Performance Optimizations and Runtime Error Prevention
 * 
 * This file contains utilities and configurations to prevent runtime errors
 * and optimize performance for the enhanced location features.
 */

import { AppState, Platform } from 'react-native';

// Cache configurations for API responses
export const CACHE_CONFIG = {
  // Cache duration for place search results (5 minutes)
  PLACE_SEARCH_CACHE_DURATION: 5 * 60 * 1000,
  
  // Cache duration for reverse geocoding (30 minutes)
  REVERSE_GEOCODE_CACHE_DURATION: 30 * 60 * 1000,
  
  // Cache duration for place details (1 hour)
  PLACE_DETAILS_CACHE_DURATION: 60 * 60 * 1000,
  
  // Maximum cache size (number of entries)
  MAX_CACHE_SIZE: 100,
};

// Debounce configurations
export const DEBOUNCE_CONFIG = {
  // Search input debounce delay
  SEARCH_DEBOUNCE_DELAY: 300,
  
  // Location update debounce delay
  LOCATION_UPDATE_DEBOUNCE_DELAY: 1000,
  
  // API retry delay
  API_RETRY_DELAY: 2000,
};

// Timeout configurations
export const TIMEOUT_CONFIG = {
  // Location request timeout
  LOCATION_TIMEOUT: 20000,
  
  // API request timeout
  API_TIMEOUT: 10000,
  
  // Search request timeout
  SEARCH_TIMEOUT: 8000,
};

/**
 * Simple in-memory cache implementation for API responses
 */
class SimpleCache<T> {
  private cache = new Map<string, { data: T; timestamp: number; ttl: number }>();
  private maxSize: number;

  constructor(maxSize: number = CACHE_CONFIG.MAX_CACHE_SIZE) {
    this.maxSize = maxSize;
  }

  set(key: string, data: T, ttl: number): void {
    // Clean up expired entries if cache is getting full
    if (this.cache.size >= this.maxSize) {
      this.cleanup();
    }

    // If still at max size, remove oldest entry
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  size(): number {
    this.cleanup(); // Clean up before returning size
    return this.cache.size;
  }
}

// Global cache instances
export const placeSearchCache = new SimpleCache(50);
export const reverseGeocodeCache = new SimpleCache(30);
export const placeDetailsCache = new SimpleCache(100);

/**
 * Enhanced debounce function with immediate execution option
 */
export function enhancedDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastCallTime = 0;

  return function debouncedFunction(this: unknown, ...args: Parameters<T>) {
    const now = Date.now();
    const shouldCallImmediately = immediate && (now - lastCallTime > delay);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (shouldCallImmediately) {
      lastCallTime = now;
      func.apply(this as any, args);
    } else {
      timeoutId = setTimeout(() => {
        lastCallTime = Date.now();
        func.apply(this as any, args);
        timeoutId = null;
      }, delay);
    }
  };
}

/**
 * Coordinate validation with enhanced error checking
 */
export function validateCoordinates(lat: number, lon: number): {
  isValid: boolean;
  error?: string;
} {
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    return { isValid: false, error: 'Coordinates must be numbers' };
  }

  if (isNaN(lat) || isNaN(lon)) {
    return { isValid: false, error: 'Coordinates cannot be NaN' };
  }

  if (!isFinite(lat) || !isFinite(lon)) {
    return { isValid: false, error: 'Coordinates must be finite numbers' };
  }

  if (lat < -90 || lat > 90) {
    return { isValid: false, error: 'Latitude must be between -90 and 90' };
  }

  if (lon < -180 || lon > 180) {
    return { isValid: false, error: 'Longitude must be between -180 and 180' };
  }

  if (lat === 0 && lon === 0) {
    return { isValid: false, error: 'Null Island coordinates not allowed' };
  }

  return { isValid: true };
}

/**
 * Enhanced error handling for API requests
 */
export function handleApiError(error: any, context: string): string {
  console.error(`API Error in ${context}:`, error);

  // Network errors
  if (!navigator.onLine && Platform.OS === 'web') {
    return 'No internet connection. Please check your network and try again.';
  }

  // Timeout errors
  if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }

  // Rate limiting
  if (error?.response?.status === 429) {
    return 'Too many requests. Please wait a moment and try again.';
  }

  // Authentication errors
  if (error?.response?.status === 401 || error?.response?.status === 403) {
    return 'API authentication failed. Please check your configuration.';
  }

  // Quota exceeded
  if (error?.response?.data?.error_message?.includes('OVER_QUERY_LIMIT')) {
    return 'Service quota exceeded. Please try again later.';
  }

  // API key issues
  if (error?.response?.data?.error_message?.includes('API key')) {
    return 'API key configuration issue. Please contact support.';
  }

  // Generic API errors
  if (error?.response?.data?.error_message) {
    return error.response.data.error_message;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Memory usage monitoring and cleanup
 */
export class MemoryManager {
  private static instance: MemoryManager;
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  private constructor() {}

  static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  startPeriodicCleanup(intervalMs: number = 5 * 60 * 1000): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    this.cleanupInterval = setInterval(() => {
      this.performCleanup();
    }, intervalMs);
  }

  stopPeriodicCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  performCleanup(): void {
    try {
      // Clear expired cache entries
      placeSearchCache.clear();
      reverseGeocodeCache.clear();
      placeDetailsCache.clear();

      // Force garbage collection if available (Node.js)
      if (global.gc && typeof global.gc === 'function') {
        global.gc();
      }

      console.log('Memory cleanup completed');
    } catch (error) {
      console.warn('Memory cleanup failed:', error);
    }
  }
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private static timers = new Map<string, number>();

  static startTimer(label: string): void {
    this.timers.set(label, Date.now());
  }

  static endTimer(label: string): number {
    const startTime = this.timers.get(label);
    if (!startTime) {
      console.warn(`Timer '${label}' was not started`);
      return 0;
    }

    const duration = Date.now() - startTime;
    this.timers.delete(label);
    
    console.log(`⏱️ ${label}: ${duration}ms`);
    return duration;
  }

  static async measureAsync<T>(
    label: string, 
    asyncFunction: () => Promise<T>
  ): Promise<T> {
    this.startTimer(label);
    try {
      const result = await asyncFunction();
      this.endTimer(label);
      return result;
    } catch (error) {
      this.endTimer(label);
      throw error;
    }
  }
}

/**
 * Initialize performance optimizations
 */
export function initializePerformanceOptimizations(): void {
  // Start memory manager
  const memoryManager = MemoryManager.getInstance();
  memoryManager.startPeriodicCleanup();

  // Log initialization
  console.log('🚀 Performance optimizations initialized');
  
  // Clean up on app termination (if possible)
  if (Platform.OS !== 'web') {
    // For React Native apps
    AppState.addEventListener('change', (nextAppState: string) => {
      if (nextAppState === 'background') {
        memoryManager.performCleanup();
      }
    });
  }
}

/**
 * Runtime error prevention utilities
 */
export const RuntimeSafety = {
  /**
   * Safe JSON parse with fallback
   */
  safeJsonParse<T>(jsonString: string, fallback: T): T {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.warn('JSON parse failed, using fallback:', error);
      return fallback;
    }
  },

  /**
   * Safe property access with fallback
   */
  safeGet<T>(obj: any, path: string, fallback: T): T {
    try {
      const value = path.split('.').reduce((current, key) => current?.[key], obj);
      return value !== undefined ? value : fallback;
    } catch (error) {
      console.warn('Safe property access failed, using fallback:', error);
      return fallback;
    }
  },

  /**
   * Safe async operation wrapper
   */
  async safeAsync<T>(
    operation: () => Promise<T>,
    fallback: T,
    errorContext: string = 'Unknown operation'
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      console.error(`Safe async operation failed (${errorContext}):`, error);
      return fallback;
    }
  },
};
