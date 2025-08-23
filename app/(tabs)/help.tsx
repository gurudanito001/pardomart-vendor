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

export default function HelpScreen() {
  const handleContactSupport = () => {
    router.push('/support');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <View style={styles.content}>
        <Text style={styles.title}>Help & Support</Text>
        <Text style={styles.subtitle}>
          Get help with your account, orders, and store management. Our support team is here to assist you.
        </Text>

        <View style={styles.helpOptions}>
          <TouchableOpacity style={styles.supportButton} onPress={handleContactSupport}>
            <View style={styles.supportIcon}>
              <svg width="24" height="24" viewBox="0 0 25 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M20.3 10.18C19.99 7.00002 18.11 2 12.3 2C6.49002 2 4.61001 7.00002 4.30002 10.18C3.21252 10.5927 2.4952 11.6368 2.50002 12.8V14.2C2.50002 15.7464 3.75365 17 5.30001 17C6.84642 17 8.10004 15.7464 8.10004 14.2V12.8C8.09498 11.6619 7.40404 10.6393 6.35001 10.21C6.55002 8.36998 7.53004 4.00002 12.3 4.00002C17.07 4.00002 18.04 8.36998 18.24 10.21C17.1882 10.6402 16.5007 11.6636 16.5 12.8V14.2C16.5022 14.7269 16.6524 15.2425 16.9335 15.6881C17.2147 16.1337 17.6154 16.4913 18.09 16.72C17.67 17.51 16.6 18.58 13.97 18.9C13.4443 18.1017 12.4272 17.787 11.5424 18.1489C10.6578 18.5108 10.1528 19.4481 10.3373 20.386C10.5218 21.3239 11.3442 22 12.3 22C12.6704 21.9979 13.0329 21.8931 13.3472 21.6971C13.6615 21.5011 13.9152 21.2217 14.08 20.89C18.37 20.4 19.74 18.19 20.17 16.89C21.3333 16.5132 22.1157 15.4227 22.1 14.2V12.8C22.1048 11.6368 21.3875 10.5927 20.3 10.18ZM6.10002 14.2C6.10002 14.6418 5.74185 15 5.30001 15C4.85816 15 4.50004 14.6419 4.50004 14.2V12.8C4.49923 12.6944 4.51933 12.5897 4.55917 12.492C4.59901 12.3942 4.65781 12.3053 4.73217 12.2304C4.80654 12.1554 4.895 12.0959 4.99247 12.0553C5.08993 12.0148 5.19446 11.9939 5.30003 11.9939C5.40561 11.9939 5.51014 12.0148 5.6076 12.0553C5.70506 12.0959 5.29352 12.1554 5.86789 12.2304C5.44226 12.3053 6.00105 12.3942 6.0409 12.492C6.08074 12.5897 6.10083 12.6944 6.10002 12.8V14.2ZM18.5 12.8C18.5 12.3582 18.8582 12 19.3 12C19.7419 12 20.1 12.3582 20.1 12.8V14.2C20.1 14.6418 19.7419 15 19.3 15C18.8582 15 18.5 14.6419 18.5 14.2V12.8Z" fill="#06888C"/>
              </svg>
            </View>
            <View style={styles.supportContent}>
              <Text style={styles.supportTitle}>Contact Support</Text>
              <Text style={styles.supportDescription}>
                Send a message to our support team for personalized assistance
              </Text>
            </View>
            <View style={styles.arrowIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="#06888C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </View>
          </TouchableOpacity>

          <View style={styles.helpCard}>
            <View style={styles.helpCardIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="#FFD700"/>
              </svg>
            </View>
            <View style={styles.helpCardContent}>
              <Text style={styles.helpCardTitle}>FAQ & Help Center</Text>
              <Text style={styles.helpCardDescription}>
                Coming soon - Find answers to common questions and helpful guides
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  helpOptions: {
    gap: 20,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  supportIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  supportContent: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#000',
    marginBottom: 4,
  },
  supportDescription: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#666',
    lineHeight: 20,
  },
  arrowIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  helpCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  helpCardContent: {
    flex: 1,
  },
  helpCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#000',
    marginBottom: 4,
  },
  helpCardDescription: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#666',
    lineHeight: 20,
  },
});
