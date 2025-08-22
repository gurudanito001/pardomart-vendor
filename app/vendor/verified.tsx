import { AntDesign } from '@expo/vector-icons';
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
    router.push('/(tabs)/home');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* Status Bar */}
      <View style={styles.statusBar}>
        <View style={styles.statusBarContent}>
          <View style={styles.timeSection}>
            <Text style={styles.timeText}>9:41</Text>
          </View>
          <View style={styles.spacer} />
          <View style={styles.batterySection}>
            {/* Signal bars */}
            <View style={styles.signalBars}>
              <View style={[styles.signalBar, { height: 4 }]} />
              <View style={[styles.signalBar, { height: 6 }]} />
              <View style={[styles.signalBar, { height: 8 }]} />
              <View style={[styles.signalBar, { height: 10 }]} />
            </View>
            {/* WiFi icon */}
            <View style={styles.wifiIcon} />
            {/* Battery */}
            <View style={styles.battery}>
              <View style={styles.batteryLevel} />
            </View>
          </View>
        </View>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <View style={styles.backButtonCircle}>
            <AntDesign name="left" size={18} color="#100A37" />
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
  statusBar: {
    paddingTop: 21,
    paddingBottom: 0,
    backgroundColor: '#FFF',
  },
  statusBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 29,
  },
  timeSection: {
    flex: 1,
    paddingLeft: 6,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  timeText: {
    fontSize: 17,
    fontWeight: '400',
    fontFamily: 'SF Pro',
    color: '#000',
    textAlign: 'center',
  },
  spacer: {
    width: 124,
    height: 10,
  },
  batterySection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 16,
    gap: 7,
  },
  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 1,
  },
  signalBar: {
    width: 3,
    backgroundColor: '#000',
    borderRadius: 0.5,
  },
  wifiIcon: {
    width: 15,
    height: 11,
    backgroundColor: '#000',
    borderRadius: 2,
  },
  battery: {
    width: 24,
    height: 12,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 3.8,
    opacity: 0.35,
    justifyContent: 'center',
    paddingHorizontal: 1.5,
  },
  batteryLevel: {
    width: 21,
    height: 9,
    backgroundColor: '#000',
    borderRadius: 2.5,
  },
  header: {
    paddingHorizontal: 21,
    paddingTop: 19,
    paddingBottom: 0,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 78,
    alignItems: 'center',
    gap: 30,
    height: 341,
    justifyContent: 'center',
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
    alignSelf: 'stretch',
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
    height: 55,
    justifyContent: 'center',
  },
  continueButtonText: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
    lineHeight: 25,
  },
});
