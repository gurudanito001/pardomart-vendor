import { StyleSheet } from 'react-native';
import { responsiveFont, responsiveSpacing } from '../utils/responsive';

// Color palette
export const colors = {
  primary: '#06888C',
  primaryLight: 'rgba(6, 136, 140, 0.02)',
  secondary: '#2B84B3',
  success: '#01891C',
  warning: '#F8BB15',
  error: '#E94435',
  
  // Text colors
  textPrimary: '#000',
  textSecondary: '#2B2829',
  textMuted: '#7C8BA0',
  textLight: '#888',
  textPlaceholder: '#6F7380',
  
  // Background colors
  background: '#FFF',
  backgroundLight: '#F5F9FE',
  backgroundGray: '#D9D9D9',
  backgroundDark: '#1E1E1E',
  
  // Border colors
  border: '#B4BED4',
  borderLight: '#CBD5E1',
  borderFocus: '#06888C',
  
  // Status bar
  statusBarBg: '#FFF',
  statusBarContent: 'dark-content' as const,
  statusBarContentDark: 'light-content' as const,
};

// Typography
export const typography = {
  sizes: {
    xs: responsiveFont(12),
    sm: responsiveFont(14),
    base: responsiveFont(16),
    lg: responsiveFont(18),
    xl: responsiveFont(20),
    '2xl': responsiveFont(24),
    '3xl': responsiveFont(30),
  },
  weights: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  families: {
    primary: 'SF Pro',
    secondary: 'Open Sans',
    accent: 'Raleway',
    mono: 'Nunito Sans',
  },
};

// Spacing
export const spacing = {
  xs: responsiveSpacing(4),
  sm: responsiveSpacing(8),
  md: responsiveSpacing(16),
  lg: responsiveSpacing(24),
  xl: responsiveSpacing(32),
  '2xl': responsiveSpacing(48),
  '3xl': responsiveSpacing(64),
};

// Border radius
export const borderRadius = {
  sm: 8,
  md: 16,
  lg: 32,
  full: 9999,
};

// Shadows
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 9,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
};

// Common component styles
export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  backButton: {
    padding: 6,
  },
  backButtonCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  backArrow: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: '#100A37',
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.families.accent,
    color: colors.textPrimary,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    ...shadows.md,
  },
  buttonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    fontFamily: typography.families.accent,
    color: colors.background,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    fontSize: typography.sizes.base,
    fontFamily: typography.families.mono,
    color: colors.textPlaceholder,
    backgroundColor: colors.background,
  },
  inputLarge: {
    height: 60,
    backgroundColor: colors.backgroundLight,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    fontSize: typography.sizes.base,
    fontFamily: typography.families.secondary,
    color: colors.textMuted,
  },
  textSmall: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.families.secondary,
    color: colors.textMuted,
  },
  textBase: {
    fontSize: typography.sizes.base,
    fontFamily: typography.families.secondary,
    color: colors.textSecondary,
  },
  textLarge: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    fontFamily: typography.families.accent,
    color: colors.textPrimary,
  },
  linkText: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  successText: {
    color: colors.success,
    fontWeight: typography.weights.bold,
  },
});
