import { router } from 'expo-router';
import React from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function VerifiedScreen() {
  const handleContinue = () => {
    router.push('/vendor/online');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <View style={styles.backButtonCircle}>
            <Text style={styles.backArrow}>‹</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <View style={styles.checkmarkContainer}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
          </View>
        </View>

        {/* Success Message */}
        <Text style={styles.title}>Profile Verified</Text>

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
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
    paddingHorizontal: 20,
    paddingTop: 19,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 78,
    alignItems: 'center',
    gap: 30,
  },
  iconContainer: {
    width: 200,
    height: 200,
    padding: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBackground: {
    width: 174,
    height: 174,
    borderRadius: 87,
    backgroundColor: 'rgba(43, 132, 179, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  checkmarkContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#000',
    textAlign: 'center',
    lineHeight: 25,
  },
  continueButton: {
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
  continueButtonText: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
  },
});
