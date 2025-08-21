import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';

export interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  retryText?: string;
  style?: ViewStyle;
  variant?: 'default' | 'inline';
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  retryText = 'Try Again',
  style,
  variant = 'default',
}) => {
  const containerStyles = [
    styles.container,
    styles[variant],
    style,
  ];

  return (
    <View style={containerStyles}>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>{retryText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  default: {
    backgroundColor: '#FFE5E5',
    borderWidth: 1,
    borderColor: '#FFB3B3',
  },
  
  inline: {
    backgroundColor: 'transparent',
    padding: 8,
  },
  
  message: {
    fontSize: 14,
    fontFamily: 'Open Sans',
    color: '#FF4444',
    textAlign: 'center',
    lineHeight: 20,
  },
  
  retryButton: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 16,
    backgroundColor: '#FF4444',
    borderRadius: 4,
  },
  
  retryText: {
    fontSize: 14,
    fontFamily: 'Raleway',
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
