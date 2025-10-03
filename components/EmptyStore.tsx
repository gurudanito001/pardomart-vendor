import { router } from 'expo-router';
import React from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

interface EmptyStoreProps {
  onGoBack: () => void;
  onNotifications: () => void;
  onSupport: () => void;
}

export default function EmptyStore({
  onGoBack,
  onNotifications,
  onSupport,
}: EmptyStoreProps) {

  const handleAddStore = () => {
    router.push('/(private)/store/add-store' as any);
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#06888C" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.leftSection}>
            <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
              {/* Back Arrow Icon */}
              <Svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <Path d="M19.6278 21.993C19.8661 22.2135 20 22.5125 20 22.8243C20 23.1361 19.8661 23.4352 19.6278 23.6556C19.3895 23.8761 19.0662 24 18.7292 24C18.3921 24 18.0689 23.8761 17.8306 23.6556L9.37313 15.8313C9.25486 15.7223 9.16102 15.5927 9.09699 15.4501C9.03296 15.3074 9 15.1545 9 15C9 14.8455 9.03296 14.6926 9.09699 14.5499C9.16102 14.4073 9.25486 14.2777 9.37313 14.1687L17.8306 6.34435C18.0689 6.12387 18.3921 6 18.7292 6C19.0662 6 19.3895 6.12387 19.6278 6.34435C19.8661 6.56483 20 6.86387 20 7.17568C20 7.48749 19.8661 7.78653 19.6278 8.00702L12.07 14.999L19.6278 21.993Z" fill="white"/>
              </Svg>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Store</Text>
          </View>
          <View style={styles.rightSection}>
            <TouchableOpacity style={styles.iconButton} onPress={onNotifications}>
              {/* Notification Bell Icon */}
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Path d="M8.645 20.5C8.86103 21.2219 9.30417 21.8549 9.90858 22.3049C10.513 22.755 11.2464 22.998 12 22.998C12.7536 22.998 13.487 22.755 14.0914 22.3049C14.6958 21.8549 15.139 21.2219 15.355 20.5H8.645ZM3 19.5H21V16.5L19 13.5V8.5C19 7.58075 18.8189 6.6705 18.4672 5.82122C18.1154 4.97194 17.5998 4.20026 16.9497 3.55025C16.2997 2.90024 15.5281 2.38463 14.6788 2.03284C13.8295 1.68106 12.9193 1.5 12 1.5C11.0807 1.5 10.1705 1.68106 9.32122 2.03284C8.47194 2.38463 7.70026 2.90024 7.05025 3.55025C6.40024 4.20026 5.88463 4.97194 5.53284 5.82122C5.18106 6.6705 5 7.58075 5 8.5V13.5L3 16.5V19.5Z" fill="white"/>
              </Svg>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={onSupport}>
              {/* Support Icon */}
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Path fillRule="evenodd" clipRule="evenodd" d="M19.8 10.18C19.49 7.00003 17.61 2.00002 11.8 2.00002C5.99002 2.00002 4.11001 7.00003 3.80002 10.18C2.71252 10.5928 1.9952 11.6369 2.00002 12.8V14.2C2.00002 15.7464 3.25365 17 4.80001 17C6.34642 17 7.60004 15.7464 7.60004 14.2V12.8C7.59498 11.6619 6.90404 10.6393 5.85001 10.21C6.05002 8.37 7.03004 4.00003 11.8 4.00003C16.57 4.00003 17.54 8.37 17.74 10.21C16.6882 10.6403 16.0007 11.6636 16 12.8V14.2C16.0022 14.7269 16.1524 15.2425 16.4335 15.6881C16.7147 16.1337 17.1154 16.4913 17.59 16.72C17.17 17.51 16.1 18.58 13.47 18.9C12.9443 18.1017 11.9272 17.787 11.0424 18.1489C10.1578 18.5108 9.65279 19.4482 9.83729 20.386C10.0218 21.3239 10.8442 22 11.8 22C12.1704 21.998 12.5329 21.8931 12.8472 21.6971C13.1615 21.5011 13.4152 21.2217 13.58 20.89C17.87 20.4 19.24 18.19 19.67 16.89C20.8333 16.5132 21.6157 15.4228 21.6 14.2V12.8C21.6048 11.6369 20.8875 10.5928 19.8 10.18ZM5.60002 14.2C5.60002 14.6418 5.24185 15 4.80001 15C4.35816 15 4.00004 14.6419 4.00004 14.2V12.8C3.99923 12.6944 4.01933 12.5898 4.05917 12.492C4.09901 12.3942 4.15781 12.3053 4.23217 12.2304C4.30654 12.1554 4.395 12.0959 4.49247 12.0554C4.58993 12.0148 4.69446 11.9939 4.80003 11.9939C4.90561 11.9939 5.01014 12.0148 5.1076 12.0554C5.20506 12.0959 5.29352 12.1554 5.36789 12.2304C5.44226 12.3053 5.50105 12.3942 5.5409 12.492C5.58074 12.5898 5.60083 12.6944 5.60002 12.8V14.2ZM18 12.8C18 12.3582 18.3582 12 18.8 12C19.2419 12 19.6 12.3582 19.6 12.8V14.2C19.6 14.6418 19.2419 15 18.8 15C18.3582 15 18 14.6419 18 14.2V12.8Z" fill="white"/>
              </Svg>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.emptyStateContainer}>
          {/* Store Icon with circular background */}
          <View style={styles.iconContainer}>
            {/* Store with Plus Icon */}
            <Svg width="100" height="100" viewBox="0 0 100 100" fill="none">
              <Path d="M12.4998 43.75V62.5C12.4998 74.2833 12.4998 80.1792 16.1623 83.8375C19.8206 87.5 25.7165 87.5 37.4998 87.5H52.0831M87.4998 43.75V52.0833M29.1665 70.8333H45.8331M62.4998 77.0833H91.6665M77.0831 91.6667V62.5M74.1456 8.34583L25.6206 8.45833C18.379 8.10417 16.5206 13.3833 16.5206 15.9583C16.5206 18.2667 16.2081 21.6292 11.7706 27.95C7.32896 34.2708 7.66229 36.1458 10.1665 40.5208C12.2415 44.1542 17.5248 45.5708 20.2831 45.8125C21.9278 45.8941 23.5723 45.6474 25.1206 45.0866C26.6688 44.5258 28.0899 43.6623 29.3008 42.5464C30.5118 41.4304 31.4883 40.0845 32.1735 38.5871C32.8587 37.0897 33.2387 35.4709 33.2915 33.825C37.6331 46.45 49.979 46.45 55.479 45.0083C60.9915 43.5583 65.7123 38.3833 66.8248 33.825C67.4748 39.4917 69.4498 42.7958 75.2706 45.0667C81.3039 47.4167 86.4956 43.8208 89.0998 41.5167C91.704 39.2125 93.3748 34.0958 88.7331 28.4708C85.5331 24.5917 84.1956 20.9375 83.7581 17.15C83.5081 14.9542 83.2831 12.5958 81.6498 11.0958C79.2665 8.90417 75.8456 8.2375 74.1456 8.34583Z" stroke="#7C7B7B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </Svg>
          </View>

          {/* Text Content */}
          <View style={styles.textContainer}>
            <Text style={styles.mainText}>You have not added any Store</Text>
            <Text style={styles.subText}>
              You can add more than one store location to your profile
            </Text>
          </View>
        </View>

        {/* Add Store Button */}
        <TouchableOpacity style={styles.addStoreButton} onPress={handleAddStore}>
          <Text style={styles.addStoreButtonText}>Add a new Store</Text>
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
    backgroundColor: '#06888C',
    paddingVertical: 19,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 21,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
    lineHeight: 22,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  emptyStateContainer: {
    alignItems: 'center',
    gap: 45,
  },
  iconContainer: {
    width: 200,
    height: 190,
    borderRadius: 100,
    backgroundColor: '#F0F8F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    gap: 6,
    maxWidth: 351,
  },
  mainText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#000',
    textAlign: 'center',
  },
  subText: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#484C52',
    textAlign: 'center',
    lineHeight: 16,
  },
  addStoreButton: {
    height: 55,
    paddingVertical: 14,
    paddingHorizontal: 50,
    backgroundColor: '#06888C',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 9,
    elevation: 3,
  },
  addStoreButtonText: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 25,
  },
});
