import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';

export interface OTPInputProps {
  length?: number;
  value: string[];
  onChange: (otp: string[]) => void;
  autoFocus?: boolean;
  style?: ViewStyle;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChange,
  autoFocus = true,
  style,
}) => {
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (autoFocus) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...value];
    newOtp[index] = text;
    onChange(newOtp);

    // Move to next input if current input is filled
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    // Move to previous input on backspace if current input is empty
    if (key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    // Clear the input when focused for better UX
    if (value[index]) {
      const newOtp = [...value];
      newOtp[index] = '';
      onChange(newOtp);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {Array.from({ length }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.inputContainer,
            value[index] ? styles.inputFilled : styles.inputEmpty,
          ]}
        >
          <TextInput
            ref={(ref) => { inputRefs.current[index] = ref; }}
            style={styles.input}
            value={value[index] || ''}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
            onFocus={() => handleFocus(index)}
            keyboardType="numeric"
            maxLength={1}
            textAlign="center"
            selectTextOnFocus
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  
  inputContainer: {
    width: 45,
    height: 45,
    borderRadius: 6.5,
    borderWidth: 1.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  inputFilled: {
    borderColor: '#06888C',
    backgroundColor: '#FFFFFF',
  },
  
  inputEmpty: {
    borderColor: '#B4BED4',
    backgroundColor: '#F9F9F9',
  },
  
  input: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Nunito Sans',
    color: '#333333',
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
});
