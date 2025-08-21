import React, { forwardRef, useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string | null;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  variant?: 'default' | 'outline' | 'filled';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  required?: boolean;
  showPasswordToggle?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  variant = 'default',
  size = 'medium',
  disabled = false,
  required = false,
  showPasswordToggle = false,
  secureTextEntry,
  ...props
}, ref) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = secureTextEntry || showPasswordToggle;
  const shouldShowPassword = isPassword && !isPasswordVisible;

  const containerStyles = [
    styles.container,
    containerStyle,
  ];

  const inputContainerStyles = [
    styles.inputContainer,
    styles[variant],
    styles[size],
    isFocused && styles.focused,
    error && styles.error,
    disabled && styles.disabled,
  ];

  const inputStyles = [
    styles.input,
    styles[`${size}Input`],
    disabled && styles.disabledInput,
    inputStyle,
  ];

  const labelStyles = [
    styles.label,
    styles[`${size}Label`],
    error && styles.errorLabel,
    required && styles.requiredLabel,
    labelStyle,
  ];

  const errorStyles = [
    styles.errorText,
    errorStyle,
  ];

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={containerStyles}>
      {label && (
        <Text style={labelStyles}>
          {label}
          {required && <Text style={styles.asterisk}> *</Text>}
        </Text>
      )}
      
      <View style={inputContainerStyles}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          ref={ref}
          style={inputStyles}
          secureTextEntry={shouldShowPassword}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor="#6F7380"
          {...props}
        />
        
        {(rightIcon || showPasswordToggle) && (
          <View style={styles.rightIconContainer}>
            {showPasswordToggle && isPassword && (
              <TouchableOpacity onPress={togglePasswordVisibility}>
                <Text style={styles.passwordToggle}>
                  {isPasswordVisible ? '🙈' : '👁️'}
                </Text>
              </TouchableOpacity>
            )}
            {rightIcon && !showPasswordToggle && rightIcon}
          </View>
        )}
      </View>
      
      {error && (
        <Text style={errorStyles}>{error}</Text>
      )}
      
      {helperText && !error && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  
  // Variants
  default: {
    borderWidth: 1,
    borderColor: '#B4BED4',
  },
  outline: {
    borderWidth: 2,
    borderColor: '#B4BED4',
    backgroundColor: 'transparent',
  },
  filled: {
    backgroundColor: '#F5F5F5',
    borderWidth: 0,
  },
  
  // Sizes
  small: {
    minHeight: 40,
    paddingHorizontal: 8,
  },
  medium: {
    minHeight: 48,
    paddingHorizontal: 12,
  },
  large: {
    minHeight: 56,
    paddingHorizontal: 16,
  },
  
  // States
  focused: {
    borderColor: '#06888C',
  },
  error: {
    borderColor: '#FF4444',
  },
  disabled: {
    backgroundColor: '#F0F0F0',
    opacity: 0.6,
  },
  
  input: {
    flex: 1,
    fontFamily: 'Nunito Sans',
    color: '#333333',
  },
  
  // Size-specific input styles
  smallInput: {
    fontSize: 14,
  },
  mediumInput: {
    fontSize: 16,
  },
  largeInput: {
    fontSize: 18,
  },
  
  disabledInput: {
    color: '#999999',
  },
  
  label: {
    fontFamily: 'Raleway',
    fontWeight: '600',
    marginBottom: 8,
    color: '#333333',
  },
  
  // Size-specific label styles
  smallLabel: {
    fontSize: 12,
  },
  mediumLabel: {
    fontSize: 14,
  },
  largeLabel: {
    fontSize: 16,
  },
  
  errorLabel: {
    color: '#FF4444',
  },
  
  requiredLabel: {
    // Style handled by asterisk
  },
  
  asterisk: {
    color: '#FF4444',
  },
  
  leftIconContainer: {
    marginRight: 8,
  },
  
  rightIconContainer: {
    marginLeft: 8,
  },
  
  passwordToggle: {
    fontSize: 16,
    padding: 4,
  },
  
  errorText: {
    fontSize: 12,
    color: '#FF4444',
    fontFamily: 'Open Sans',
    marginTop: 4,
  },
  
  helperText: {
    fontSize: 12,
    color: '#6F7380',
    fontFamily: 'Open Sans',
    marginTop: 4,
  },
});
