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

export default function CameraScreen() {
  const handleCapture = () => {
    // In a real app, this would capture the photo
    // For now, navigate to verified screen
    router.push('/vendor/verified');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1E1E" />
      
      {/* Header */}
      <SafeAreaView style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <View style={styles.backButtonCircle}>
            <Text style={styles.backArrow}>‹</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Camera Content */}
      <View style={styles.cameraContent}>
        {/* Title */}
        <Text style={styles.title}>Take a photo</Text>

        {/* Camera Preview - Using placeholder image from Figma */}
        <View style={styles.cameraPreview}>
          <Image
            source={{
              uri: 'https://api.builder.io/api/v1/image/assets/TEMP/07c3e9b1fb975b211485481bb3285786543944d3?width=618'
            }}
            style={styles.previewImage}
            resizeMode="cover"
          />
          
          {/* Oval overlay guide */}
          <View style={styles.ovalGuide} />
        </View>

        {/* Instructions */}
        <Text style={styles.instructions}>
          Position yourself in the oval and hold still
        </Text>

        {/* Capture Button */}
        <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
          <View style={styles.captureButtonInner}>
            <View style={styles.captureButtonCenter} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
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
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  cameraContent: {
    flex: 1,
    paddingHorizontal: 61,
    paddingTop: 71,
    alignItems: 'center',
    gap: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Raleway',
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 25,
  },
  cameraPreview: {
    width: 309,
    height: 404,
    borderRadius: 150,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  ovalGuide: {
    position: 'absolute',
    top: '20%',
    left: '15%',
    width: '70%',
    height: '60%',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 120,
    backgroundColor: 'transparent',
  },
  instructions: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Raleway',
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 25,
  },
  captureButton: {
    width: 101,
    height: 100,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 81,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  captureButtonCenter: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
  },
});
