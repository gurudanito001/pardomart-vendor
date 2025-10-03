import { GoogleSVG } from '@/components/icons/GoogleSVG';
import PhoneInputWithCountry from '@/components/PhoneInputWithCountry';
import { useAuth } from '@/context/AppProvider';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from '../../utils/toast';

export default function SignInScreen() {
  const { state, initiateLogin } = useAuth();
  const [phone, setPhone] = useState('');
  
  const handleBack = () => {
    router.back();
  };

  const handleContinue = async () => {
    const trimmedPhone = phone.trim();
    if (!trimmedPhone) {
      toast.error('Please enter your phone number.');
      return;
    }
    // Basic length validation (e.g., country code + at least 7 digits)
    if (trimmedPhone.length < 8) {
      toast.error('Please enter a valid phone number.');
      return;
    }
    try {
      await initiateLogin(trimmedPhone, 'vendor');
      toast.success('Verification code sent!');
      router.push({ pathname: '/auth/verify', params: { identifier: trimmedPhone } });
    } catch (err: any) {
      // Correctly access the nested error message from our custom ApiError
      const errorMessage = err?.error?.message || 'An unexpected error occurred.';
      toast.error(errorMessage);
    }
  };

  const handleSignUp = () => {
    router.push('/auth/register');
  };

  const handleSocialLogin = (provider: 'google' | 'facebook' | 'apple') => {
    // Handle social login
    console.log('Social login with:', provider);
  };

  const SocialButton = ({ provider }: { provider: 'google' | 'facebook' | 'apple' }) => {
    const renderIcon = () => {
      switch (provider) {
        case 'google':
          return <GoogleSVG width={24} height={24} />;
        case 'facebook':
          return <FontAwesome name="facebook" size={24} color="#0085FF" />;
        case 'apple':
          return <AntDesign name="apple" size={24} color="#2B2829" />;
        default: return null;
      }
    };

    return (
      <TouchableOpacity
        style={styles.socialButton}
        onPress={() => handleSocialLogin(provider)}
      >
        {renderIcon()}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <View style={styles.backButtonCircle}>
            <AntDesign name="left" size={18} color="#100A37" />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sign in</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Phone Number Input */}
        <View style={styles.formContainer}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <PhoneInputWithCountry
            value={phone} // Keep controlled component behavior
            onChangeText={setPhone} // Pass setter function directly
            editable={!state.isLoading}
            placeholder="e.g. +234 801 234 5678"
            autoFocus
          />
        </View>

        {/* Terms Text */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By continuing, you agree to our{' '}
            <Text style={styles.linkText}>Terms of Service</Text>,{' '}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.continueButton, state.isLoading && styles.disabledButton]} onPress={handleContinue} disabled={state.isLoading}>
            {state.isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.continueButtonText}>Continue</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Social Login Section */}
        <View style={styles.socialContainer}>
          <Text style={styles.orText}>or sign in with</Text>
          
          <View style={styles.socialButtonsContainer}>
            <SocialButton provider="google" />
            <SocialButton provider="facebook" />
            <SocialButton provider="apple" />
          </View>
          
          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signUpLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 21,
    paddingTop: 20,
    gap: 12,
    height: 50,
  },
  backButton: {
    padding: 6,
  },
  backButtonCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Raleway',
    color: '#000',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: 33,
    paddingTop: 35,
    marginBottom: 27,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Open Sans',
    fontWeight: '600',
    color: '#2B2829',
    marginBottom: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 8,
    fontFamily: 'Open Sans',
  },
  emailInput: {
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: 'Nunito Sans',
    color: '#6F7380',
  },
  termsContainer: {
    paddingHorizontal: 33,
    marginBottom: 19,
  },
  termsText: {
    fontSize: 12,
    fontFamily: 'Open Sans',
    fontWeight: '600',
    color: '#7C7B7B',
    lineHeight: 24,
  },
  linkText: {
    color: '#01891C',
    fontWeight: '700',
  },
  buttonContainer: {
    paddingHorizontal: 33,
    marginBottom: 42,
  },
  continueButton: {
    backgroundColor: '#06888C',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 9,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: '#A9A9A9',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
  },
  socialContainer: {
    paddingHorizontal: 33,
    alignItems: 'center',
    gap: 27,
    paddingBottom: 60,
  },
  orText: {
    fontSize: 16,
    fontFamily: 'Open Sans',
    fontWeight: '600',
    color: '#888',
    textAlign: 'center',
    letterSpacing: 0.32,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    width: '100%',
  },
  socialButton: {
    width: 86,
    height: 42,
    backgroundColor: '#F4F4F4',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  signUpText: {
    fontSize: 16,
    fontFamily: 'Open Sans',
    fontWeight: '400',
    color: '#888',
    letterSpacing: 0.32,
  },
  signUpLink: {
    fontSize: 16,
    fontFamily: 'Raleway',
    fontWeight: '600',
    color: '#06888C',
    letterSpacing: 0.32,
  },
});
