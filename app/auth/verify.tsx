import { OTPInput } from '@/components/ui/OTPInput';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function VerifyScreen() {
  const [otp, setOtp] = useState(['', '', '', '', '']);
  // Key to force re-mount of OTPInput on resend for a better UX
  const [otpKey, setOtpKey] = useState(0);

  const handleVerify = () => {
    // You can add your verification logic here
    // const code = otp.join('');
    // console.log('Verifying OTP:', code);
    router.push('/auth/verified');
  };

  const handleBack = () => {
    router.back();
  };

  const handleResend = () => {
    // Reset OTP inputs and force re-mount of OTPInput to focus the first field
    setOtp(['', '', '', '', '']);
    setOtpKey((prevKey) => prevKey + 1);
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
        <Text style={styles.headerTitle}>Back</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title and Description */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>OTP Verification</Text>
          <Text style={styles.description}>
            Enter the verification code we just sent to your email address
          </Text>
        </View>

        {/* OTP Input */}
        <OTPInput
          key={otpKey}
          length={5}
          value={otp}
          onChange={setOtp}
          style={styles.otpContainer}
        />
        {/* Verify Button */}
        <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
          <Text style={styles.verifyButtonText}>Verify</Text>
        </TouchableOpacity>
      </View>

      {/* Resend Section */}
      <View style={styles.resendSection}>
        <Text style={styles.resendText}>Didn&apos;t receive a code? </Text>
        <TouchableOpacity onPress={handleResend}>
          <Text style={styles.resendLink}>Resend</Text>
        </TouchableOpacity>
      </View>
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

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Raleway',
    color: '#000',
  },
  content: {
    paddingHorizontal: 33,
    paddingTop: 35,
  },
  titleContainer: {
    alignItems: 'flex-start',
    marginBottom: 28,
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#2B2829',
    lineHeight: 32,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Open Sans',
    color: '#2B2829',
    letterSpacing: 0.7,
    lineHeight: 20,
  },
  otpContainer: {
    width: '100%',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 25,
  },
  verifyButton: {
    backgroundColor: '#06888C',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 120,
    alignItems: 'center',
    alignSelf: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 9,
    elevation: 2,
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
  },
  resendSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 4,
  },
  resendText: {
    fontSize: 14,
    fontFamily: 'Open Sans',
    color: '#303651',
    letterSpacing: 0.7,
    lineHeight: 16,
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#06888C',
    letterSpacing: 0.7,
  },
});
