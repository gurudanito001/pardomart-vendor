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
import {
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

export default function RegisterScreen() {
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { width: screenWidth } = useWindowDimensions();
  const tabSelectorWidth = screenWidth - 60; // 30px padding on each side
  const singleTabWidth = (tabSelectorWidth - 6) / 2; // Account for 3px padding inside the selector

  const tabIndicatorPosition = useSharedValue(0);

  const handleCreateAccount = () => {
    router.push('/vendor/verify');
  };

  const handleSignIn = () => {
    router.push('/vendor/sign-in');
  };

  const handleTabSwitch = (tab: 'email' | 'phone') => {
    setActiveTab(tab);
    tabIndicatorPosition.value = withTiming(tab === 'email' ? 0 : 1, {
      duration: 300,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <View style={styles.backButtonCircle}>
            <Text style={styles.backArrow}>‹</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sign up</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <View style={styles.tabSelector}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'email' && styles.activeTab]}
              onPress={() => setActiveTab('email')}
            >
              <Text style={[styles.tabText, activeTab === 'email' && styles.activeTabText]}>
                Email
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'phone' && styles.activeTab]}
              onPress={() => setActiveTab('phone')}
            >
              <Text style={[styles.tabText, activeTab === 'phone' && styles.activeTabText]}>
                Phone Number
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Name"
              placeholderTextColor="#7C8BA0"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Email"
              placeholderTextColor="#7C8BA0"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor="#7C8BA0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.passwordToggleIcon}>👁</Text>
              </TouchableOpacity>
            </View>
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
          <TouchableOpacity style={styles.createButton} onPress={handleCreateAccount}>
            <Text style={styles.createButtonText}>Create account</Text>
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
    paddingHorizontal: 20,
    paddingTop: 14,
    gap: 12,
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
  backArrow: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#100A37',
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
    paddingHorizontal: 30,
    paddingTop: 59,
    marginBottom: 29,
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: '#D9D9D9',
    borderRadius: 16,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#06888C',
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
    paddingHorizontal: 30,
    gap: 16,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 0,
  },
  textInput: {
    height: 60,
    backgroundColor: '#F5F9FE',
    borderRadius: 16,
    paddingHorizontal: 24,
    fontSize: 16,
    fontFamily: 'Open Sans',
    color: '#7C8BA0',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F9FE',
    borderRadius: 16,
    height: 60,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 24,
    fontSize: 16,
    fontFamily: 'Open Sans',
    color: '#7C8BA0',
  },
  passwordToggle: {
    paddingHorizontal: 16,
  },
  passwordToggleIcon: {
    fontSize: 24,
    color: '#7C8BA0',
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
    backgroundColor: '#F5F9FE',
    borderWidth: 1,
    borderColor: '#E5E5E5',
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
    color: '#3B4054',
    lineHeight: 22,
  },
  linkText: {
    color: '#06888C',
  },
  buttonContainer: {
    paddingHorizontal: 30,
    gap: 16,
    paddingBottom: 40,
  },
  createButton: {
    backgroundColor: '#06888C',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 9,
    elevation: 2,
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
  },
  signInText: {
    fontSize: 14,
    fontFamily: 'Open Sans',
    color: '#3B4054',
  },
  signInLink: {
    fontSize: 14,
    fontFamily: 'Open Sans',
    color: '#06888C',
    fontWeight: '400',
  },
});