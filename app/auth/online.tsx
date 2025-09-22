import { router } from 'expo-router';
import React from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function OnlineScreen() {
  const handleGoOnline = () => {
    // In a real app, this would navigate to the main vendor dashboard
    console.log('Vendor is now online!');
  };

  const handleClose = () => {
    // Navigate to vendor dashboard or main app
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      {/* Background Map Image */}
      <ImageBackground
        source={{
          uri: 'https://api.builder.io/api/v1/image/assets/TEMP/3619225119bd10f6a1c9579a1f7e6b81d11749d1?width=860'
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >

        {/* Content Modal */}
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            {/* Close Button */}
            <View style={styles.closeButtonContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <Text style={styles.closeIcon}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Modal Content */}
            <View style={styles.modalContent}>
              {/* Illustration */}
              <Image
                source={{
                  uri: 'https://api.builder.io/api/v1/image/assets/TEMP/03f50fd3e3a434701199d92f125f450382b1bfbb?width=324'
                }}
                style={styles.illustration}
                resizeMode="contain"
              />

              {/* Title */}
              <Text style={styles.title}>
                Go online now to start taking Orders and Earn
              </Text>

              {/* Go Online Button */}
              <TouchableOpacity style={styles.goOnlineButton} onPress={handleGoOnline}>
                <Text style={styles.goOnlineButtonText}>Go Online</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 19,
    paddingTop: 29,
    paddingBottom: 10,
    minHeight: 435,
  },
  closeButtonContainer: {
    alignItems: 'flex-end',
    marginBottom: 27,
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  modalContent: {
    alignItems: 'center',
    gap: 27,
  },
  illustration: {
    width: 162,
    height: 162,
  },
  title: {
    width: 270,
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#000',
    textAlign: 'center',
    lineHeight: 24,
  },
  goOnlineButton: {
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
  goOnlineButtonText: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
  },
});
