import PhoneInputWithCountry from '@/components/PhoneInputWithCountry';
import { useAuth } from '@/context/AppProvider';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

export default function RegisterScreen() {
  const { register, state } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleCreateAccount = async () => {
    if (!name.trim()) {
      toast.error('Please enter your name.');
      return;
    }
    if (!email.trim()) {
      toast.error('Please enter your email address.');
      return;
    }
    if (!phone.trim()) {
      toast.error('Please enter your phone number.');
      return;
    }
    if (!agreedToTerms) {
      toast.error('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    const registrationData = {
      name,
      role: 'vendor' as const,
      email: email,
      mobileNumber: phone,
    };

    try {
      console.log('Registering with data:', registrationData);
      await register(registrationData);
      toast.success('Registration successful! Please verify your account.');
      router.push({
        pathname: '/auth/verify',
        params: { identifier: phone, fromScreen: 'register' },
      });
    } catch (err: any) {
      const errorMessage = err?.error?.message || 'An unexpected error occurred during registration.';
      toast.error(errorMessage);
    }
  };

  const handleSignIn = () => {
    router.push('/auth/sign-in');
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
        <Text style={styles.headerTitle}>Sign up</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Business Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Name"
              placeholderTextColor="rgba(111, 115, 128, 0.27)"
              value={name}
              editable={!state.isLoading}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. yourname@example.com"
              placeholderTextColor="rgba(111, 115, 128, 0.27)"
              value={email}
              editable={!state.isLoading}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {/* Phone Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <PhoneInputWithCountry
              value={phone}
              onChangeText={setPhone}
              editable={!state.isLoading}
              placeholder="e.g. +234 801 234 5678"
            />
          </View>

          {/* Terms Agreement */}
          <View style={styles.termsContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setAgreedToTerms(!agreedToTerms)}
            >
              <View style={[styles.checkboxBox, agreedToTerms && styles.checkboxChecked]}>
                {agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </TouchableOpacity>
            <Text style={styles.termsText}>
              I agree to the{' '}
              <Text style={styles.linkText}>Terms of Service</Text> and{' '}
              <Text style={styles.linkText}>Privacy Policy</Text>
            </Text>
          </View>
        </View>

        {/* Create Account Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.createButton, state.isLoading && styles.disabledButton]}
            onPress={handleCreateAccount}
            disabled={state.isLoading}>
            {state.isLoading
              ? <ActivityIndicator color="#FFF" />
              : <Text style={styles.createButtonText}>Create account</Text>
            }
          </TouchableOpacity>

          {/* Sign In Link */}
          <View style={styles.signInSection}>
            <Text style={styles.signInText}>Do you have account? </Text>
            <TouchableOpacity onPress={handleSignIn}>
              <Text style={styles.signInLink}>Sign In</Text>
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
  formContainer: {
    paddingHorizontal: 33,
    paddingVertical: 24,
    gap: 16,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 0,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Open Sans',
    fontWeight: '600',
    color: '#2B2829',
    marginBottom: 8,
  },
  textInput: {
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#FFF',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: 'Nunito Sans',
    color: '#6F7380',
  },
  passwordToggle: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginTop: 7,
  },
  checkbox: {
    marginTop: 2,
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderRadius: 5,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#B4BED4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#06888C',
    borderColor: '#06888C',
  },
  checkmark: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
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
    gap: 16,
    paddingBottom: 40,
  },
  createButton: {
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
  createButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
  },
  signInSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  signInText: {
    fontSize: 16,
    fontFamily: 'Open Sans',
    fontWeight: '400',
    color: '#888',
    letterSpacing: 0.32,
  },
  signInLink: {
    fontSize: 16,
    fontFamily: 'Raleway',
    fontWeight: '600',
    color: '#06888C',
    letterSpacing: 0.32,
  },
});
