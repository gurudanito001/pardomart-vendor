import { useAuth } from '@/context/AppProvider';
import { vendorService } from '@/services/vendor';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { toast } from 'sonner-native';

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  editable?: boolean;
  error?: string;
  showEditIcon?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChangeText,
  editable = true,
  error,
  showEditIcon = true,
}) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={[styles.inputContainer, error && styles.inputError, !editable && { backgroundColor: '#F6F7FB' }]}>
      <TextInput
        style={[styles.textInput, !editable && { color: '#7C7B7B' }]}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        placeholder={`Enter ${label.toLowerCase()}`}
        placeholderTextColor="#B4BED4"
      />
      {editable && showEditIcon && (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <Path d="M12 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V12" stroke="#707070" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <Path d="M18.3751 2.62498C18.7729 2.22716 19.3125 2.00366 19.8751 2.00366C20.4377 2.00366 20.9773 2.22716 21.3751 2.62498C21.7729 3.02281 21.9964 3.56237 21.9964 4.12498C21.9964 4.68759 21.7729 5.22716 21.3751 5.62498L12.3621 14.639C12.1246 14.8762 11.8313 15.0499 11.5091 15.144L8.63609 15.984C8.55005 16.0091 8.45883 16.0106 8.372 15.9883C8.28517 15.9661 8.20592 15.9209 8.14254 15.8575C8.07916 15.7942 8.03398 15.7149 8.01174 15.6281C7.98949 15.5412 7.991 15.45 8.01609 15.364L8.85609 12.491C8.95062 12.169 9.12463 11.876 9.36209 11.639L18.3751 2.62498Z" stroke="#707070" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </Svg>
      )}
    </View>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const EditProfile = () => {
  const router = useRouter();
  const { state, updateUser } = useAuth();
  const showError = React.useCallback((m: string) => toast.error(m), []);
  const showSuccess = React.useCallback((m: string) => toast.success(m), []);
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState<{
    fullName?: string;
  }>({});

  // Initialize form with current user data
  useEffect(() => {
    if (state.user) {
      setFullName(state.user.name || '');
      setEmail(state.user.email || '');
      setPhoneNumber(state.user.mobileNumber || '');
    }
  }, [state.user]);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGoBack = () => router.back();
  //const handleNotifications = () => router.push('/shared/notifications');

  const handleCameraPress = () => {
    Alert.alert('Change Profile Photo', 'Select an option', [
      { text: 'Camera', onPress: () => console.log('Camera selected') },
      { text: 'Gallery', onPress: () => console.log('Gallery selected') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) return;

    setIsUpdating(true);
    try {
      // Assuming the vendor profile update can include the user's name
      const response = await vendorService.updateProfile({ businessName: fullName.trim() });

      // Update the user in the global AuthContext state
      updateUser({
        ...state.user!,
        name: response.data.businessName, // Use the name from the response
      });

      showSuccess('Profile updated successfully!');
      router.back();
    } catch (error: any) {
      const errorMessage = error?.error?.message || 'Failed to update profile.';
      showError(errorMessage);
      console.error('Update profile failed on component level:', error);
    }
  };

  if (!state.user) {
    return (
      <SafeAreaView style={styles.container} edges={['top','left','right']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F48022" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top','left','right']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.backButton} onPress={handleGoBack}>
            <Svg width="11" height="18" viewBox="0 0 11 18" fill="none">
              <Path d="M10.6278 15.993C10.8661 16.2135 11 16.5125 11 16.8243C11 17.1361 10.8661 17.4352 10.6278 17.6556C10.3895 17.8761 10.0662 18 9.72918 18C9.39214 18 9.0689 17.8761 8.83058 17.6556L0.373128 9.83133C0.254859 9.7223 0.161019 9.59274 0.0969895 9.45008C0.0329598 9.30742 0 9.15447 0 9C0 8.84553 0.0329598 8.69258 0.0969895 8.54992C0.161019 8.40726 0.254859 8.2777 0.373128 8.16866L8.83058 0.344349C9.0689 0.123866 9.39214 -4.64634e-09 9.72918 0C10.0662 4.64634e-09 10.3895 0.123866 10.6278 0.34435C10.8661 0.564833 11 0.863872 11 1.17568C11 1.48749 10.8661 1.78653 10.6278 2.00702L3.07 8.99902L10.6278 15.993Z" fill="#100A37"/>
            </Svg>
          </Pressable>
          <Text style={styles.headerTitle}>Account</Text>
        </View>
        {/* <Pressable style={styles.notificationButton} onPress={handleNotifications}>
          <Svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <Circle cx="20" cy="20" r="19.5" stroke="#B4BED4"/>
            <Path fillRule="evenodd" clipRule="evenodd" d="M13.777 16.4179C13.777 14.7158 14.4532 13.0833 15.6567 11.8798C16.8603 10.6762 18.4928 10 20.1949 10C21.897 10 23.5294 10.6762 24.733 11.8798C25.9366 13.0833 26.6128 14.7158 26.6128 16.4179V19.8689L28.2833 23.2099C28.3602 23.3636 28.3965 23.5345 28.3888 23.7063C28.381 23.878 28.3295 24.045 28.2391 24.1912C28.1487 24.3374 28.0225 24.4582 27.8723 24.5419C27.7221 24.6256 27.553 24.6695 27.3811 24.6695H23.7467C23.5428 25.4564 23.0833 26.1532 22.4405 26.6507C21.7976 27.1482 21.0078 27.4181 20.1949 27.4181C19.382 27.4181 18.5922 27.1482 17.9493 26.6507C17.3064 26.1532 16.847 25.4564 16.643 24.6695H13.0087C12.8367 24.6695 12.6677 24.6256 12.5175 24.5419C12.3673 24.4582 12.241 24.3374 12.1506 24.1912C12.0603 24.045 12.0087 23.878 12.001 23.7063C11.9933 23.5345 12.0296 23.3636 12.1065 23.2099L13.777 19.8689V16.4179ZM18.6069 24.6695C18.7679 24.9482 18.9993 25.1797 19.2781 25.3406C19.5568 25.5015 19.873 25.5862 20.1949 25.5862C20.5168 25.5862 20.8329 25.5015 21.1117 25.3406C21.3904 25.1797 21.6219 24.9482 21.7829 24.6695H18.6069ZM20.1949 11.8337C18.9791 11.8337 17.8131 12.3167 16.9534 13.1764C16.0937 14.0361 15.6107 15.2021 15.6107 16.4179V19.8689C15.6107 20.1534 15.5444 20.434 15.4172 20.6885L14.3445 22.8358H26.0462L24.9735 20.6885C24.8459 20.4341 24.7794 20.1535 24.7791 19.8689V16.4179C24.7791 15.2021 24.2961 14.0361 23.4364 13.1764C22.5767 12.3167 21.4107 11.8337 20.1949 11.8337Z" fill="black"/>
          </Svg>
        </Pressable> */}
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profilePhotoSection}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Image // This is the Image component from expo-image
                source={require("../../../assets/images/user profile.png")}
                style={styles.profileImage}
                contentFit="contain"
              />
            </View>
            <Pressable style={styles.cameraButton} onPress={handleCameraPress}>
              <Ionicons name="camera-outline" size={12} color="#FFF" />
            </Pressable>
          </View>
        </View>

        <View style={styles.formContainer}>
          <FormField label="Full Name" value={fullName} onChangeText={setFullName} error={errors.fullName} />
          <FormField label="Email" value={email} onChangeText={() => {}} editable={false} showEditIcon={false} />
          <FormField label="Phone Number" value={phoneNumber} onChangeText={() => {}} editable={false} showEditIcon={false} />
        </View>

        <Pressable 
          style={[styles.saveButton, isUpdating && styles.saveButtonDisabled]} 
          onPress={handleSaveChanges}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 21,
    paddingTop: 20,
    backgroundColor: '#FFF',
  },
  headerLeft: {
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
    fontFamily: 'Raleway-Bold',
    color: '#000',
  },
  notificationButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profilePhotoSection: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: '#FFF',
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 85,
    height: 80,
    borderRadius: 42.5,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cameraButton: {
    position: 'absolute',
    top: 4,
    right: -1,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    paddingHorizontal: 25,
    gap: 20,
    marginBottom: 24,
  },
  fieldContainer: {
    gap: 10,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway-Bold',
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 24,
    paddingRight: 22,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#FFF',
    height: 48,
  },
  inputError: {
    borderColor: '#FF6B6B',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'OpenSans-Regular',
    color: '#484C52',
    paddingVertical: 0,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    marginTop: 4,
  },
  saveButton: {
    marginHorizontal: 21,
    paddingVertical: 14,
    paddingHorizontal: 120,
    borderRadius: 16,
    backgroundColor: '#F48022',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 9,
    elevation: 2,
    height: 53,
  },
  saveButtonDisabled: {
    backgroundColor: '#B4BED4',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway-Bold',
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 25,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#484C52',
    fontFamily: 'OpenSans-Regular',
  },
});


export default EditProfile;