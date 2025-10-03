import AddressAutocompleteEnhanced from '@/components/ui/AddressAutocompleteEnhanced';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { mediaApi, vendorApi } from '../../../api/client';
import { CreateVendorPayload, UpdateVendorPayload } from '../../../api/models';
import { Input } from '../../../components/ui/Input';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';

import { GooglePlacesSuggestion, getPlaceDetailsGoogle, isGoogleMapsConfigured } from '../../../utils/googleMapsLocation';
import { toast } from '../../../utils/toast';
import { commonValidationRules, validateField, validateMinLength, businessValidationRules } from '../../../utils/validation';

import { useImagePicker } from '../../../hooks/useImagePicker';

export default function AddStoreScreen() {
  const [storeName, setStoreName] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [selectedAddress, setSelectedAddress] = useState<{ latitude: number; longitude: number; placeId?: string | null; formattedAddress?: string | null } | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [showDeliveryDropdown, setShowDeliveryDropdown] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  const {
    selectedImage,
    isLoading: imageLoading,
    error: imageError,
    pickFromGallery,
    clearImage,
  } = useImagePicker({ base64: false });

  const handleGoBack = () => {
    router.back();
  };

  const handleNotifications = () => {
    console.log('Open notifications');
  };

  const handleSupport = () => {
    console.log('Open support');
  };

  const handleAddressSelect = async (suggestion: GooglePlacesSuggestion) => {
    // Only fetch place details (lat/lng and formatted address) when a suggestion is selected
    let latitude = suggestion.latitude;
    let longitude = suggestion.longitude;
    let formattedAddress = suggestion.displayName || suggestion.address;

    if ((latitude === 0 || longitude === 0 || latitude == null || longitude == null) && isGoogleMapsConfigured() && suggestion.placeId) {
      try {
        const details = await getPlaceDetailsGoogle(suggestion.placeId);
        if (details) {
          latitude = details.latitude;
          longitude = details.longitude;
          formattedAddress = details.formattedAddress || formattedAddress;
        }
      } catch (err) {
        console.warn('Failed to fetch place details for selected suggestion', err);
      }
    }

    const selected = {
      latitude: latitude || 0,
      longitude: longitude || 0,
      placeId: suggestion.placeId,
      formattedAddress,
    };

    setSelectedAddress(selected);
    setStoreAddress(formattedAddress);
    if (errors.storeAddress) setErrors(prev => ({ ...prev, storeAddress: null }));
  };

  const uploadImageForVendor = async (vendorId: string) => {
    if (!selectedImage) return null;

    try {
      const api = mediaApi();
      let resp: any = null;

      // Prepare upload payload in a web/native-safe way
      if (typeof File !== 'undefined' && selectedImage.uri && selectedImage.uri.startsWith('data:')) {
        const res = await fetch(selectedImage.uri);
        const blob = await res.blob();
        const fileToUpload = new File([blob], selectedImage.fileName || 'store-image.jpg', { type: blob.type || 'image/jpeg' });
        resp = await api.mediaUploadPost(fileToUpload as any, vendorId, 'Vendor');
      } else if (typeof File !== 'undefined' && selectedImage.uri) {
        const res = await fetch(selectedImage.uri);
        const blob = await res.blob();
        const fileToUpload = new File([blob], selectedImage.fileName || `store_${Date.now()}.jpg`, { type: blob.type || 'image/jpeg' });
        resp = await api.mediaUploadPost(fileToUpload as any, vendorId, 'Vendor');
      } else {
        const fileObj: any = {
          uri: selectedImage.uri,
          name: selectedImage.fileName || `store_${Date.now()}.jpg`,
          type: selectedImage.type || 'image/jpeg',
        };
        resp = await api.mediaUploadPost(fileObj as any, vendorId, 'Vendor');
      }

      // Try to extract Cloudinary upload info handling both wrapper and direct shapes
      const wrapper = resp?.data || resp || null;
      const cloudData = wrapper?.data || wrapper?.data?.data || wrapper || null;
      // Cloudinary's secure_url can be in cloudData.secure_url or wrapper.data.secure_url depending on backend shape
      const uploadedUrl = cloudData?.secure_url || cloudData?.url || wrapper?.secure_url || wrapper?.url || null;
      return uploadedUrl;
    } catch (err) {
      console.warn('Image upload failed', err);
      throw err;
    }
  };

  const handleAddStore = async () => {
    // Validation using validation util
    const newErrors: { [key: string]: string | null } = {};
    newErrors.storeName = validateField(storeName, commonValidationRules.name);

    if (isGoogleMapsConfigured()) {
      newErrors.storeAddress = (!selectedAddress || !selectedAddress.formattedAddress)
        ? 'Address is required.'
        : (!selectedAddress.latitude || !selectedAddress.longitude)
          ? 'Please select a valid address from suggestions.'
          : null;
    } else {
      newErrors.storeAddress = validateField(storeAddress, businessValidationRules.address);
    }

    newErrors.email = validateField(email, commonValidationRules.email);
    newErrors.phoneNumber = validateField(phoneNumber, commonValidationRules.phone);
    newErrors.deliveryMethod = validateField(deliveryMethod, [{ required: true, message: 'Delivery method is required.' }]);
    newErrors.description = description ? validateMinLength(description, 10, 'Description') : null;

    const hasErrors = Object.values(newErrors).some(v => v && v.length > 0);
    if (hasErrors) {
      setErrors(newErrors);
      toast.error('Please fix form errors');
      return;
    }

    setErrors({});
    setSubmitting(true);
    let toastId: any;
    try {
      toastId = toast.loading('Please wait while we set up your store', { header: 'Creating Store' });

      const payload: CreateVendorPayload = {
        name: storeName.trim(),
        address: (selectedAddress?.formattedAddress || storeAddress).trim() || null,
        email: email.trim() || null,
        tagline: null,
        details: description.trim() || null,
        image: null,
        longitude: selectedAddress?.longitude || null,
        latitude: selectedAddress?.latitude || null,
        meta: (phoneNumber.trim() || deliveryMethod || selectedAddress) ? {
          ...(phoneNumber.trim() && { phoneNumber: phoneNumber.trim() }),
          ...(deliveryMethod && { deliveryMethod }),
          ...(selectedAddress && { placeId: selectedAddress.placeId, formattedAddress: selectedAddress.formattedAddress }),
        } : null,
      };

      // Create vendor
      const api = vendorApi();
      const response = await api.vendorsPost(payload);
      const vendor = response?.data;

      if (!vendor?.id) {
        throw new Error('Failed to create store - no vendor ID returned');
      }

      // Upload image and attach to vendor if present
      if (selectedImage) {
        try {
          const uploadedUrl = await uploadImageForVendor(vendor.id);
          if (uploadedUrl) {
            try {
              const updatePayload: UpdateVendorPayload = { image: uploadedUrl };
              await api.vendorsIdPatch(updatePayload, vendor.id);
              // Update local object so subsequent logic sees the image immediately
              try { if (vendor) { (vendor as any).image = uploadedUrl; } } catch { /* ignore */ }
            } catch (patchErr) {
              console.warn('Failed to attach uploaded image to vendor record', patchErr);
            }
          }
        } catch (imageError) {
          console.warn('Image upload failed, but store was created:', imageError);
          toast.warning('Image upload failed', { header: 'Partial Success', description: 'Store created, but image upload failed' });
        }
      }

      toast.success('Store created successfully', { id: toastId, header: 'Store Created', description: 'Redirecting to document upload…', duration: 2500 });
      // Navigate to upload documents page with vendor id
      router.push(`/(private)/store/upload-documents?storeId=${vendor.id}` as any);
    } catch (err: any) {
      console.error('Failed to create vendor:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to create store';
      toast.error(errorMessage, { id: toastId, header: 'Failed to Create Store' });
    } finally {
      setSubmitting(false);
    }
  };

  const deliveryOptions = [
    'Pickup',
    'Delivery',
    'Both Pickup & Delivery',
  ];

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
            {/* Image upload */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Store Image</Text>
              <View style={styles.imageWrapper}>
                <TouchableOpacity 
                  style={[
                    styles.imagePicker, 
                    selectedImage && styles.imagePickerWithImage,
                    imageLoading && styles.imagePickerLoading
                  ]}
                  onPress={pickFromGallery}
                  activeOpacity={0.8}
                  disabled={imageLoading}
                >
                  {imageLoading ? (
                    <View style={styles.imageLoadingContainer}>
                      <LoadingSpinner size="small" />
                      <Text style={styles.imageLoadingText}>Processing image...</Text>
                    </View>
                  ) : selectedImage ? (
                    <>
                      <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
                      <View style={styles.imageOverlay}>
                        <TouchableOpacity style={styles.changeImageButton} onPress={pickFromGallery}>
                          <MaterialIcons name="swap-horiz" size={18} color="#FFF" />
                          <Text style={styles.changeImageText}>Change</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.removeImageButton} onPress={clearImage}>
                          <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <Path d="M12 4L4 12M4 4L12 12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                          </Svg>
                          <Text style={styles.removeImageText}>Remove</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <MaterialIcons name="photo-camera" size={48} color="#06888C" />
                      <Text style={styles.imagePlaceholderText}>Upload store image</Text>
                      <Text style={styles.imagePlaceholderSubText}>Tap to select from gallery</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
              {imageError ? <Text style={styles.errorText}>{imageError}</Text> : null}
            </View>

            {/* Store Name */}
            <View style={styles.fieldContainer}>
              <Input
                label="Store Name"
                placeholder="Enter store's name"
                value={storeName}
                onChangeText={(v) => { setStoreName(v); if (errors.storeName) setErrors(prev => ({ ...prev, storeName: null })); }}
                variant="default"
                size="large"
                containerStyle={styles.inputContainer}
                error={errors.storeName}
              />
            </View>

            {/* Store Address */}
            <View style={[styles.fieldContainer, { zIndex: 1 }]}>
              <Text style={styles.fieldLabel}>Store Address</Text>

              <AddressAutocompleteEnhanced
                onAddressSelect={handleAddressSelect}
                onCreateAddress={async () => Promise.resolve()}
                placeholder="Enter store address"
                autoFocus={false}
                value={storeAddress}
                onValueChange={(v) => { setStoreAddress(v); if (errors.storeAddress) setErrors(prev => ({ ...prev, storeAddress: null })); }}
                requireConfirmation
              />
              {selectedAddress ? (
                <View style={styles.coordinatesInfo}>
                  <Text style={styles.coordinatesText}>
                    {selectedAddress.formattedAddress}
                    {selectedAddress ? `\n(${selectedAddress.latitude.toFixed(5)}, ${selectedAddress.longitude.toFixed(5)})` : ''}
                  </Text>
                </View>
              ) : null}

              {errors.storeAddress ? <Text style={{ color: '#FF4444', marginTop: 6 }}>{errors.storeAddress}</Text> : null}
            </View>

            {/* Store Phone Number */}
            <View style={styles.fieldContainer}>
              <Input
                label="Store Phone number"
                placeholder="+1 223 335 6333"
                value={phoneNumber}
                onChangeText={(v) => { setPhoneNumber(v); if (errors.phoneNumber) setErrors(prev => ({ ...prev, phoneNumber: null })); }}
                keyboardType="phone-pad"
                variant="default"
                size="large"
                containerStyle={styles.inputContainer}
                error={errors.phoneNumber}
              />
            </View>

            {/* Store Email */}
            <View style={styles.fieldContainer}>
              <Input
                label="Store Email"
                placeholder="store@business.com"
                value={email}
                onChangeText={(v) => { setEmail(v); if (errors.email) setErrors(prev => ({ ...prev, email: null })); }}
                keyboardType="email-address"
                autoCapitalize="none"
                variant="default"
                size="large"
                containerStyle={styles.inputContainer}
                error={errors.email}
              />
            </View>

            {/* Store Description */}
            <View style={styles.fieldContainer}>
              <Input
                label="Store Description"
                placeholder="Briefly describe the store"
                value={description}
                onChangeText={(v) => { setDescription(v); if (errors.description) setErrors(prev => ({ ...prev, description: null })); }}
                multiline
                numberOfLines={4}
                variant="default"
                size="large"
                containerStyle={styles.inputContainer}
                inputStyle={{ textAlignVertical: 'top' }}
                error={errors.description}
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
                        if (errors.deliveryMethod) setErrors(prev => ({ ...prev, deliveryMethod: null }));
                        setShowDeliveryDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownOptionText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {errors.deliveryMethod ? <Text style={{ color: '#FF4444', marginTop: 6 }}>{errors.deliveryMethod}</Text> : null}
            </View>
          </View>


          {/* Add Store Button */}
          <TouchableOpacity 
            style={[
              styles.addStoreButton, 
              (submitting || imageLoading) && styles.addStoreButtonDisabled
            ]} 
            onPress={handleAddStore} 
            disabled={submitting || imageLoading}
          >
            {submitting ? (
              <View style={styles.buttonLoadingContainer}>
                <LoadingSpinner size="small" color="#FFF" />
                <Text style={styles.addStoreButtonText}>Creating Store...</Text>
              </View>
            ) : (
              <Text style={styles.addStoreButtonText}>Add Store</Text>
            )}
          </TouchableOpacity>

          {(submitting || imageLoading) && <LoadingSpinner overlay message={submitting ? 'Saving store...' : 'Processing image...'} />}
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
    width: '100%',
  },
  fieldLabel: {
    fontFamily: 'Raleway',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 8,
    color: '#333333',
  },
  fieldSubLabel: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#6F7380',
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
  addStoreButtonDisabled: {
    backgroundColor: '#B4BED4',
    opacity: 0.7,
  },
  buttonLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  imageWrapper: {
    marginBottom: 12,
  },
  imagePicker: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  imagePickerWithImage: {
    borderStyle: 'solid',
    borderColor: '#06888C',
    backgroundColor: '#FFF',
  },
  imagePickerLoading: {
    backgroundColor: '#F5F5F5',
    borderColor: '#D1D5DB',
  },
  imagePlaceholder: {
    alignItems: 'center',
    gap: 12,
  },
  imagePlaceholderText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Raleway',
    color: '#06888C',
  },
  imagePlaceholderSubText: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#7C8BA0',
  },
  imageLoadingContainer: {
    alignItems: 'center',
    gap: 12,
  },
  imageLoadingText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Open Sans',
    color: '#7C8BA0',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
  },
  changeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  changeImageText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Raleway',
  },
  removeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  removeImageText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Raleway',
  },
  errorText: {
    color: '#FF4D4F',
    marginTop: 8,
    fontSize: 12,
  },
  coordinatesInfo: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#E6F7FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#91D5FF',
  },
  coordinatesText: {
    fontSize: 11,
    color: '#0050B3',
    fontFamily: 'Open Sans',
    fontWeight: '500',
  },
});
