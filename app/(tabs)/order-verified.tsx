import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { router } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { ArrowBackButtonSVG, NotificationSVG, SupportSVG } from '../../components/icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../styles/theme';

const OrderVerifiedIcon = () => (
  <Svg width="100" height="100" viewBox="0 0 100 100" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.33398 50V33.3334C8.33398 21.55 8.33398 15.6542 11.9965 11.9959C15.6548 8.33337 21.5507 8.33337 33.334 8.33337H66.6673C78.4507 8.33337 84.3465 8.33337 88.0048 11.9959C91.6673 15.6542 91.6673 21.55 91.6673 33.3334V50C91.6673 61.7834 91.6673 67.6792 88.0048 71.3375C85.3132 74.0334 81.4132 74.7459 74.8465 74.9334C74.834 71.7761 73.7016 68.7256 71.6507 66.325C71.5275 66.1862 71.4542 66.0103 71.4423 65.825C71.1899 62.6554 69.8166 59.6794 67.5687 57.4307C65.3207 55.182 62.3452 53.8077 59.1757 53.5542C58.9904 53.5424 58.8145 53.4691 58.6757 53.3459C56.2556 51.2837 53.1801 50.151 50.0007 50.151C46.8212 50.151 43.7457 51.2837 41.3257 53.3459C41.1868 53.4691 41.0109 53.5424 40.8257 53.5542C37.6554 53.8067 34.6789 55.1806 32.43 57.4294C30.1812 59.6782 28.8073 62.6548 28.5548 65.825C28.543 66.0103 28.4697 66.1862 28.3465 66.325C26.2971 68.7262 25.1661 71.7766 25.1548 74.9334C18.5882 74.7459 14.6882 74.0334 11.9965 71.3375C8.33398 67.6792 8.33398 61.7834 8.33398 50ZM34.3757 25C34.3757 24.1712 34.7049 23.3764 35.2909 22.7903C35.877 22.2043 36.6719 21.875 37.5007 21.875H62.5007C63.3295 21.875 64.1243 22.2043 64.7104 22.7903C65.2964 23.3764 65.6257 24.1712 65.6257 25C65.6257 25.8288 65.2964 26.6237 64.7104 27.2098C64.1243 27.7958 63.3295 28.125 62.5007 28.125H37.5007C36.6719 28.125 35.877 27.7958 35.2909 27.2098C34.7049 26.6237 34.3757 25.8288 34.3757 25ZM29.1673 36.4584C28.3385 36.4584 27.5437 36.7876 26.9576 37.3737C26.3716 37.9597 26.0423 38.7546 26.0423 39.5834C26.0423 40.4122 26.3716 41.207 26.9576 41.7931C27.5437 42.3791 28.3385 42.7084 29.1673 42.7084H70.834C71.6628 42.7084 72.4576 42.3791 73.0437 41.7931C73.6298 41.207 73.959 40.4122 73.959 39.5834C73.959 38.7546 73.6298 37.9597 73.0437 37.3737C72.4576 36.7876 71.6628 36.4584 70.834 36.4584H29.1673Z"
      fill="#90E07C"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M54.6248 58.1042C53.3351 57.0036 51.6952 56.399 49.9998 56.399C48.3043 56.399 46.6644 57.0036 45.3748 58.1042C44.2352 59.0789 42.8157 59.6669 41.3206 59.7833C39.6309 59.9178 38.0444 60.6504 36.8462 61.8493C35.648 63.0483 34.9165 64.6352 34.7831 66.325C34.6664 67.8167 34.0748 69.2333 33.1039 70.3792C32.0056 71.6683 31.4023 73.3065 31.4023 75C31.4023 76.6936 32.0056 78.3317 33.1039 79.6208C34.0789 80.7625 34.6664 82.1833 34.7831 83.675C34.9166 85.3655 35.6487 86.9529 36.8478 88.1519C38.0469 89.351 39.6343 90.0831 41.3248 90.2167C42.8164 90.3333 44.2373 90.9208 45.3789 91.8917C46.668 92.99 48.3062 93.5932 49.9998 93.5932C51.6933 93.5932 53.3315 92.99 54.6206 91.8917C55.7602 90.9169 57.1797 90.329 58.6748 90.2125C60.3646 90.0791 61.9514 89.3476 63.1504 88.1494C64.3494 86.9511 65.0819 85.3647 65.2164 83.675C65.3317 82.1804 65.9182 80.7609 66.8914 79.6208C67.9909 78.3314 68.5948 76.6924 68.5948 74.9979C68.5948 73.3034 67.9909 71.6644 66.8914 70.375C65.9167 69.2354 65.3287 67.8159 65.2122 66.3208C65.0779 64.6318 64.346 63.0459 63.1478 61.8478C61.9497 60.6496 60.3638 59.9177 58.6748 59.7833C57.1797 59.6669 55.7643 59.0789 54.6248 58.1042ZM58.3789 73.1167C58.6833 72.8377 58.9294 72.5012 59.103 72.1265C59.2766 71.7518 59.3742 71.3465 59.3902 70.9339C59.4062 70.5213 59.3403 70.1096 59.1962 69.7227C59.0522 69.3357 58.8329 68.9811 58.551 68.6794C58.2691 68.3777 57.9302 68.1348 57.5539 67.9649C57.1776 67.7949 56.7713 67.7012 56.3586 67.6892C55.9459 67.6771 55.5348 67.747 55.1493 67.8948C54.7637 68.0425 54.4112 68.2652 54.1123 68.55L47.3206 74.8917L45.8789 73.55C45.2717 72.9936 44.4694 72.6993 43.6465 72.7312C42.8235 72.7631 42.0464 73.1186 41.4841 73.7204C40.9218 74.3222 40.6199 75.1217 40.6439 75.9449C40.6679 76.7682 41.0159 77.5486 41.6123 78.1167L45.1831 81.45C45.7619 81.9907 46.5244 82.2915 47.3164 82.2915C48.1085 82.2915 48.871 81.9907 49.4498 81.45L58.3789 73.1167Z"
      fill="#90E07C"
    />
  </Svg>
);

const BackArrowIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 25 25" fill="none">
    <Path
      d="M8.325 13.5L13.925 19.1L12.5 20.5L4.5 12.5L12.5 4.5L13.925 5.9L8.325 11.5H20.5V13.5H8.325Z"
      fill="white"
    />
  </Svg>
);

export default function OrderVerifiedScreen() {
  const handleBackPress = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#06888C" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <ArrowBackButtonSVG width={30} height={30} color="white" />
          <Text style={styles.backText}>Go back</Text>
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerAction}>
            <NotificationSVG width={24} height={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerAction}>
            <SupportSVG width={24} height={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.messageContainer}>
          {/* Verification Icon */}
          <View style={styles.iconContainer}>
            <OrderVerifiedIcon />
          </View>

          {/* Success Message */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>Order Verified</Text>
            <Text style={styles.subtitle}>
              Congratulations, your Order has been verified
            </Text>
          </View>
        </View>
      </View>

      {/* Go Home Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.goHomeButton} onPress={handleGoHome}>
          <BackArrowIcon />
          <Text style={styles.goHomeButtonText}>Go Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  header: {
    backgroundColor: '#06888C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingVertical: 16,
    height: 80,
  },
  
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  
  backText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Raleway',
  },
  
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  
  headerAction: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 21,
  },
  
  messageContainer: {
    alignItems: 'center',
    gap: 19,
    width: 260,
  },
  
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  textContainer: {
    alignItems: 'center',
    gap: 8,
    alignSelf: 'stretch',
  },
  
  title: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 30,
    alignSelf: 'stretch',
  },
  
  subtitle: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 20,
    alignSelf: 'stretch',
  },
  
  buttonContainer: {
    paddingHorizontal: 22,
    paddingBottom: 30,
  },
  
  goHomeButton: {
    backgroundColor: '#06888C',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 53,
    ...shadows.md,
  },
  
  goHomeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    lineHeight: 25,
  },
});
