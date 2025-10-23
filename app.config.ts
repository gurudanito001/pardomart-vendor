import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Pardomart Vendor',
  slug: 'pardomart-vendor',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.pardomart.vendor',
    buildNumber: '1',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.pardomart.vendor',
    versionCode: 1,
    permissions: [
      'CAMERA',
      'READ_EXTERNAL_STORAGE',
      'WRITE_EXTERNAL_STORAGE',
    ],
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-web-browser',
    [
      'expo-image-picker',
      {
        photosPermission: 'The app accesses your photos to let you select profile pictures and upload documents.',
        cameraPermission: 'The app accesses your camera to let you take profile pictures and upload documents.',
      },
    ],
    "expo-barcode-scanner",
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    env: process.env.NODE_ENV || 'development',
    eas: {
      projectId: '81714e2e-35d4-430c-9db0-c6ad48f3280c',
    },
  },
});
