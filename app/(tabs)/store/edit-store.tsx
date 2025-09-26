import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Path, Svg } from 'react-native-svg';

export default function EditStoreScreen() {
  const [storeName, setStoreName] = useState('');
  const [email, setEmail] = useState('Damilareadebanjo@gmail.com');
  const [phoneNumber, setPhoneNumber] = useState('+1 223 335 6333');

  const handleBack = () => {
    router.back();
  };

  const handleSaveChanges = () => {
    console.log('Save changes:', { storeName, email, phoneNumber });
    // Add save logic here
    router.back();
  };

  const handleThumbnailPress = () => {
    console.log('Change store thumbnail');
    // Add image picker logic here
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#06888C" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.leftSection}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Svg width="31" height="30" viewBox="0 0 31 30" fill="none">
                <Path 
                  d="M20.1278 21.993C20.3661 22.2135 20.5 22.5125 20.5 22.8243C20.5 23.1361 20.3661 23.4352 20.1278 23.6556C19.8895 23.8761 19.5662 24 19.2292 24C18.8921 24 18.5689 23.8761 18.3306 23.6556L9.87313 15.8313C9.75486 15.7223 9.66102 15.5927 9.59699 15.4501C9.53296 15.3074 9.5 15.1545 9.5 15C9.5 14.8455 9.53296 14.6926 9.59699 14.5499C9.66102 14.4073 9.75486 14.2777 9.87313 14.1687L18.3306 6.34435C18.5689 6.12387 18.8921 6 19.2292 6C19.5662 6 19.8895 6.12387 20.1278 6.34435C20.3661 6.56483 20.5 6.86387 20.5 7.17568C20.5 7.48749 20.3661 7.78653 20.1278 8.00702L12.57 14.999L20.1278 21.993Z" 
                  fill="white"
                />
              </Svg>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Store</Text>
          </View>
          <View style={styles.rightSection}>
            <TouchableOpacity style={styles.iconButton}>
              <Svg width="25" height="24" viewBox="0 0 25 24" fill="none">
                <Path 
                  d="M9.145 20.5C9.36103 21.2219 9.80417 21.8549 10.4086 22.3049C11.013 22.755 11.7464 22.998 12.5 22.998C13.2536 22.998 13.987 22.755 14.5914 22.3049C15.1958 21.8549 15.639 21.2219 15.855 20.5H9.145ZM3.5 19.5H21.5V16.5L19.5 13.5V8.5C19.5 7.58075 19.3189 6.6705 18.9672 5.82122C18.6154 4.97194 18.0998 4.20026 17.4497 3.55025C16.7997 2.90024 16.0281 2.38463 15.1788 2.03284C14.3295 1.68106 13.4193 1.5 12.5 1.5C11.5807 1.5 10.6705 1.68106 9.82122 2.03284C8.97194 2.38463 8.20026 2.90024 7.55025 3.55025C6.90024 4.20026 6.38463 4.97194 6.03284 5.82122C5.68106 6.6705 5.5 7.58075 5.5 8.5V13.5L3.5 16.5V19.5Z" 
                  fill="white"
                />
              </Svg>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Svg width="25" height="24" viewBox="0 0 25 24" fill="none">
                <Path 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M20.3 10.18C19.99 7.00003 18.11 2.00002 12.3 2.00002C6.49002 2.00002 4.61001 7.00003 4.30002 10.18C3.21252 10.5928 2.4952 11.6369 2.50002 12.8V14.2C2.50002 15.7464 3.75365 17 5.30001 17C6.84642 17 8.10004 15.7464 8.10004 14.2V12.8C8.09498 11.6619 7.40404 10.6393 6.35001 10.21C6.55002 8.37 7.53004 4.00003 12.3 4.00003C17.07 4.00003 18.04 8.37 18.24 10.21C17.1882 10.6403 16.5007 11.6636 16.5 12.8V14.2C16.5022 14.7269 16.6524 15.2425 16.9335 15.6881C17.2147 16.1337 17.6154 16.4913 18.09 16.72C17.67 17.51 16.6 18.58 13.97 18.9C13.4443 18.1017 12.4272 17.787 11.5424 18.1489C10.6578 18.5108 10.1528 19.4482 10.3373 20.386C10.5218 21.3239 11.3442 22 12.3 22C12.6704 21.998 13.0329 21.8931 13.3472 21.6971C13.6615 21.5011 13.9152 21.2217 14.08 20.89C18.37 20.4 19.74 18.19 20.17 16.89C21.3333 16.5132 22.1157 15.4228 22.1 14.2V12.8C22.1048 11.6369 21.3875 10.5928 20.3 10.18Z" 
                  fill="white"
                />
              </Svg>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Store Thumbnail Section */}
        <View style={styles.thumbnailSection}>
          <TouchableOpacity style={styles.thumbnailContainer} onPress={handleThumbnailPress}>
            <View style={styles.thumbnailBackground}>
              <Svg width="65" height="67" viewBox="0 0 65 67" fill="none">
                <Path 
                  d="M55 20C60.5228 20 65 15.5228 65 10C65 4.47715 60.5228 0 55 0C49.4772 0 45 4.47715 45 10C45 15.5228 49.4772 20 55 20Z" 
                  fill="#06888C"
                />
                <Path 
                  d="M55 19.5C60.2467 19.5 64.5 15.2467 64.5 10C64.5 4.75329 60.2467 0.5 55 0.5C49.7533 0.5 45.5 4.75329 45.5 10C45.5 15.2467 49.7533 19.5 55 19.5Z" 
                  stroke="white"
                />
                <Path 
                  d="M58.542 14.166H51.458C51.182 14.1657 50.9174 14.056 50.7222 13.8608C50.527 13.6656 50.4173 13.401 50.417 13.125V8.125C50.417 7.84882 50.5266 7.58393 50.7218 7.38855C50.917 7.19317 51.1818 7.08327 51.458 7.083H52.868L53.378 6.063C53.4123 5.99353 53.4655 5.93512 53.5315 5.89445C53.5974 5.85378 53.6735 5.83249 53.751 5.833H56.251C56.3284 5.83283 56.4043 5.85427 56.4702 5.89491C56.5361 5.93554 56.5894 5.99375 56.624 6.063L57.133 7.083H58.542C58.8182 7.083 59.0831 7.19265 59.2784 7.38784C59.4738 7.58304 59.5837 7.84782 59.584 8.124V13.124C59.584 13.4004 59.4742 13.6654 59.2788 13.8608C59.0834 14.0562 58.8183 14.166 58.542 14.166ZM55.001 8.541C54.5887 8.54061 54.1856 8.66249 53.8426 8.89125C53.4997 9.12 53.2322 9.44534 53.0742 9.8261C52.9162 10.2069 52.8746 10.626 52.9548 11.0303C53.035 11.4347 53.2333 11.8063 53.5247 12.0979C53.816 12.3896 54.1874 12.5882 54.5917 12.6688C54.996 12.7494 55.4151 12.7082 55.796 12.5506C56.177 12.3929 56.5026 12.1258 56.7316 11.783C56.9607 11.4403 57.083 11.0373 57.083 10.625C57.0825 10.0728 56.863 9.54334 56.4727 9.15268C56.0824 8.76203 55.5532 8.54206 55.001 8.541Z" 
                  fill="white"
                />
                <Path 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M11.4997 19.1036C22.4783 17.4821 28.6676 17.4964 39.4997 19.1036C39.628 19.1232 39.7537 19.1567 39.8747 19.2036C43.1983 20.47 45.9605 22.8814 47.664 26.0036C49.089 28.5607 49.6069 31.1179 49.6069 32.5464C49.6069 38.1536 44.8926 42.575 39.2354 42.575C36.6104 42.575 34.1997 41.6286 32.3676 40.0607C30.4515 41.6907 28.0153 42.5813 25.4997 42.5714C22.8747 42.5714 20.464 41.625 18.6319 40.0571C16.7162 41.6884 14.2801 42.5803 11.764 42.5714C6.10686 42.5714 1.39258 38.1536 1.39258 32.5464C1.39258 31.1179 1.91044 28.5607 3.33544 26.0036C5.03805 22.882 7.79892 20.4707 11.1211 19.2036C11.2444 19.1562 11.3726 19.1227 11.5033 19.1036M8.48544 47.25C8.48544 46.658 8.25026 46.0902 7.83166 45.6716C7.41305 45.253 6.84529 45.0179 6.25329 45.0179C5.66129 45.0179 5.09354 45.253 4.67493 45.6716C4.25632 46.0902 4.02115 46.658 4.02115 47.25V56.7321C4.02115 59.2179 5.00838 61.602 6.76576 63.36C8.52314 65.1181 10.9068 66.1062 13.3926 66.1071H37.6069C40.0933 66.1071 42.4778 65.1194 44.236 63.3613C45.9941 61.6031 46.9819 59.2186 46.9819 56.7321V47.25C46.9819 46.658 46.7467 46.0902 46.3281 45.6716C45.9095 45.253 45.3417 45.0179 44.7497 45.0179C44.1577 45.0179 43.59 45.253 43.1714 45.6716C42.7528 46.0902 42.5176 46.658 42.5176 47.25V56.7321C42.5176 59.4464 40.3176 61.6429 37.6069 61.6429H32.9819V47.25C32.9819 46.658 32.7467 46.0902 32.3281 45.6716C31.9095 45.253 31.3417 45.0179 30.7497 45.0179C30.1577 45.0179 29.59 45.253 29.1714 45.6716C28.7527 46.0902 28.5176 46.658 28.5176 47.25V50.2679H8.48186L8.48544 47.25ZM8.48544 56.7321V54.7321H28.5212V61.6429H13.3926C10.6783 61.6429 8.48186 59.4429 8.48186 56.7321" 
                  fill="#06888C"
                />
              </Svg>
            </View>
          </TouchableOpacity>
          <Text style={styles.thumbnailText}>Store Thumbnail</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Store Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Store Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter store's name"
                placeholderTextColor="#7C8BA0"
                value={storeName}
                onChangeText={setStoreName}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Email Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.textInput, styles.filledInput]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Phone Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone number</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                placeholderTextColor="#7C8BA0"
              />
            </View>
          </View>
        </View>

        {/* Save Button */}
        <View style={styles.buttonSection}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
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
    backgroundColor: '#06888C',
    paddingTop: 19,
    paddingBottom: 19,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 4,
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
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  thumbnailSection: {
    alignItems: 'center',
    paddingTop: 39,
    paddingBottom: 37,
    gap: 14,
  },
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnailBackground: {
    width: 85,
    height: 85,
    borderRadius: 16,
    backgroundColor: '#FFEBF0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 2.5,
    paddingBottom: 18,
    paddingLeft: 18,
  },
  thumbnailText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#000',
    textAlign: 'center',
  },
  formSection: {
    paddingHorizontal: 20,
    gap: 21,
    paddingBottom: 37,
  },
  inputGroup: {
    gap: 9,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#000',
  },
  inputContainer: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#FFF',
  },
  textInput: {
    height: 56,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 12,
    fontFamily: 'Open Sans',
    color: '#7C8BA0',
    fontWeight: '400',
  },
  filledInput: {
    color: '#100A37',
  },
  buttonSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  saveButton: {
    backgroundColor: '#06888C',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 50,
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
  saveButtonText: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
    lineHeight: 25,
    textAlign: 'center',
  },
});
