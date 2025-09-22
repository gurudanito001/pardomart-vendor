import { router } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PersonIllustration from '../../assets/images/take-photo.svg';
import { BackArrowIcon } from '../../components/icons';

export default function TakePhotoScreen() {
  const handleTakePhoto = () => {
    // In a real app, this would capture the photo
    // For now, navigate to verified screen
    router.push('/auth/verified');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <View style={styles.backButtonContainer}>
            <BackArrowIcon />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify it&apos;s you</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Let&apos;s verify your identity</Text>
            <Text style={styles.subtitle}>
              Position yourself in the center of the camera to take a photo of yourself
            </Text>
          </View>

            <PersonIllustration width={200} height={200} />


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
    paddingTop: 20,
    gap: 12,
  },
  backButtonContainer: {
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
    lineHeight: 22,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 21,
    paddingBottom: 30,
    gap: 30,
  },
  titleSection: {
    gap: 11,
    maxWidth: 347,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#484C52',
  },
  bottomSection: {
    gap: 37,
    alignItems: 'center',
  },
  description: {
    width: 369,
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#484C52',
    lineHeight: 20,
  },
  takePhotoButton: {
    backgroundColor: '#06888C',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 40,
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