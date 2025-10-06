/**
 * Error recovery utilities for Google Maps API issues
 */

export interface ErrorRecoveryResult {
  canRetry: boolean;
  retryAfter?: number; // seconds
  userMessage: string;
  technicalDetails: string;
}

/**
 * Analyze Google Maps API errors and provide recovery strategies
 */
export const analyzeGoogleMapsError = (error: Error): ErrorRecoveryResult => {
  const errorMessage = error.message.toLowerCase();

  // Network connectivity issues
  if (errorMessage.includes('network error') || errorMessage.includes('fetch')) {
    return {
      canRetry: true,
      retryAfter: 5,
      userMessage: 'Network connection issue. Please check your internet connection and try again.',
      technicalDetails: 'Network request failed - check connectivity',
    };
  }

  // API key issues
  if (errorMessage.includes('request_denied') || errorMessage.includes('api key')) {
    return {
      canRetry: false,
      userMessage: 'Location service is temporarily unavailable. Please contact support.',
      technicalDetails: 'Google Maps API key configuration issue',
    };
  }

  // Quota exceeded
  if (errorMessage.includes('over_query_limit') || errorMessage.includes('quota')) {
    return {
      canRetry: true,
      retryAfter: 60,
      userMessage: 'Location service is temporarily busy. Please try again in a moment.',
      technicalDetails: 'Google Maps API quota exceeded',
    };
  }

  // Invalid request
  if (errorMessage.includes('invalid_request') || errorMessage.includes('zero_results')) {
    return {
      canRetry: false,
      userMessage: 'Please try a different search term or check your input.',
      technicalDetails: 'Invalid search parameters or no results found',
    };
  }

  // CORS issues (common in development)
  if (errorMessage.includes('cors') || errorMessage.includes('access-control')) {
    return {
      canRetry: false,
      userMessage: 'Service configuration issue. Please refresh the page.',
      technicalDetails: 'CORS policy blocking request - check API configuration',
    };
  }

  // Generic error
  return {
    canRetry: true,
    retryAfter: 10,
    userMessage: 'Something went wrong. Please try again.',
    technicalDetails: error.message,
  };
};

/**
 * Retry helper with exponential backoff
 */
export const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }

      const analysis = analyzeGoogleMapsError(error as Error);
      if (!analysis.canRetry) {
        throw error;
      }

      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error('Max retries exceeded');
};

/**
 * Check if the environment is properly configured for Google Maps
 */
export const validateGoogleMapsEnvironment = (): {
  isValid: boolean;
  issues: string[];
  recommendations: string[];
} => {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Check API key
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    issues.push('Google Maps API key is not configured');
    recommendations.push('Set EXPO_PUBLIC_GOOGLE_MAPS_API_KEY in your environment variables');
  } else if (apiKey === 'YOUR_GOOGLE_MAPS_API_KEY' || apiKey.length < 20) {
    issues.push('Google Maps API key appears to be invalid');
    recommendations.push('Ensure you have a valid Google Maps API key from Google Cloud Console');
  }

  // Check if we're in a supported environment
  if (typeof fetch === 'undefined') {
    issues.push('Fetch API is not available');
    recommendations.push('Ensure you are running in a supported environment with fetch support');
  }

  return {
    isValid: issues.length === 0,
    issues,
    recommendations,
  };
};
