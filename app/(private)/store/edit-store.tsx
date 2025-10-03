import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { mediaApi, vendorApi } from '../../../api/client';
import { UpdateVendorPayload } from '../../../api/models';
import AddressAutocompleteEnhanced from '../../../components/ui/AddressAutocompleteEnhanced';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { useAvatarPicker } from '../../../hooks/useImagePicker';
import { toast } from '../../../utils/toast';
import { businessValidationRules, commonValidationRules, validateField, validateMinLength } from '../../../utils/validation';

export default function EditStoreScreen() {
  const params = useLocalSearchParams<{ storeId?: string }>();
  const storeId = String(params.storeId || '');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [storeName, setStoreName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [selectedAddress, setSelectedAddress] = useState<{ latitude: number; longitude: number; placeId?: string | null; formattedAddress?: string | null } | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  const [errors, setErrors] = useState<{
    storeName?: string | null;
    address?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    description?: string | null;
  }>({});

  const {
    selectedImage,
    isLoading: imageLoading,
    error: imageError,
    pickFromGallery,
    pickFromCamera,
    showImagePicker,
    clearImage,
  } = useAvatarPicker({ base64: false });

  useEffect(() => {
    const fetchVendor = async () => {
      if (!storeId) {
        toast.error('Missing store id');
        setLoading(false);
        return;
      }

      try {
        const api = vendorApi();
        const res = await api.vendorsIdGet(storeId);
        const vendor = res?.data;
        if (!vendor) {
          toast.error('Store not found');
          setLoading(false);
          return;
        }

        setStoreName(vendor.name || '');
        setEmail(vendor.email || '');
        setDescription((vendor.details || vendor.tagline) ?? '');
        setAddress(vendor.address || '');
        setExistingImageUrl(vendor.image || null);

        if (vendor.latitude != null || vendor.longitude != null) {
          setSelectedAddress({ latitude: vendor.latitude ?? 0, longitude: vendor.longitude ?? 0, formattedAddress: vendor.address ?? undefined, placeId: undefined });
        }

        try {
          const meta = (vendor as any).meta as any;
          if (meta && meta.phoneNumber) setPhoneNumber(String(meta.phoneNumber));
        } catch {}

      } catch (err: any) {
        const msg = err?.response?.data?.message || err?.message || 'Failed to load store';
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [storeId]);

  const handleBack = () => router.back();

  const handleNotifications = () => {
    console.log('Open notifications');
  };

  const handleSupport = () => {
    console.log('Open support');
  };

  const handleAddressSelect = async (suggestion: any) => {
    setSelectedAddress({
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
      placeId: suggestion.placeId,
      formattedAddress: suggestion.displayName || suggestion.formattedAddress || suggestion.address,
    });
    setAddress(suggestion.displayName || suggestion.formattedAddress || suggestion.address || '');
    // clear any previous address error
    setErrors(prev => ({ ...prev, address: null }));
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    newErrors.storeName = validateField(storeName, commonValidationRules.name);
    newErrors.email = validateField(email, commonValidationRules.email);
    newErrors.phoneNumber = validateField(phoneNumber, commonValidationRules.phone);

    // Address rule: required + min length
    newErrors.address = validateField(address, businessValidationRules.address);

    // Description - optional but should have min length if present
    newErrors.description = description ? validateMinLength(description, 10, 'Description') : null;

    setErrors(newErrors);

    // Return boolean whether any errors
    return !Object.values(newErrors).some(Boolean);
  };

  const uploadImageForVendor = async (vendorId: string) => {
    if (!selectedImage) return null;

    try {
      const api = mediaApi();
      let resp: any = null;

      if (typeof File !== 'undefined' && selectedImage.uri && selectedImage.uri.startsWith('data:')) {
        const res = await fetch(selectedImage.uri);
        const blob = await res.blob();
        const fileToUpload = new File([blob], selectedImage.fileName || `store_${Date.now()}.jpg`, { type: blob.type || 'image/jpeg' });
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

      const wrapper = resp?.data || resp || null;
      const cloudData = wrapper?.data || wrapper?.data?.data || wrapper || null;
      const uploadedUrl = cloudData?.secure_url || cloudData?.url || wrapper?.secure_url || wrapper?.url || null;
      return uploadedUrl;
    } catch (err) {
      console.warn('Image upload failed', err);
      throw err;
    }
  };

  const handleSaveChanges = async () => {
    // Run validation first
    const isValid = validateForm();
    if (!isValid) {
      toast.error('Please fix the highlighted errors');
      return;
    }

    if (!storeId) {
      toast.error('Missing store id');
      return;
    }

    setSaving(true);
    let toastId: any;
    try {
      toastId = toast.loading('Updating store...', { header: 'Saving' });

      const api = vendorApi();
      let imageUrlToUse = existingImageUrl;

      if (selectedImage) {
        try {
          const uploaded = await uploadImageForVendor(storeId);
          if (uploaded) imageUrlToUse = uploaded;
        } catch (imgErr) {
          toast.warning('Image upload failed, saving other changes', { id: toastId });
        }
      }

      const payload: UpdateVendorPayload = {
        name: storeName.trim() || undefined,
        email: email.trim() || undefined,
        details: description.trim() || undefined,
        image: imageUrlToUse || undefined,
        address: address.trim() || undefined,
        longitude: selectedAddress?.longitude ?? undefined,
        latitude: selectedAddress?.latitude ?? undefined,
        meta: phoneNumber ? { phoneNumber: phoneNumber.trim() } : undefined,
      };

      await api.vendorsIdPatch(payload, storeId);

      toast.success('Store updated successfully', { id: toastId });
      router.replace('/(private)/store?refresh=true' as any);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to update store';
      toast.error(msg, { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  // Field-level blur handlers to validate individually
  const handleBlur = (field: string) => {
    if (field === 'storeName') {
      setErrors(prev => ({ ...prev, storeName: validateField(storeName, commonValidationRules.name) }));
    }
    if (field === 'email') {
      setErrors(prev => ({ ...prev, email: validateField(email, commonValidationRules.email) }));
    }
    if (field === 'phoneNumber') {
      setErrors(prev => ({ ...prev, phoneNumber: validateField(phoneNumber, commonValidationRules.phone) }));
    }
    if (field === 'address') {
      setErrors(prev => ({ ...prev, address: validateField(address, businessValidationRules.address) }));
    }
    if (field === 'description') {
      setErrors(prev => ({ ...prev, description: description ? validateMinLength(description, 10, 'Description') : null }));
    }
  };

  // Accessible hitSlop for small targets
  const defaultHitSlop = { top: 10, bottom: 10, left: 10, right: 10 };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#06888C" />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.leftSection}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack} hitSlop={defaultHitSlop} accessibilityRole="button" accessibilityLabel="Go back">
              <Svg width="31" height="30" viewBox="0 0 31 30" fill="none">
                <Path d="M20.1278 21.993C20.3661 22.2135 20.5 22.5125 20.5 22.8243C20.5 23.1361 20.3661 23.4352 20.1278 23.6556C19.8895 23.8761 19.5662 24 19.2292 24C18.8921 24 18.5689 23.8761 18.3306 23.6556L9.87313 15.8313C9.75486 15.7223 9.66102 15.5927 9.59699 15.4501C9.53296 15.3074 9.5 15.1545 9.5 15C9.5 14.8455 9.53296 14.6926 9.59699 14.5499C9.66102 14.4073 9.75486 14.2777 9.87313 14.1687L18.3306 6.34435C18.5689 6.12387 18.8921 6 19.2292 6C19.5662 6 19.8895 6.12387 20.1278 6.34435C20.3661 6.56483 20.5 6.86387 20.5 7.17568C20.5 7.48749 20.3661 7.78653 20.1278 8.00702L12.57 14.999L20.1278 21.993Z" fill="white" />
              </Svg>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Store</Text>
          </View>
          <View style={styles.rightSection}>
            <TouchableOpacity style={styles.iconButton} onPress={handleNotifications}>
              <Svg width="24" height="24" viewBox="0 0 25 24" fill="none">
                <Path d="M9.145 20.5C9.36103 21.2219 9.80417 21.8549 10.4086 22.3049C11.013 22.755 11.7464 22.998 12.5 22.998C13.2536 22.998 13.987 22.755 14.5914 22.3049C15.1958 21.8549 15.639 21.2219 15.855 20.5H9.145ZM3.5 19.5H21.5V16.5L19.5 13.5V8.5C19.5 7.58075 19.3189 6.6705 18.9672 5.82122C18.6154 4.97194 18.0998 4.20026 17.4497 3.55025C16.7997 2.90024 16.0281 2.38463 15.1788 2.03284C14.3295 1.68106 13.4193 1.5 12.5 1.5C11.5807 1.5 10.6705 1.68106 9.82122 2.03284C8.97194 2.38463 8.20026 2.90024 7.55025 3.55025C6.90024 4.20026 6.38463 4.97194 6.03284 5.82122C5.68106 6.6705 5.5 7.58075 5.5 8.5V13.5L3.5 16.5V19.5Z" fill="white"/>
              </Svg>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleSupport}>
              <Svg width="24" height="24" viewBox="0 0 25 24" fill="none">
                <Path fillRule="evenodd" clipRule="evenodd" d="M20.3 10.18C19.99 7.00002 18.11 2 12.3 2C6.49002 2 4.61001 7.00002 4.30002 10.18C3.21252 10.5927 2.4952 11.6368 2.50002 12.8V14.2C2.50002 15.7464 3.75365 17 5.30001 17C6.84642 17 8.10004 15.7464 8.10004 14.2V12.8C8.09498 11.6619 7.40404 10.6393 6.35001 10.21C6.55002 8.36998 7.53004 4.00002 12.3 4.00002C17.07 4.00002 18.04 8.36998 18.24 10.21C17.1882 10.6402 16.5007 11.6636 16.5 12.8V14.2C16.5022 14.7269 16.6524 15.2425 16.9335 15.6881C17.2147 16.1337 17.6154 16.4913 18.09 16.72C17.67 17.51 16.6 18.58 13.97 18.9C13.4443 18.1017 12.4272 17.787 11.5424 18.1489C10.6578 18.5108 10.1528 19.4481 10.3373 20.386C10.5218 21.3239 11.3442 22 12.3 22C12.6704 21.9979 13.0329 21.8931 13.3472 21.6971C13.6615 21.5011 13.9152 21.2217 14.08 20.89C18.37 20.4 19.74 18.19 20.17 16.89C21.3333 16.5132 22.1157 15.4227 22.1 14.2V12.8C22.1048 11.6368 21.3875 10.5927 20.3 10.18ZM6.10002 14.2C6.10002 14.6418 5.74185 15 5.30001 15C4.85816 15 4.50004 14.6419 4.50004 14.2V12.8C4.49923 12.6944 4.51933 12.5897 4.55917 12.492C4.59901 12.3942 4.65781 12.3053 4.73217 12.2304C4.80654 12.1554 4.895 12.0959 4.99247 12.0553C5.08993 12.0148 5.19446 11.9939 5.30003 11.9939C5.40561 11.9939 5.51014 12.0148 5.6076 12.0553C5.70506 12.0959 5.79352 12.1554 5.86789 12.2304C5.94226 12.3053 6.00105 12.3942 6.0409 12.492C6.08074 12.5897 6.10083 12.6944 6.10002 12.8V14.2ZM18.5 12.8C18.5 12.3582 18.8582 12 19.3 12C19.7419 12 20.1 12.3582 20.1 12.8V14.2C20.1 14.6418 19.7419 15 19.3 15C18.8581 15 18.5 14.6418 18.5 14.2V12.8Z" fill="white"/>
              </Svg>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentInsetAdjustmentBehavior="automatic">
        {loading ? (
          <View style={styles.bodyLoadingContainer}>
            <LoadingSpinner message="Fetching store details..." />
          </View>
        ) : (
          <>
        <View style={styles.thumbnailSection}>
          <TouchableOpacity
            style={styles.thumbnailContainer}
            onPress={showImagePicker}
            onLongPress={pickFromCamera}
            hitSlop={defaultHitSlop}
            accessibilityRole="imagebutton"
            accessibilityLabel="Change store image"
          >
            <View style={styles.thumbnailBackground}>
              {imageLoading ? (
                <View style={styles.thumbnailImageWrapper}>
                  <LoadingSpinner size="small" />
                </View>
              ) : selectedImage ? (
                <Image source={{ uri: selectedImage.uri }} style={styles.thumbnailImage} />
              ) : existingImageUrl ? (
                <Image source={{ uri: existingImageUrl }} style={styles.thumbnailImage} />
              ) : (
                <View style={styles.thumbnailPlaceholder}>
                  <Svg width="65" height="67" viewBox="0 0 65 67" fill="none">
                    <Path d="M55 20C60.5228 20 65 15.5228 65 10C65 4.47715 60.5228 0 55 0C49.4772 0 45 4.47715 45 10C45 15.5228 49.4772 20 55 20Z" fill="#06888C"/>
                    <Path d="M55 19.5C60.2467 19.5 64.5 15.2467 64.5 10C64.5 4.75329 60.2467 0.5 55 0.5C49.7533 0.5 45.5 4.75329 45.5 10C45.5 15.2467 49.7533 19.5 55 19.5Z" stroke="white"/>
                    <Path d="M58.542 14.166H51.458C51.182 14.1657 50.9174 14.056 50.7222 13.8608C50.527 13.6656 50.4173 13.401 50.417 13.125V8.125C50.417 7.84882 50.5266 7.58393 50.7218 7.38855C50.917 7.19317 51.1818 7.08327 51.458 7.083H52.868L53.378 6.063C53.4123 5.99353 53.4655 5.93512 53.5315 5.89445C53.5974 5.85378 53.6735 5.83249 53.751 5.833H56.251C56.3284 5.83283 56.4043 5.85427 56.4702 5.89491C56.5361 5.93554 56.5894 5.99375 56.624 6.063L57.133 7.083H58.542C58.8182 7.083 59.0831 7.19265 59.2784 7.38784C59.4738 7.58304 59.5837 7.84782 59.584 8.124V13.124C59.584 13.4004 59.4742 13.6654 59.2788 13.8608C59.0834 14.0562 58.8183 14.166 58.542 14.166ZM55.001 8.541C54.5887 8.54061 54.1856 8.66249 53.8426 8.89125C53.4997 9.12 53.2322 9.44534 53.0742 9.8261C52.9162 10.2069 52.8746 10.626 52.9548 11.0303C53.035 11.4347 53.2333 11.8063 53.5247 12.0979C53.816 12.3896 54.1874 12.5882 54.5917 12.6688C54.996 12.7494 55.4151 12.7082 55.796 12.5506C56.177 12.3929 56.5026 12.1258 56.7316 11.783C56.9607 11.4403 57.083 11.0373 57.083 10.625C57.0825 10.0728 56.863 9.54334 56.4727 9.15268C56.0824 8.76203 55.5532 8.54206 55.001 8.541Z" fill="white"/>
                    <Path fillRule="evenodd" clipRule="evenodd" d="M11.4997 19.1036C22.4783 17.4821 28.6676 17.4964 39.4997 19.1036C39.628 19.1232 39.7537 19.1567 39.8747 19.2036C43.1983 20.47 45.9605 22.8814 47.664 26.0036C49.089 28.5607 49.6069 31.1179 49.6069 32.5464C49.6069 38.1536 44.8926 42.575 39.2354 42.575C36.6104 42.575 34.1997 41.6286 32.3676 40.0607C30.4515 41.6907 28.0153 42.5813 25.4997 42.5714C22.8747 42.5714 20.464 41.625 18.6319 40.0571C16.7162 41.6884 14.2801 42.5803 11.764 42.5714C6.10686 42.5714 1.39258 38.1536 1.39258 32.5464C1.39258 31.1179 1.91044 28.5607 3.33544 26.0036C5.03805 22.882 7.79892 20.4707 11.1211 19.2036C11.2444 19.1562 11.3726 19.1227 11.5033 19.1036M8.48544 47.25C8.48544 46.658 8.25026 46.0902 7.83166 45.6716C7.41305 45.253 6.84529 45.0179 6.25329 45.0179C5.66129 45.0179 5.09354 45.253 4.67493 45.6716C4.25632 46.0902 4.02115 46.658 4.02115 47.25V56.7321C4.02115 59.2179 5.00838 61.602 6.76576 63.36C8.52314 65.1181 10.9068 66.1062 13.3926 66.1071H37.6069C40.0933 66.1071 42.4778 65.1194 44.236 63.3613C45.9941 61.6031 46.9819 59.2186 46.9819 56.7321V47.25C46.9819 46.658 46.7467 46.0902 46.3281 45.6716C45.9095 45.253 45.3417 45.0179 44.7497 45.0179C44.1577 45.0179 43.59 45.253 43.1714 45.6716C42.7528 46.0902 42.5176 46.658 42.5176 47.25V56.7321C42.5176 59.4464 40.3176 61.6429 37.6069 61.6429H32.9819V47.25C32.9819 46.658 32.7467 46.0902 32.3281 45.6716C31.9095 45.253 31.3417 45.0179 30.7497 45.0179C30.1577 45.0179 29.59 45.253 29.1714 45.6716C28.7527 46.0902 28.5176 46.658 28.5176 47.25V50.2679H8.48186L8.48544 47.25ZM8.48544 56.7321V54.7321H28.5212V61.6429H13.3926C10.6783 61.6429 8.48186 59.4429 8.48186 56.7321" fill="#06888C"/>
                  </Svg>
                </View>
              )}

              {/* Camera Icon Overlay */}
              <View style={styles.cameraIconContainer} pointerEvents="none">
                <View style={styles.cameraIconCircle}>
                  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <Path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <Path d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </Svg>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <Text style={styles.thumbnailText}>Store Thumbnail</Text>
          {imageError ? <Text style={{ color: '#FF4444', marginTop: 8 }}>{imageError}</Text> : null}
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Store Name</Text>
            <View style={[styles.inputContainer, errors.storeName ? styles.inputContainerError : null]}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter store's name"
                placeholderTextColor="#7C8BA0"
                value={storeName}
                onChangeText={(v) => { setStoreName(v); if (errors.storeName) setErrors(prev => ({ ...prev, storeName: null })); }}
                onBlur={() => handleBlur('storeName')}
                autoCapitalize="words"
                accessibilityLabel="Store name"
              />
            </View>
            {errors.storeName ? <Text style={styles.errorText}>{errors.storeName}</Text> : null}
          </View>

          <View style={[styles.inputGroup, { zIndex: 10 }]}>
            <Text style={styles.inputLabel}>Store Address</Text>
            <View style={[{ zIndex: 1 }]}> 
              <AddressAutocompleteEnhanced
                onAddressSelect={handleAddressSelect}
                onCreateAddress={async () => Promise.resolve()}
                placeholder="Enter store address"
                value={address}
                onValueChange={(v) => { setAddress(v); if (errors.address) setErrors(prev => ({ ...prev, address: null })); }}
                requireConfirmation
              />
            </View>
            {selectedAddress ? (
              <View style={styles.coordinatesInfo}>
                <Text style={styles.coordinatesText}>{selectedAddress.formattedAddress}
                  {selectedAddress ? `\n(${selectedAddress.latitude.toFixed(5)}, ${selectedAddress.longitude.toFixed(5)})` : ''}
                </Text>
              </View>
            ) : null}
            {errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Store Phone number</Text>
            <View style={[styles.inputContainer, styles.inputContainerReadonly]}>
              <TextInput
                style={[styles.textInput, styles.textInputReadonly]}
                value={phoneNumber}
                editable={false}
                keyboardType="phone-pad"
                placeholderTextColor="#7C8BA0"
                accessibilityLabel="Store phone number"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={[styles.inputContainer, errors.email ? styles.inputContainerError : null]}>
              <TextInput
                style={[styles.textInput, styles.filledInput]}
                value={email}
                onChangeText={(v) => { setEmail(v); if (errors.email) setErrors(prev => ({ ...prev, email: null })); }}
                onBlur={() => handleBlur('email')}
                keyboardType="email-address"
                autoCapitalize="none"
                accessibilityLabel="Store email"
              />
            </View>
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <View style={[styles.inputContainer, errors.description ? styles.inputContainerError : null]}>
              <TextInput
                style={[styles.textInput, { height: 120 }]}
                value={description}
                onChangeText={(v) => { setDescription(v); if (errors.description) setErrors(prev => ({ ...prev, description: null })); }}
                onBlur={() => handleBlur('description')}
                multiline
                placeholderTextColor="#7C8BA0"
                accessibilityLabel="Store description"
              />
            </View>
            {errors.description ? <Text style={styles.errorText}>{errors.description}</Text> : null}
          </View>
        </View>

        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveChanges}
            disabled={saving || imageLoading}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Save changes"
          >
            <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
          </TouchableOpacity>
        </View>

          </>
        )}
        {(saving || imageLoading) && <LoadingSpinner overlay message={saving ? 'Saving store...' : 'Processing image...'} />}
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
  bodyLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    minHeight: 200,
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
    position: 'relative',
  },
  thumbnailImage: {
    width: 85,
    height: 85,
    borderRadius: 16,
  },
  thumbnailImageWrapper: {
    width: 85,
    height: 85,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailPlaceholder: {
    width: 85,
    height: 85,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 2.5,
    paddingBottom: 18,
    paddingLeft: 18,
  },
  cameraIconContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
    zIndex: 10,
  },
  cameraIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#06888C',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  thumbnailOverlayContainer: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    right: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#06888C',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 12,
    opacity: 0.95,
  },
  changeText: {
    color: '#FFF',
    fontSize: 12,
    marginLeft: 6,
    fontFamily: 'Open Sans',
    fontWeight: '600',
  },
  removeButton: {
    backgroundColor: 'rgba(255,68,68,0.9)',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  removeText: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Open Sans',
    fontWeight: '600',
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
  inputContainerError: {
    borderColor: '#FF4444',
  },
  inputContainerReadonly: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
  },
  textInputReadonly: {
    color: '#9E9E9E',
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
  errorText: {
    color: '#FF4444',
    marginTop: 6,
    fontSize: 12,
    fontFamily: 'Open Sans',
  },
});
