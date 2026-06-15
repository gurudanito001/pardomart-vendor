import { CreateVendorPayload, GeneralApi } from '@/api';
import { apiConfig } from '@/api/config';
import toast from '@/utils/toast';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Path, Svg } from 'react-native-svg';
import AddressAutocompleteEnhanced from '../../../components/AddressAutocompleteEnhanced';
import PhoneInputWithCountry from '../../../components/PhoneInputWithCountry';
import Accordion from '../../../components/ui/Accordion';
import { Input } from '../../../components/ui/Input';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import OpeningHoursInput from '../../../components/ui/OpeningHoursInput';
import { useVendors } from '../../../hooks/api/useVendors';
import { useImagePicker } from '../../../hooks/useImagePicker';
import { GooglePlacesSuggestion } from '../../../utils/googleMapsLocation';

export default function AddStoreScreen() {
  const [name, setName] = useState('');
  const [addressSearch, setAddressSearch] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [availableForShopping, setAvailableForShopping] = useState(true);
  const [isPublished, setIsPublished] = useState(false);
  const [timezone, setTimezone] = useState('');
  const [isTimezoneModalVisible, setIsTimezoneModalVisible] = useState(false);

  type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  interface VendorOpeningHoursState {
    day: DayOfWeek;
    label: string;
    open: string;
    close: string;
    isClosed: boolean;
  }
  const daysOfWeek: { day: DayOfWeek; label: string }[] = [
    { day: 'MONDAY', label: 'Monday' }, { day: 'TUESDAY', label: 'Tuesday' }, { day: 'WEDNESDAY', label: 'Wednesday' },
    { day: 'THURSDAY', label: 'Thursday' }, { day: 'FRIDAY', label: 'Friday' }, { day: 'SATURDAY', label: 'Saturday' },
    { day: 'SUNDAY', label: 'Sunday' },
  ];
  const [openingHours, setOpeningHours] = useState<VendorOpeningHoursState[]>(
    () => daysOfWeek.map(d => ({ day: d.day, label: d.label, open: '09:00', close: '21:00', isClosed: false }))
  );
  const [tagline, setTagline] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { createVendor } = useVendors();
  const generalApi = useMemo(() => new GeneralApi(apiConfig), []);

  // Fetch timezones
  const { data: timezones } = useQuery({
    queryKey: ['timezones'],
    queryFn: async () => {
      const res = await generalApi.authTimeZonesGet();
      return res.data.data as string[] || [];
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const {
    selectedImage,
    isLoading: imageLoading,
    error: imageError,
    pickFromGallery,
    clearImage,
  } = useImagePicker({ base64: true, maxSize: 1 * 1024 * 1024 });

  useEffect(() => {
    if (imageError) {
      if (imageError.includes('Size exceeds')) {
        toast.error('The image should not exceed 1MB in size');
      } else {
        toast.error(imageError);
      }
    }
  }, [imageError]);

  // Auto-detect device timezone on mount
  useEffect(() => {
    try {
      const deviceTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setTimezone(deviceTimezone);
    } catch (e) {
      console.error('Failed to detect device timezone', e);
    }
  }, []);

  const handleOpeningHoursChange = useCallback((dayLabel: string, open: string, close: string, isClosed: boolean) => {
    setOpeningHours(prevHours =>
      prevHours.map(oh =>
        oh.label === dayLabel && (oh.open !== open || oh.close !== close || oh.isClosed !== isClosed)
          ? { ...oh, open, close, isClosed }
          : oh
      )
    );
  }, []);

  const validateOpeningHours = (): boolean => {
    return openingHours.every(oh => oh.isClosed || (oh.open && oh.close && oh.open < oh.close));
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleNotifications = () => {
    console.log('Open notifications');
  };

  const handleSupport = () => {
    console.log('Open support');
  };

  const handleAddStore = async () => {

    if (!name.trim()) {
      toast.error('Store name is required');
      return;
    }
    if (!validateOpeningHours()) {
      toast.error('Please ensure all opening hours are valid (Open time before Close time).');
      return;
    }


    setSubmitting(true);

    try {
      const payload: CreateVendorPayload = {
        name: name.trim(),
        email: email.trim(),
        mobileNumber: mobileNumber.trim(),
        availableForShopping: availableForShopping,
        tagline: tagline.trim(),
        details: details.trim(),
        address: storeAddress,
        latitude: latitude === null ? undefined : latitude,
        longitude: longitude === null ? undefined : longitude,
        image: selectedImage?.base64,
        openingHours: openingHours.map(oh => ({
          day: oh.day,
          open: oh.isClosed ? null : oh.open,
          close: oh.isClosed ? null : oh.close,
          // id, vendorId, createdAt, updatedAt will be handled by the backend
        })),
        ...({ isPublished, timezone } as any),
      };
      console.log('Prepared vendor payload', payload);
      const newVendor = await createVendor(payload);
      toast.success('Store created successfully!');
      if (newVendor?.id) {
        router.push(`/(private)/store/upload-documents?storeId=${newVendor.id}` as any);
      } else {
        router.push('/(private)/store' as any);
      }
    } catch (err: any) {
      console.error('Failed to create vendor', err);
      toast.error(err?.message || 'Failed to create store');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddressSelect = (suggestion: GooglePlacesSuggestion) => {
    // Set both the visible selected address and the search input so the
    // AddressAutocompleteEnhanced (controlled) reflects the cleared value.
    console.log('Selected address suggestion:', suggestion);
    setStoreAddress(suggestion.displayName);
    setLatitude(suggestion.latitude ?? null);
    setLongitude(suggestion.longitude ?? null);
    // Keep the selected address visible in the input (UX choice requested).
    setAddressSearch(suggestion.displayName);
  };

  const handleAddressChange = (text: string) => {
    // Keep the controlled value in sync with the autocomplete component.
    setAddressSearch(text);

    // If the user clears the search text, clear any selected address and coords
    if (!text.trim()) {
      setStoreAddress('');
      setLatitude(null);
      setLongitude(null);
    }
  };

  const clearSelectedAddress = () => {
    // Clear both the visible selected address and the input field.
    setStoreAddress('');
    setAddressSearch('');
    setLatitude(null);
    setLongitude(null);
  }

  // you can uncomment the effect below to debug address changes during development
  /* useEffect(() =>{
    console.log('Address changed:', storeAddress);
  }, [storeAddress]); */

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#06888C' }]} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <StatusBar barStyle="light-content" backgroundColor="#06888C" />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.leftSection}>
              <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                {/* Back Arrow Icon */}
                <Svg width="31" height="30" viewBox="0 0 31 30" fill="none">
                  <Path d="M20.1278 21.993C20.3661 22.2135 20.5 22.5125 20.5 22.8243C20.5 23.1361 20.3661 23.4352 20.1278 23.6556C19.8895 23.8761 19.5662 24 19.2292 24C18.8921 24 18.5689 23.8761 18.3306 23.6556L9.87313 15.8313C9.75486 15.7223 9.66102 15.5927 9.59699 15.4501C9.53296 15.3074 9.5 15.1545 9.5 15C9.5 14.8455 9.53296 14.6926 9.59699 14.5499C9.66102 14.4073 9.75486 14.2777 9.87313 14.1687L18.3306 6.34435C18.5689 6.12387 18.8921 6 19.2292 6C19.5662 6 19.8895 6.12387 20.1278 6.34435C20.3661 6.56483 20.5 6.86387 20.5 7.17568C20.5 7.48749 20.3661 7.78653 20.1278 8.00702L12.57 14.999L20.1278 21.993Z" fill="white" />
                </Svg>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Add Store</Text>
            </View>
            <View style={styles.rightSection}>
              <TouchableOpacity style={styles.iconButton} onPress={handleNotifications}>
                {/* Notification Bell Icon */}
                <Svg width="24" height="24" viewBox="0 0 25 24" fill="none">
                  <Path d="M9.145 20.5C9.36103 21.2219 9.80417 21.8549 10.4086 22.3049C11.013 22.755 11.7464 22.998 12.5 22.998C13.2536 22.998 13.987 22.755 14.5914 22.3049C15.1958 21.8549 15.639 21.2219 15.855 20.5H9.145ZM3.5 19.5H21.5V16.5L19.5 13.5V8.5C19.5 7.58075 19.3189 6.6705 18.9672 5.82122C18.6154 4.97194 18.0998 4.20026 17.4497 3.55025C16.7997 2.90024 16.0281 2.38463 15.1788 2.03284C14.3295 1.68106 13.4193 1.5 12.5 1.5C11.5807 1.5 10.6705 1.68106 9.82122 2.03284C8.97194 2.38463 8.20026 2.90024 7.55025 3.55025C6.90024 4.20026 6.38463 4.97194 6.03284 5.82122C5.68106 6.6705 5.5 7.58075 5.5 8.5V13.5L3.5 16.5V19.5Z" fill="white" />
                </Svg>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            {/* Page Title Section */}
            <View style={styles.titleSection}>
              <Text style={styles.subtitle}>
                Provide all the information of your stores here
              </Text>
            </View>

            {/* Form Fields */}
            <View style={styles.formContainer}>
              {/* Image upload - zIndex 6 */}
              <View style={[styles.fieldContainer, { zIndex: 6 }]}>
                <Text style={styles.fieldLabel}>Store Image</Text>
                <View style={styles.imageWrapper}>
                  <TouchableOpacity style={styles.imagePicker} onPress={pickFromGallery} activeOpacity={0.8}>
                    {selectedImage ? (
                      <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
                    ) : (
                      <Text style={styles.imagePlaceholderText}>Upload image</Text>
                    )}

                    {selectedImage ? (
                      <TouchableOpacity style={styles.clearOverlay} onPress={clearImage}>
                        <Text style={styles.clearOverlayText}>Clear</Text>
                      </TouchableOpacity>
                    ) : null}
                  </TouchableOpacity>
                </View>
                {imageError ? <Text style={styles.errorText}>{imageError}</Text> : null}
              </View>

              {/* Store Name - zIndex 5 */}
              <View style={[styles.fieldContainer, { zIndex: 5 }]}>
                <Text style={styles.fieldLabel}>Store Name</Text>
                <Input
                  placeholder="Enter store's name"
                  value={name}
                  onChangeText={setName}
                  variant="default"
                  inputStyle={styles.inputText}
                  size="large"
                  containerStyle={styles.inputContainer}
                />
              </View>

              {/* Store Address - zIndex 4 */}
              <View style={[styles.fieldContainer, { zIndex: 4 }]}>
                <Text style={styles.fieldLabel}>Store Address</Text>
                <AddressAutocompleteEnhanced
                  placeholder="Search for store address"
                  value={addressSearch}
                  onValueChange={handleAddressChange}
                  onAddressSelect={handleAddressSelect}
                  requireConfirmation={true}
                  selectedAddress={storeAddress}
                  onClearSelection={clearSelectedAddress}
                />
              </View>

              {/* Store Email - zIndex 3 */}
              <View style={[styles.fieldContainer, { zIndex: 3 }]}>
                <Text style={styles.fieldLabel}>Store Email</Text>
                <Input
                  placeholder="Enter store's email address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  inputStyle={styles.inputText}
                  variant="default"
                  size="large"
                  containerStyle={styles.inputContainer}
                />
              </View>

              {/* Store Mobile Number - zIndex 3 */}
              <View style={[styles.fieldContainer, { zIndex: 3 }]}>
                <Text style={styles.fieldLabel}>Store Mobile Number</Text>
                <PhoneInputWithCountry
                  placeholder="Enter store's mobile number"
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                />
              </View>

              {/* Store Tagline - zIndex 2 */}
              <View style={[styles.fieldContainer, { zIndex: 2 }]}>
                <Text style={styles.fieldLabel}>Store Tagline</Text>
                <Input
                  placeholder="e.g., Fresh and Local"
                  value={tagline}
                  onChangeText={setTagline}
                  inputStyle={styles.inputText}
                  variant="default"
                  size="large"
                  containerStyle={styles.inputContainer}
                />
              </View>

              {/* Store Details - zIndex 1 */}
              <View style={[styles.fieldContainer, { zIndex: 1 }]}>
                <Text style={styles.fieldLabel}>Store Details</Text>
                <Input
                  placeholder="Describe your store"
                  value={details}
                  onChangeText={setDetails}
                  variant="default"
                  size="large"
                  containerStyle={styles.inputContainer}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                  inputStyle={{ ...styles.inputText, height: 100, paddingTop: 16 }}
                />
              </View>

              {/* Store Timezone */}
              <View style={[styles.fieldContainer, { zIndex: 1 }]}>
                <Text style={styles.fieldLabel}>Store Time Zone</Text>
                <TouchableOpacity 
                  style={styles.dropdownContainer} 
                  onPress={() => setIsTimezoneModalVisible(true)}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Text style={{ fontSize: 14, color: timezone ? '#000' : '#7C8BA0', fontFamily: 'Open Sans' }}>
                      {timezone || 'Select Time Zone'}
                    </Text>
                    <Svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <Path d="M1 1.5L6 6.5L11 1.5" stroke="#484C52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  </View>
                </TouchableOpacity>
              </View>


                {/* Vendor Opening Times */}
              <Accordion title="Vendor Opening Times">
                {openingHours.map((oh) => (
                  <OpeningHoursInput
                    key={oh.day}
                    dayLabel={oh.label}
                    initialOpenTime={oh.open}
                    initialCloseTime={oh.close}
                    initialIsClosed={oh.isClosed}
                    onTimeChange={handleOpeningHoursChange}
                  />
                ))}
              </Accordion>

              {/* Available For Shopping - zIndex 1 */}
              <View style={[styles.fieldContainer, styles.switchContainer, { zIndex: 1 }]}>
                <Text style={styles.fieldLabel}>Available for Shopping</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#06888C" }}
                  thumbColor={availableForShopping ? "#f4f3f4" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={setAvailableForShopping}
                  value={availableForShopping}
                />
              </View>

              {/* Publish Store - zIndex 1 */}
              <View style={[styles.fieldContainer, styles.switchContainer, { zIndex: 1 }]}>
                <Text style={styles.fieldLabel}>Publish Store</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#06888C" }}
                  thumbColor={isPublished ? "#f4f3f4" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={setIsPublished}
                  value={isPublished}
                />
              </View>
            </View>


            {/* Add Store Button */}
            <TouchableOpacity style={styles.addStoreButton} onPress={handleAddStore} disabled={submitting}>
              <Text style={styles.addStoreButtonText}>Add Store</Text>
            </TouchableOpacity>

            {(submitting || imageLoading) && <LoadingSpinner overlay message={submitting ? 'Saving store...' : 'Processing image...'} />}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Timezone Select Modal */}
      <Modal 
        transparent 
        visible={isTimezoneModalVisible} 
        animationType="fade" 
        onRequestClose={() => setIsTimezoneModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setIsTimezoneModalVisible(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Select Time Zone</Text>
            <ScrollView style={{ maxHeight: 400 }}>
              {timezones?.map((tz) => (
                <TouchableOpacity
                  key={tz}
                  style={[styles.optionItem, timezone === tz && styles.selectedOption]}
                  onPress={() => {
                    setTimezone(tz);
                    setIsTimezoneModalVisible(false);
                  }}
                >
                  <Text style={[styles.optionText, timezone === tz && styles.selectedOptionText]}>
                    {tz}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: 0,
  },
  inputText: {
    fontSize: 14,
    fontFamily: 'Open Sans',
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
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 25,
  },
  imageWrapper: {
    marginBottom: 12,
  },
  imagePicker: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: '#7C8BA0',
  },
  clearOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(6, 136, 140, 0.15)',
  },
  clearOverlayText: {
    color: '#06888C',
    fontWeight: '700',
    fontFamily: 'Raleway',
    fontSize: 12,
  },
  errorText: {
    color: '#FF4D4F',
    marginTop: 8,
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'Raleway',
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    borderRadius: 8,
    marginVertical: 2,
  },
  optionText: {
    fontSize: 14,
    color: '#111827',
    fontFamily: 'Open Sans',
  },
  selectedOption: {
    backgroundColor: '#06888C',
  },
  selectedOptionText: {
    color: '#FFF',
    fontWeight: '600',
  },
});
