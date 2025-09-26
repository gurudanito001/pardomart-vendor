import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { Input } from '../../../components/ui/Input';

export default function AddStoreScreen() {
  const [storeName, setStoreName] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [showDeliveryDropdown, setShowDeliveryDropdown] = useState(false);

  const handleGoBack = () => {
    router.back();
  };

  const handleNotifications = () => {
    console.log('Open notifications');
  };

  const handleSupport = () => {
    console.log('Open support');
  };

  const handleAddStore = () => {
    console.log('Add store with data:', {
      storeName,
      storeAddress,
      phoneNumber,
      deliveryMethod,
    });
    // Here you would typically validate and submit the form
    // Navigate to populated store view after successful submission
    router.push('/(private)/store' as any);
  };

  const deliveryOptions = [
    'Pickup',
    'Delivery',
    'Both Pickup & Delivery',
  ];

  const LocationIcon = () => (
    <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <Path d="M11.3451 0.00354333L11.4077 0L11.4844 0.00472435L11.5376 0.0141732L11.6102 0.0348425L11.6734 0.0620079L11.7325 0.0956692L11.7856 0.135236L11.8341 0.179527L11.8648 0.21437L11.9132 0.282874L11.9439 0.339567C11.9715 0.398622 11.9892 0.460827 11.997 0.526181L12 0.588779C12 0.633268 11.9953 0.676575 11.9858 0.718701L11.9652 0.791338L8.10768 11.4667C8.03455 11.6259 7.91728 11.7608 7.76979 11.8553C7.62229 11.9498 7.45077 12.0001 7.27559 12C7.11785 12.0003 6.9627 11.9599 6.82518 11.8826C6.68767 11.8053 6.57247 11.6938 6.49075 11.5589L6.45236 11.4839L4.47283 7.52598L0.533858 5.55591C0.388111 5.48925 0.262419 5.38549 0.169354 5.25501C0.0762889 5.12454 0.0191125 4.97191 0.00354333 4.8124L0 4.72441C0 4.3937 0.177756 4.09134 0.496654 3.91535L0.579331 3.87402L11.2193 0.0318897L11.2819 0.0141732L11.3451 0.00354333Z" fill="#BBBBBB"/>
    </Svg>
  );

  const DropdownArrow = () => (
    <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <Path d="M4.5 6L8 9.5L11.5 6" stroke="black"/>
    </Svg>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#06888C" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.leftSection}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              {/* Back Arrow Icon */}
              <Svg width="31" height="30" viewBox="0 0 31 30" fill="none">
                <Path d="M20.1278 21.993C20.3661 22.2135 20.5 22.5125 20.5 22.8243C20.5 23.1361 20.3661 23.4352 20.1278 23.6556C19.8895 23.8761 19.5662 24 19.2292 24C18.8921 24 18.5689 23.8761 18.3306 23.6556L9.87313 15.8313C9.75486 15.7223 9.66102 15.5927 9.59699 15.4501C9.53296 15.3074 9.5 15.1545 9.5 15C9.5 14.8455 9.53296 14.6926 9.59699 14.5499C9.66102 14.4073 9.75486 14.2777 9.87313 14.1687L18.3306 6.34435C18.5689 6.12387 18.8921 6 19.2292 6C19.5662 6 19.8895 6.12387 20.1278 6.34435C20.3661 6.56483 20.5 6.86387 20.5 7.17568C20.5 7.48749 20.3661 7.78653 20.1278 8.00702L12.57 14.999L20.1278 21.993Z" fill="white"/>
              </Svg>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Store</Text>
          </View>
          <View style={styles.rightSection}>
            <TouchableOpacity style={styles.iconButton} onPress={handleNotifications}>
              {/* Notification Bell Icon */}
              <Svg width="25" height="24" viewBox="0 0 25 24" fill="none">
                <Path d="M9.145 20.5C9.36103 21.2219 9.80417 21.8549 10.4086 22.3049C11.013 22.755 11.7464 22.998 12.5 22.998C13.2536 22.998 13.987 22.755 14.5914 22.3049C15.1958 21.8549 15.639 21.2219 15.855 20.5H9.145ZM3.5 19.5H21.5V16.5L19.5 13.5V8.5C19.5 7.58075 19.3189 6.6705 18.9672 5.82122C18.6154 4.97194 18.0998 4.20026 17.4497 3.55025C16.7997 2.90024 16.0281 2.38463 15.1788 2.03284C14.3295 1.68106 13.4193 1.5 12.5 1.5C11.5807 1.5 10.6705 1.68106 9.82122 2.03284C8.97194 2.38463 8.20026 2.90024 7.55025 3.55025C6.90024 4.20026 6.38463 4.97194 6.03284 5.82122C5.68106 6.6705 5.5 7.58075 5.5 8.5V13.5L3.5 16.5V19.5Z" fill="white"/>
              </Svg>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleSupport}>
              {/* Support Icon */}
              <Svg width="25" height="24" viewBox="0 0 25 24" fill="none">
                <Path fillRule="evenodd" clipRule="evenodd" d="M20.3 10.18C19.99 7.00003 18.11 2.00002 12.3 2.00002C6.49002 2.00002 4.61001 7.00003 4.30002 10.18C3.21252 10.5928 2.4952 11.6369 2.50002 12.8V14.2C2.50002 15.7464 3.75365 17 5.30001 17C6.84642 17 8.10004 15.7464 8.10004 14.2V12.8C8.09498 11.6619 7.40404 10.6393 6.35001 10.21C6.55002 8.37 7.53004 4.00003 12.3 4.00003C17.07 4.00003 18.04 8.37 18.24 10.21C17.1882 10.6403 16.5007 11.6636 16.5 12.8V14.2C16.5022 14.7269 16.6524 15.2425 16.9335 15.6881C17.2147 16.1337 17.6154 16.4913 18.09 16.72C17.67 17.51 16.6 18.58 13.97 18.9C13.4443 18.1017 12.4272 17.787 11.5424 18.1489C10.6578 18.5108 10.1528 19.4482 10.3373 20.386C10.5218 21.3239 11.3442 22 12.3 22C12.6704 21.998 13.0329 21.8931 13.3472 21.6971C13.6615 21.5011 13.9152 21.2217 14.08 20.89C18.37 20.4 19.74 18.19 20.17 16.89C21.3333 16.5132 22.1157 15.4228 22.1 14.2V12.8C22.1048 11.6369 21.3875 10.5928 20.3 10.18ZM6.10002 14.2C6.10002 14.6418 5.74185 15 5.30001 15C4.85816 15 4.50004 14.6419 4.50004 14.2V12.8C4.49923 12.6944 4.51933 12.5898 4.55917 12.492C4.59901 12.3942 4.65781 12.3053 4.73217 12.2304C4.80654 12.1554 4.895 12.0959 4.99247 12.0554C5.08993 12.0148 5.19446 11.9939 5.30003 11.9939C5.40561 11.9939 5.51014 12.0148 5.6076 12.0554C5.70506 12.0959 5.79352 12.1554 5.36789 12.2304C5.44226 12.3053 5.50105 12.3942 5.5409 12.492C5.58074 12.5898 5.60083 12.6944 5.60002 12.8V14.2ZM18.5 12.8C18.5 12.3582 18.8582 12 19.3 12C19.7419 12 20.1 12.3582 20.1 12.8V14.2C20.1 14.6418 19.7419 15 19.3 15C18.8582 15 18.5 14.6419 18.5 14.2V12.8Z" fill="white"/>
              </Svg>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Page Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Add Store</Text>
            <Text style={styles.subtitle}>
              Provide all the information of your stores here
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Store Name */}
            <View style={styles.fieldContainer}>
              <Input
                label="Store Name"
                placeholder="Enter store's name"
                value={storeName}
                onChangeText={setStoreName}
                variant="default"
                size="large"
                containerStyle={styles.inputContainer}
              />
            </View>

            {/* Store Address */}
            <View style={styles.fieldContainer}>
              <Input
                label="Store Address"
                placeholder="Enter Address"
                value={storeAddress}
                onChangeText={setStoreAddress}
                leftIcon={<LocationIcon />}
                variant="default"
                size="large"
                containerStyle={styles.inputContainer}
              />
            </View>

            {/* Store Phone Number */}
            <View style={styles.fieldContainer}>
              <Input
                label="Store Phone number"
                placeholder="+1 223 335 6333"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                variant="default"
                size="large"
                containerStyle={styles.inputContainer}
              />
            </View>

            {/* Delivery Method */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Delivery method available</Text>
              <TouchableOpacity
                style={styles.dropdownContainer}
                onPress={() => setShowDeliveryDropdown(!showDeliveryDropdown)}
              >
                <Text style={styles.dropdownText}>
                  {deliveryMethod || 'Select delivery modes available for store'}
                </Text>
                <DropdownArrow />
              </TouchableOpacity>
              
              {showDeliveryDropdown && (
                <View style={styles.dropdownOptions}>
                  {deliveryOptions.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.dropdownOption}
                      onPress={() => {
                        setDeliveryMethod(option);
                        setShowDeliveryDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownOptionText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Add Store Button */}
          <TouchableOpacity style={styles.addStoreButton} onPress={handleAddStore}>
            <Text style={styles.addStoreButtonText}>Add Store</Text>
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
    paddingVertical: 19,
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 19,
    paddingBottom: 30,
  },
  titleSection: {
    marginBottom: 47,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#000',
    marginBottom: 7,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#484C52',
  },
  formContainer: {
    marginBottom: 47,
  },
  fieldContainer: {
    marginBottom: 21,
  },
  inputContainer: {
    marginBottom: 0,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#000',
    marginBottom: 9,
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#FFF',
  },
  dropdownText: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#7C8BA0',
    flex: 1,
  },
  dropdownOptions: {
    marginTop: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownOption: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownOptionText: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#000',
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
