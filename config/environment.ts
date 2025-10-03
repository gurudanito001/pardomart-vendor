interface Environment {
  API_BASE_URL: string;
  API_TIMEOUT: number;
  ENABLE_LOGGING: boolean;
  SENTRY_DSN?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_MAPS_API_KEY?: string;
  FACEBOOK_APP_ID?: string;
  APPLE_CLIENT_ID?: string;
}

interface FeatureFlags {
  ENABLE_BIOMETRIC_AUTH: boolean;
  ENABLE_PUSH_NOTIFICATIONS: boolean;
  ENABLE_ANALYTICS: boolean;
  ENABLE_CRASH_REPORTING: boolean;
  ENABLE_SOCIAL_LOGIN: boolean;
}

// Development environment
const development: Environment = {
  API_BASE_URL: process.env.API_BASE_URL || 'https://pardomart-node-api-vaje.onrender.com/api/v1',
  API_TIMEOUT: 30000,
  ENABLE_LOGGING: true,
  // Add your development keys here
  GOOGLE_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
  FACEBOOK_APP_ID: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID,
  APPLE_CLIENT_ID: process.env.EXPO_PUBLIC_APPLE_CLIENT_ID,
};

// Staging environment
const staging: Environment = {
  API_BASE_URL: process.env.API_BASE_URL || 'https://pardomart-node-api-vaje.onrender.com/api/v1',
  API_TIMEOUT: 15000,
  ENABLE_LOGGING: true,
  SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN,
  GOOGLE_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
  FACEBOOK_APP_ID: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID,
  APPLE_CLIENT_ID: process.env.EXPO_PUBLIC_APPLE_CLIENT_ID,
};

// Production environment
const production: Environment = {
  API_BASE_URL:  process.env.API_BASE_URL || 'https://pardomart-node-api-vaje.onrender.com/api/v1',
  API_TIMEOUT: 20000,
  ENABLE_LOGGING: false,
  SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN,
  GOOGLE_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
  FACEBOOK_APP_ID: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID,
  APPLE_CLIENT_ID: process.env.EXPO_PUBLIC_APPLE_CLIENT_ID,
};

// Feature flags for different environments
const developmentFeatures: FeatureFlags = {
  ENABLE_BIOMETRIC_AUTH: true,
  ENABLE_PUSH_NOTIFICATIONS: false,
  ENABLE_ANALYTICS: false,
  ENABLE_CRASH_REPORTING: false,
  ENABLE_SOCIAL_LOGIN: true,
};

const stagingFeatures: FeatureFlags = {
  ENABLE_BIOMETRIC_AUTH: true,
  ENABLE_PUSH_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: true,
  ENABLE_CRASH_REPORTING: true,
  ENABLE_SOCIAL_LOGIN: true,
};

const productionFeatures: FeatureFlags = {
  ENABLE_BIOMETRIC_AUTH: true,
  ENABLE_PUSH_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: true,
  ENABLE_CRASH_REPORTING: true,
  ENABLE_SOCIAL_LOGIN: true,
};

// Get current environment
const getEnvironment = (): 'development' | 'staging' | 'production' => {
  const env = process.env.NODE_ENV;
  const releaseChannel = process.env.EXPO_PUBLIC_RELEASE_CHANNEL;

  if (env === 'production' && releaseChannel === 'staging') {
    return 'staging';
  }
  
  if (env === 'production') {
    return 'production';
  }
  
  return 'development';
};

// Export configuration based on environment
const currentEnv = getEnvironment();

const environments = {
  development,
  staging,
  production,
};

const features = {
  development: developmentFeatures,
  staging: stagingFeatures,
  production: productionFeatures,
};

export const config: Environment = environments[currentEnv];
export const featureFlags: FeatureFlags = features[currentEnv];
export const isDevelopment = currentEnv === 'development';
export const isStaging = currentEnv === 'staging';
export const isProduction = currentEnv === 'production';

// Helper function to check if a feature is enabled
export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean => {
  return featureFlags[feature];
};

// Helper function to get API URL with endpoint
export const getApiUrl = (endpoint: string): string => {
  return `${config.API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
};
