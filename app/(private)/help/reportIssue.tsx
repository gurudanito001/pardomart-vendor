import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { apiConfig } from '../../../api/config';
import { BugReportApi, BugReportsPostCategoryEnum } from '../../../api/endpoints/bug-report-api';
import { toast } from '../../../utils/toast';


// Custom Icons matching Figma
const CameraIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 25 25" fill="none">
    <Path
      d="M15 4.5H10L7.5 7.5H4.5C3.96957 7.5 3.46086 7.71071 3.08579 8.08579C2.71071 8.46086 2.5 8.96957 2.5 9.5V18.5C2.5 19.0304 2.71071 19.5391 3.08579 19.9142C3.46086 20.2893 3.96957 20.5 4.5 20.5H20.5C21.0304 20.5 21.5391 20.2893 21.9142 19.9142C22.2893 19.5391 22.5 19.0304 22.5 18.5V9.5C22.5 8.96957 22.2893 8.46086 21.9142 8.08579C21.5391 7.71071 21.0304 7.5 20.5 7.5H17.5L15 4.5Z"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12.5 16.5C14.1569 16.5 15.5 15.1569 15.5 13.5C15.5 11.8431 14.1569 10.5 12.5 10.5C10.8431 10.5 9.5 11.8431 9.5 13.5C9.5 15.1569 10.8431 16.5 12.5 16.5Z"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const GalleryIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 25" fill="none">
    <Path
      d="M2 12.5C2 7.786 2 5.429 3.464 3.964C4.93 2.5 7.286 2.5 12 2.5C16.714 2.5 19.071 2.5 20.535 3.964C22 5.43 22 7.786 22 12.5C22 17.214 22 19.571 20.535 21.035C19.072 22.5 16.714 22.5 12 22.5C7.286 22.5 4.929 22.5 3.464 21.035C2 19.572 2 17.214 2 12.5Z"
      stroke="black"
      strokeWidth="1.5"
    />
    <Path
      d="M16 10.5C17.1046 10.5 18 9.60457 18 8.5C18 7.39543 17.1046 6.5 16 6.5C14.8954 6.5 14 7.39543 14 8.5C14 9.60457 14.8954 10.5 16 10.5Z"
      stroke="black"
      strokeWidth="1.5"
    />
    <Path
      d="M2 13L3.752 11.467C4.19114 11.0831 4.75974 10.8804 5.34272 10.8998C5.9257 10.9193 6.47949 11.1596 6.892 11.572L11.182 15.862C11.5149 16.1949 11.9546 16.3996 12.4235 16.4402C12.8925 16.4808 13.3608 16.3547 13.746 16.084L14.045 15.874C14.6006 15.4838 15.2721 15.2936 15.9498 15.3345C16.6275 15.3753 17.2713 15.6449 17.776 16.099L21 19"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Svg>
);

const CATEGORY_LABELS: Record<string, string> = {
  [BugReportsPostCategoryEnum.OrderIssue]: 'Order Issue',
  [BugReportsPostCategoryEnum.ProductIssue]: 'Product Issue',
  [BugReportsPostCategoryEnum.VendorIssue]: 'Vendor Issue',
  [BugReportsPostCategoryEnum.PaymentIssue]: 'Payment Issue',
  [BugReportsPostCategoryEnum.AppCrash]: 'App Crash',
  [BugReportsPostCategoryEnum.AppPerformance]: 'App Performance',
  [BugReportsPostCategoryEnum.UiUxIssue]: 'UI/UX Issue',
  [BugReportsPostCategoryEnum.AccountIssue]: 'Account Issue',
  [BugReportsPostCategoryEnum.Other]: 'Other',
};

const ReportIssue = () => {
  const router = useRouter();
  const { orderId, productId, vendorId, category: initialCategory } = useLocalSearchParams<{ orderId?: string; productId?: string; vendorId?: string; category?: string }>();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<BugReportsPostCategoryEnum>(BugReportsPostCategoryEnum.Other);
  const [issueText, setIssueText] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);

  useEffect(() => {
    const isValidCategory = Object.values(BugReportsPostCategoryEnum).includes(initialCategory as BugReportsPostCategoryEnum);
    setCategory(
      isValidCategory ? (initialCategory as BugReportsPostCategoryEnum) : BugReportsPostCategoryEnum.Other
    );
  }, [initialCategory]);

  const showError = useCallback((m: string) => toast.error(m), []);
  const showSuccess = useCallback((m: string) => toast.success(m), []);

  const bugReportApiClient = useMemo(() => new BugReportApi(apiConfig), []);

  const handleBackPress = () => {
    router.back();
  };

  const handleRemoveAttachment = (uri: string) => {
    setAttachments(prev => prev.filter(item => item !== uri));
  };

  const handleCamera = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permissionResult.granted) {
        showError('Camera permission is required to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setAttachments(prev => [...prev, result.assets[0].uri]);
      }
    } catch (error) {
      showError('Failed to access camera.');
    }
  };

  const handleGallery = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        showError('Gallery permission is required to select photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setAttachments(prev => [...prev, result.assets[0].uri]);
      }
    } catch (error) {
      showError('Failed to access gallery.');
    }
  };

  const handleSend = async () => {
    if (!issueText.trim()) {
      showError('Please describe the issue before sending.');
      return;
    }

    setIsLoading(true);
    try {
      // The auto-generated `bugReportsPost` method only supports a single image.
      // We will send the first attachment if one exists.
      const firstAttachmentUri = attachments.length > 0 ? attachments[0] : undefined;
      let imageFile: any; // Using 'any' because RN FormData expects an object, not a browser File object

      if (firstAttachmentUri) {
        const filename = firstAttachmentUri.split('/').pop() || 'image.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        let uri = firstAttachmentUri;
        if (Platform.OS === 'android' && !uri.startsWith('content://') && !uri.startsWith('file://')) {
          uri = `file://${uri}`;
        }
        imageFile = {
          uri,
          name: filename,
          type,
        };
      }

      const meta = JSON.stringify({
        device: Platform.OS,
        version: Platform.Version,
      });

      const cleanParam = (val?: string) => (!val || val === 'undefined' ? undefined : val);

      await bugReportApiClient.bugReportsPost(
        issueText,
        title || undefined,
        category,
        cleanParam(orderId),
        cleanParam(productId),
        cleanParam(vendorId),
        meta,
        imageFile,
        {
          transformRequest: (data, headers: any) => {
            if (headers && typeof headers.delete === 'function') {
              headers.delete('Content-Type');
              headers.delete('content-type');
            } else if (headers) {
              delete headers['Content-Type'];
              delete headers['content-type'];
            }
            return data;
          },
        }
      );

      showSuccess('Thank you for your feedback. We will review your report and get back to you soon.');
      router.back();
    } catch (error) {
      console.error('Failed to send issue report:', error);
      showError('Failed to send your report. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top','left','right']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.backButton} onPress={handleBackPress}>
            <View style={styles.backButtonContainer}>
              <Ionicons name="chevron-back" size={24} color="#100A37" />
            </View>
          </Pressable>
          <Text style={styles.headerTitle}>Report an issue</Text>
        </View>
        <View style={styles.headerRight}>
          {/* <Pressable style={styles.headerIcon} onPress={() => router.push('/shared/notifications')}>
            <Ionicons name="notifications-outline" size={20} color="#000" />
          </Pressable>
          <Pressable style={styles.headerIcon}>
            <ShoppingBasket width={20} height={20} stroke="#000" strokeWidth="0" />
          </Pressable> */}
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Title Input Area */}
          <View style={styles.titleInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Title (Optional)"
              placeholderTextColor="#707070"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Category Selector */}
          <Pressable style={styles.categorySelector} onPress={() => setCategoryModalVisible(true)}>
            <Text style={styles.categoryText}>
              {CATEGORY_LABELS[category] || 'Select Category'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#707070" />
          </Pressable>

          {/* Text Input Area */}
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Share your experience with us."
              placeholderTextColor="#707070"
              multiline
              numberOfLines={8}
              value={issueText}
              onChangeText={setIssueText}
              textAlignVertical="top"
            />
          </View>

          {/* Camera and Gallery Buttons */}
          <View style={styles.attachmentButtons}>
            <Pressable style={styles.attachmentButton} onPress={handleCamera}>
              <CameraIcon />
              <Text style={styles.attachmentButtonText}>CAMERA</Text>
            </Pressable>
            <Pressable style={styles.attachmentButton} onPress={handleGallery}>
              <GalleryIcon />
              <Text style={styles.attachmentButtonText}>GALLERY</Text>
            </Pressable>
          </View>

          {/* Attachments Preview */}
          {attachments.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.attachmentsScrollView}>
              {attachments.map((uri, index) => (
                <View key={index} style={styles.attachmentContainer}>
                  <Image source={{ uri }} style={styles.attachmentImage} />
                  <Pressable style={styles.removeAttachmentButton} onPress={() => handleRemoveAttachment(uri)}>
                    <Ionicons name="close-circle" size={24} color="#F48022" />
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Footer Section */}
        <View style={styles.footerSection}>
          <Text style={styles.infoText}>
            Information about your device, account and this app will be automatically included in this report
          </Text>
          <Pressable style={styles.sendButton} onPress={handleSend} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.sendButtonText}>Send</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>

      {/* Category Selection Modal */}
      <Modal
        visible={isCategoryModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setCategoryModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Category</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {Object.values(BugReportsPostCategoryEnum).map((cat) => (
                <Pressable
                  key={cat}
                  style={styles.categoryOption}
                  onPress={() => {
                    setCategory(cat);
                    setCategoryModalVisible(false);
                  }}
                >
                  <Text style={[styles.categoryOptionText, category === cat && styles.categoryOptionTextSelected]}>
                    {CATEGORY_LABELS[cat]}
                  </Text>
                  {category === cat && <Ionicons name="checkmark" size={20} color="#F48022" />}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
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
    paddingBottom: 5
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
  backButtonContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Raleway-Bold',
    color: '#000',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#B4BED4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  mainContent: {
    paddingHorizontal: 23,
    paddingTop: 20,
    gap: 20,
  },
  titleInputContainer: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  categorySelector: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'OpenSans-SemiBold',
    color: '#000',
  },
  textInputContainer: {
    minHeight: 202,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#F0F0F0',
    padding: 18,
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 9,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'OpenSans-SemiBold',
    color: '#707070',
    lineHeight: 22,
  },
  attachmentButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 23,
  },
  attachmentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#06888C',
    backgroundColor: '#FFF',
    gap: 10,
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 9,
    elevation: 2,
  },
  attachmentButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway-Bold',
    color: '#000',
    lineHeight: 25,
  },
  attachmentsScrollView: {
    marginTop: 10,
  },
  attachmentContainer: {
    position: 'relative',
    marginRight: 10,
  },
  attachmentImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeAttachmentButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  footerSection: {
    paddingHorizontal: 20,
    paddingTop: 44,
    paddingBottom: 100,
    gap: 27,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'OpenSans-Regular',
    color: '#7C7B7B',
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  sendButton: {
    alignSelf: 'stretch',
    backgroundColor: '#06888C',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 9,
    elevation: 2,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway-Bold',
    color: '#FFF',
    lineHeight: 25,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    width: '100%',
    maxHeight: '70%',
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Raleway-Bold',
    marginBottom: 15,
    color: '#000',
  },
  categoryOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  categoryOptionText: {
    fontSize: 16,
    fontFamily: 'OpenSans-SemiBold',
    color: '#484C52',
  },
  categoryOptionTextSelected: {
    color: '#06888C',
  },
});

export default ReportIssue;