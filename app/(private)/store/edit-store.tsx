import { UpdateVendorPayload } from '@/api';
import AddressAutocompleteEnhanced from '@/components/AddressAutocompleteEnhanced';
import PhoneInputWithCountry from '@/components/PhoneInputWithCountry';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useVendor } from '@/hooks/api/useVendors';
import { useImagePicker } from '@/hooks/useImagePicker';
import { Country, getCountries } from '@/utils/countries';
import { GooglePlacesSuggestion } from '@/utils/googleMapsLocation';
import { toast } from '@/utils/toast';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Path, Svg } from 'react-native-svg';

export default function EditStoreScreen() {
  const { storeId } = useLocalSearchParams<{ storeId: string }>();
  const { getVendorById, updateVendor } = useVendor();

  // Data fetching
  const { data: vendor, isLoading: isLoadingVendor, refetch } = useQuery({
    queryKey: ['vendor', storeId],
    queryFn: () => getVendorById(storeId!),
    enabled: !!storeId,
  });

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [initialCountry, setInitialCountry] = useState<Country | undefined>();
  const [availableForShopping, setAvailableForShopping] = useState(true);
  const [isPublished, setIsPublished] = useState(false);
  const [tagline, setTagline] = useState('');
  const [details, setDetails] = useState('');
  const [addressSearch, setAddressSearch] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const {
    selectedImage,
    isLoading: imageLoading,
    error: imageError,
    pickFromGallery,
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

  // Populate form with fetched data
  useEffect(() => {
    if (vendor) {
      setName(vendor.name || '');
      setEmail(vendor.email || '');
      setMobileNumber(vendor.mobileNumber || '');
      
      if (vendor.mobileNumber) {
        getCountries().then((countries) => {
          const clean = vendor.mobileNumber!.replace(/[^0-9+]/g, '');
          const sorted = [...countries].sort((a, b) => b.dialCode.length - a.dialCode.length);
          const match = sorted.find((c) => clean.startsWith(c.dialCode));
          if (match) setInitialCountry(match);
        });
      }

      setAvailableForShopping(vendor.availableForShopping ?? true);
      setIsPublished((vendor as any).isPublished ?? false);
      setTagline(vendor.tagline || '');
      setDetails(vendor.details || '');
      setStoreAddress(vendor.address || '');
      setAddressSearch(vendor.address || '');
      setLatitude(vendor.latitude || null); 
      setLongitude(vendor.longitude || null);
    }
  }, [vendor]);

  const handleBack = () => {
    router.back();
  };

  const handleSaveChanges = async () => {
    
    if (!name.trim()) {
      toast.error('Store name is required');
      return;
    }
    if (!storeId) {
      toast.error('Store ID is missing. Cannot update.');
      return;
    }

    setSubmitting(true);

    try {
      const payload: Partial<UpdateVendorPayload> = {
        name,
        email,
        mobileNumber,
        availableForShopping,
        tagline,
        details,
        address: storeAddress,
        latitude: latitude === null ? undefined : latitude,
        longitude: longitude === null ? undefined : longitude,
        ...({ isPublished } as any),
      };

      // Only include the image if a new one was selected
      if (selectedImage?.base64) {
        payload.image = selectedImage.base64;
      }
      console.log('Prepared vendor payload', payload);
      await updateVendor(storeId, payload);
      toast.success('Store updated successfully!');
      router.back();
    } catch (err: any) {
      console.error('Failed to update vendor', err);
      // Check if the API returned a specific error message, otherwise fallback to the generic one
      const errorMessage = err.response?.data?.error || err.message || 'Failed to update store';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddressSelect = (suggestion: GooglePlacesSuggestion) => {
    setStoreAddress(suggestion.displayName);
    setLatitude(suggestion.latitude ?? null);
    setLongitude(suggestion.longitude ?? null);
    setAddressSearch(suggestion.displayName);
  };

  const handleAddressChange = (text: string) => {
    setAddressSearch(text);
    if (!text.trim()) {
      setStoreAddress('');
      setLatitude(null);
      setLongitude(null);
    }
  };

  const clearSelectedAddress = () => {
    setStoreAddress('');
    setAddressSearch('');
    setLatitude(null);
    setLongitude(null);
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Refresh failed', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#06888C' }]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#06888C" />
      
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
            <Text style={styles.headerTitle}>Edit Store Profile</Text>
          </View>
        </View>
      </View>

      {isLoadingVendor ? (
        <View style={[styles.centerContent, { backgroundColor: '#FFF' }]}>
          <ActivityIndicator size="large" color="#06888C" />
          <Text style={styles.loadingText}>Loading Store Details...</Text>
        </View>
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            style={[styles.scrollView, { backgroundColor: '#FFF' }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#06888C']}
                tintColor="#06888C"
              />
            }
          >
            <View style={styles.formSection}>
              {/* Avatar Image upload */}
              <View style={styles.avatarSection}>
                <TouchableOpacity onPress={pickFromGallery} activeOpacity={0.8}>
                  <View style={styles.avatarContainer}>
                  {selectedImage?.uri ? (
                      <Image source={{ uri: selectedImage.uri }} style={styles.avatarImage} />
                  ) : vendor?.image ? (
                      <Image source={{ uri: vendor.image }} style={styles.avatarImage} />
                  ) : (
                    <Svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                      <Path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.5L14.5 12L19 18H5L8.5 13.5Z" fill="#B4BED4"/>
                    </Svg>
                  )}
                    <View style={styles.editIconContainer}>
                      <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <Path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="white"/>
                      </Svg>
                    </View>
                  </View>
                </TouchableOpacity>
                {imageError && <Text style={styles.errorText}>{imageError}</Text>}
              </View>

              {/* Store Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Store Name</Text>
                <Input placeholder="Enter store's name" value={name} onChangeText={setName} />
              </View>

              {/* Store Address */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Store Address</Text>
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

              {/* Store Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Store Email</Text>
                <Input
                  placeholder="Enter store's email address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
              </View>

              {/* Store Mobile Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Store Mobile Number</Text>
                <PhoneInputWithCountry
                  placeholder="Enter store's mobile number"
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                />
              </View>

              {/* Store Tagline */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Store Tagline</Text>
                <Input placeholder="e.g., Fresh and Local" value={tagline} onChangeText={setTagline} />
              </View>

              {/* Store Details */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Store Details</Text>
                <Input
                  placeholder="Describe your store"
                  value={details}
                  onChangeText={setDetails}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  inputStyle={{ height: 100, paddingTop: 16 }}
                />
              </View>

              {/* Available For Shopping */}
              <View style={[styles.inputGroup, styles.switchContainer]}>
                <Text style={styles.inputLabel}>Available for Shopping</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#06888C" }}
                  thumbColor={availableForShopping ? "#f4f3f4" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={setAvailableForShopping}
                  value={availableForShopping}
                />
              </View>

              {/* Publish Store */}
              <View style={[styles.inputGroup, styles.switchContainer]}>
                <Text style={styles.inputLabel}>Publish Store</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#06888C" }}
                  thumbColor={isPublished ? "#f4f3f4" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={setIsPublished}
                  value={isPublished}
                />
              </View>
            </View>

            {/* Save Button */}
            <View style={styles.buttonSection}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges} disabled={submitting}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      {(submitting || imageLoading) && (
        <LoadingSpinner overlay message={submitting ? 'Saving changes...' : 'Processing image...'} />
      )}
    </SafeAreaView>
  ); 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 16,
    color: '#484C52',
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
  formSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 21,
    paddingBottom: 37,
  },
  inputGroup: {
    gap: 9,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#000',
  },
  inputContainer: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#FFF',
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
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
    lineHeight: 25,
    textAlign: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 10,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#06888C',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F8F8',
    position: 'relative',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  editIconContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#06888C',
    padding: 8,
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 20,
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(6, 136, 140, 0.15)',
  },
  clearOverlayText: {
    color: '#06888C',
    fontWeight: '700',
    fontSize: 12,
  },
  errorText: {
    color: '#FF4D4F',
    marginTop: 8,
    fontSize: 12,
  },
});
