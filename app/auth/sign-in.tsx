import { GoogleSVG } from '@/components/icons/GoogleSVG';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

export default function SignInScreen() {
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Get screen dimensions for responsive design using the hook for dynamic updates
  const { width: screenWidth } = useWindowDimensions();
  const tabSelectorWidth = screenWidth - 66; // 33px padding on each side of the container
  const singleTabWidth = (tabSelectorWidth - 6) / 2; // Account for 3px padding inside the selector

  // Animation values
  const tabIndicatorPosition = useSharedValue(0);
  
  const handleBack = () => {
    router.back();
  };

  const handleContinue = () => {
    // Handle sign in logic here
    const value = activeTab === 'email' ? email : phone;
    console.log('Sign in with:', activeTab, value);
    router.push('/auth/verify');
  };

  const handleTabSwitch = (tab: 'email' | 'phone') => {
    setActiveTab(tab);
    // Animate tab indicator
    tabIndicatorPosition.value = withTiming(tab === 'email' ? 0 : 1, {
      duration: 300,
    });
  };

  const handlePhoneInput = (text: string) => {
    // Only allow numbers and some formatting characters
    const cleanedText = text.replace(/[^0-9+\-\s()]/g, '');
    setPhone(cleanedText);
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
        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <View style={styles.tabSelector}>
            <Animated.View style={[
              styles.tabIndicator,
              { width: singleTabWidth },
              useAnimatedStyle(() => ({
                transform: [{
                  translateX: tabIndicatorPosition.value * singleTabWidth
                }]
              }))
            ]} />
            <TouchableOpacity
              style={styles.tab}
              onPress={() => handleTabSwitch('email')}
            >
              <Text style={[styles.tabText, activeTab === 'email' && styles.activeTabText]}>
                Email
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tab}
              onPress={() => handleTabSwitch('phone')}
            >
              <Text style={[styles.tabText, activeTab === 'phone' && styles.activeTabText]}>
                Phone Number
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Dynamic Input */}
        <View style={styles.formContainer}>
          <TextInput
            style={styles.emailInput}
            placeholder={activeTab === 'email' ? 'Email' : 'Phone'}
            placeholderTextColor="rgba(111, 115, 128, 0.27)"
            value={activeTab === 'email' ? email : phone}
            onChangeText={activeTab === 'email' ? setEmail : handlePhoneInput}
            keyboardType={activeTab === 'email' ? 'email-address' : 'phone-pad'}
            autoCapitalize="none"
            textContentType={activeTab === 'email' ? 'emailAddress' : 'telephoneNumber'}
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
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Continue</Text>
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
              <Text style={styles.signUpLink}>SIGN UP</Text>
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
    paddingTop: 14,
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
  tabContainer: {
    paddingHorizontal: 33,
    paddingTop: 35,
    marginBottom: 27,
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: '#D9D9D9',
    borderRadius: 16,
    padding: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
    position: 'relative',
    alignSelf: 'stretch',
  },
  tabIndicator: {
    position: 'absolute',
    top: 3,
    left: 3,
    height: 53,
    // width is now set dynamically
    backgroundColor: '#06888C',
    borderRadius: 16,
    zIndex: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 17,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 53,
    zIndex: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Raleway',
    color: '#7C7B7B',
  },
  activeTabText: {
    color: '#FFF',
  },
  formContainer: {
    paddingHorizontal: 33,
    marginBottom: 19,
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