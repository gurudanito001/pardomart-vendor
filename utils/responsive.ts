import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 11 Pro)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

export const screenData = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmallDevice: SCREEN_WIDTH < 375,
  isMediumDevice: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,
  isLargeDevice: SCREEN_WIDTH >= 414,
  isTablet: SCREEN_WIDTH >= 768,
};

// Responsive font size
export const responsiveFont = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  
  // Ensure minimum readable size
  return Math.max(newSize, size * 0.85);
};

// Responsive width/height
export const responsiveWidth = (width: number): number => {
  return (SCREEN_WIDTH * width) / 100;
};

export const responsiveHeight = (height: number): number => {
  return (SCREEN_HEIGHT * height) / 100;
};

// Responsive spacing
export const responsiveSpacing = (spacing: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  return spacing * scale;
};

// Device type helpers
export const isIOS = () => {
  return require('react-native').Platform.OS === 'ios';
};

export const isAndroid = () => {
  return require('react-native').Platform.OS === 'android';
};

// Safe area helpers
export const getStatusBarHeight = (): number => {
  if (isIOS()) {
    if (SCREEN_HEIGHT >= 812) {
      return 44; // iPhone X and newer
    }
    return 20; // iPhone 8 and older
  }
  return 24; // Android
};

export const getBottomSafeArea = (): number => {
  if (isIOS() && SCREEN_HEIGHT >= 812) {
    return 34; // iPhone X and newer
  }
  return 0;
};

// Responsive breakpoints
export const breakpoints = {
  small: 320,
  medium: 375,
  large: 414,
  tablet: 768,
  desktop: 1024,
};

export const isBreakpoint = (breakpoint: keyof typeof breakpoints): boolean => {
  return SCREEN_WIDTH >= breakpoints[breakpoint];
};
