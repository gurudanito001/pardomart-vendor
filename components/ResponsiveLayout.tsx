import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { screenData, responsiveWidth } from '../utils/responsive';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  style?: ViewStyle;
  maxWidth?: number;
  centerContent?: boolean;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  style,
  maxWidth = 430, // Max width for mobile-first design
  centerContent = true,
}) => {
  const layoutStyles = StyleSheet.create({
    container: {
      width: '100%',
      maxWidth: screenData.isTablet ? maxWidth : '100%',
      alignSelf: centerContent ? 'center' : 'stretch',
      paddingHorizontal: screenData.isSmallDevice ? 16 : 20,
    },
  });

  return (
    <View style={[layoutStyles.container, style]}>
      {children}
    </View>
  );
};

// Responsive container for forms
export const FormContainer: React.FC<ResponsiveLayoutProps> = ({
  children,
  style,
}) => {
  return (
    <ResponsiveLayout maxWidth={400} style={style}>
      {children}
    </ResponsiveLayout>
  );
};

// Responsive container for content sections
export const ContentContainer: React.FC<ResponsiveLayoutProps> = ({
  children,
  style,
}) => {
  return (
    <ResponsiveLayout maxWidth={600} style={style}>
      {children}
    </ResponsiveLayout>
  );
};
