import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function TakePhotoScreen() {
  const handleTakePhoto = () => {
    // In a real app, this would capture the photo
    // For now, navigate to verified screen
    router.push('/vendor/verified');
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
            <AntDesign name="left" size={18} color="#100A37" />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify it&apos;s you</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Let&apos;s verify your identity</Text>
          <Text style={styles.subtitle}>
            Position yourself in the center of the camera to take a photo of yourself
          </Text>
        </View>

        {/* Camera Preview Section */}
        <View style={styles.cameraSection}>
          <View style={styles.cameraPreview}>
            {/* Background Circle */}
            <View style={styles.backgroundCircle} />
            
            {/* Person Illustration */}
            <Image
              source={{
                uri: 'https://api.builder.io/api/v1/image/assets/TEMP/25805b85ee9b7ab1a9bb9121e0ef8891b372b99b?width=485'
              }}
              style={styles.personImage}
              resizeMode="contain"
            />
            
            {/* Overlay Grid Lines */}
            <View style={styles.gridOverlay}>
              {/* Horizontal lines */}
              {Array.from({ length: 9 }).map((_, index) => (
                <View
                  key={`h-${index}`}
                  style={[styles.horizontalLine, { top: index * 17 }]}
                />
              ))}
              {/* Vertical lines */}
              {Array.from({ length: 9 }).map((_, index) => (
                <View
                  key={`v-${index}`}
                  style={[styles.verticalLine, { left: index * 17 }]}
                />
              ))}
            </View>
            
            {/* Blue gradient overlay at bottom */}
            <View style={styles.gradientOverlay} />
            <View style={styles.horizontalGradientLine} />
            
            {/* Camera Frame Border */}
            <View style={styles.cameraFrame} />
          </View>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <Text style={styles.description}>
            Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. 
            Aliquam in hendrerit urna. Pellentesque sit amet sapien. Lorem ipsum dolor sit amet 
            consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque 
            sit amet sapienLorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi.
          </Text>
          
          <TouchableOpacity style={styles.takePhotoButton} onPress={handleTakePhoto}>
            <Text style={styles.takePhotoButtonText}>Take Photo</Text>
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 21,
    paddingTop: 19,
    gap: 12,
    height: 30,
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
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 51,
    gap: 56,
    height: 671,
  },
  titleSection: {
    gap: 11,
    width: 347,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#000',
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#484C52',
    lineHeight: 16,
  },
  cameraSection: {
    alignItems: 'center',
  },
  cameraPreview: {
    width: 265,
    height: 265,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundCircle: {
    width: 242,
    height: 242,
    borderRadius: 121,
    backgroundColor: '#F3F3F3',
    position: 'absolute',
    top: 11,
    left: 12,
  },
  personImage: {
    width: 242,
    height: 242,
    position: 'absolute',
    top: 11,
    left: 11,
    borderRadius: 121,
  },
  gridOverlay: {
    position: 'absolute',
    top: 10,
    left: -16,
    width: 170,
    height: 248,
    opacity: 0.5,
  },
  horizontalLine: {
    position: 'absolute',
    width: 170,
    height: 1,
    backgroundColor: '#D9D9D9',
  },
  verticalLine: {
    position: 'absolute',
    width: 1,
    height: 170,
    backgroundColor: '#D9D9D9',
    top: 78,
    transform: [{ rotate: '90deg' }],
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 8,
    width: 226,
    height: 95,
    backgroundColor: 'rgba(43, 132, 179, 0.16)',
    borderTopLeftRadius: 113,
    borderTopRightRadius: 113,
  },
  horizontalGradientLine: {
    position: 'absolute',
    bottom: 137,
    left: 8,
    width: 226,
    height: 3,
    backgroundColor: '#2B84B3',
  },
  cameraFrame: {
    position: 'absolute',
    width: 265,
    height: 265,
    borderRadius: 132.5,
    borderWidth: 3,
    borderColor: '#2B84B3',
    backgroundColor: 'transparent',
  },
  bottomSection: {
    gap: 37,
    alignItems: 'center',
  },
  description: {
    width: 369,
    height: 119,
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#484C52',
    lineHeight: 20,
    textAlign: 'left',
  },
  takePhotoButton: {
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
  takePhotoButtonText: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
    lineHeight: 25,
  },
});
