import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ArrowBackSVG, NotificationSVG, SupportSVG } from '../../components/icons';

export default function AddProductScreen() {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('');
  const [price, setPrice] = useState('');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedDiscount, setSelectedDiscount] = useState('');

  const colors = [
    '#ECE7C9',
    '#93D1FF', 
    '#93FF9C',
    '#AE93FF',
    '#464A4D'
  ];

  const handleGoBack = () => {
    router.back();
  };

  const handleNotifications = () => {
    console.log('Open notifications');
  };

  const handleSupport = () => {
    console.log('Open support');
  };

  const handleImageUpload = () => {
    console.log('Upload image');
    // Implement image picker functionality
  };

  const handleAddImage = () => {
    console.log('Add additional image');
    // Implement image picker functionality
  };

  const handleCancel = () => {
    router.back();
  };

  const handlePublishProduct = () => {
    console.log('Publishing product...');
    // Implement product publishing logic
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#06888C" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <ArrowBackSVG width={30} height={30} color="white" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Add Product</Text>
          
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleNotifications} style={styles.headerAction}>
              <NotificationSVG width={24} height={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleSupport} style={styles.headerAction}>
              <SupportSVG width={24} height={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Add Product Details Section */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Add Product details</Text>
          <Text style={styles.sectionSubtitle}>Provide all the information of your stores here</Text>
        </View>

        {/* Product Image Section */}
        <View style={styles.imageSection}>
          <Text style={styles.fieldLabel}>Product Image</Text>
          
          {/* Image Upload Area */}
          <TouchableOpacity style={styles.uploadArea} onPress={handleImageUpload}>
            <View style={styles.uploadIcon}>
              <svg width="60" height="60" viewBox="0 0 61 60" fill="none">
                <path d="M22.275 19.275L28 13.525V37.5C28 38.163 28.2634 38.7989 28.7322 39.2677C29.2011 39.7366 29.837 40 30.5 40C31.163 40 31.7989 39.7366 32.2678 39.2677C32.7366 38.7989 33 38.163 33 37.5V13.525L38.725 19.275C38.9574 19.5093 39.2339 19.6953 39.5386 19.8222C39.8432 19.9491 40.17 20.0145 40.5 20.0145C40.83 20.0145 41.1568 19.9491 41.4614 19.8222C41.7661 19.6953 42.0426 19.5093 42.275 19.275C42.5093 19.0426 42.6953 18.7661 42.8222 18.4614C42.9492 18.1568 43.0145 17.83 43.0145 17.5C43.0145 17.17 42.9492 16.8432 42.8222 16.5385C42.6953 16.2339 42.5093 15.9574 42.275 15.725L32.275 5.72499C32.0372 5.49738 31.7569 5.31897 31.45 5.19998C30.8413 4.94994 30.1587 4.94994 29.55 5.19998C29.2431 5.31897 28.9628 5.49738 28.725 5.72499L18.725 15.725C18.4919 15.9581 18.307 16.2348 18.1809 16.5394C18.0547 16.8439 17.9898 17.1703 17.9898 17.5C17.9898 17.8296 18.0547 18.1561 18.1809 18.4606C18.307 18.7652 18.4919 19.0419 18.725 19.275C18.9581 19.5081 19.2348 19.693 19.5394 19.8191C19.8439 19.9453 20.1704 20.0102 20.5 20.0102C20.8296 20.0102 21.1561 19.9453 21.4606 19.8191C21.7652 19.693 22.0419 19.5081 22.275 19.275ZM53 30C52.337 30 51.7011 30.2634 51.2322 30.7322C50.7634 31.2011 50.5 31.8369 50.5 32.5V47.5C50.5 48.163 50.2366 48.7989 49.7678 49.2678C49.2989 49.7366 48.663 50 48 50H13C12.337 50 11.7011 49.7366 11.2322 49.2678C10.7634 48.7989 10.5 48.163 10.5 47.5V32.5C10.5 31.8369 10.2366 31.2011 9.76777 30.7322C9.29893 30.2634 8.66304 30 8 30C7.33696 30 6.70107 30.2634 6.23223 30.7322C5.76339 31.2011 5.5 31.8369 5.5 32.5V47.5C5.5 49.4891 6.29018 51.3968 7.6967 52.8033C9.10322 54.2098 11.0109 55 13 55H48C49.9891 55 51.8968 54.2098 53.3033 52.8033C54.7098 51.3968 55.5 49.4891 55.5 47.5V32.5C55.5 31.8369 55.2366 31.2011 54.7678 30.7322C54.2989 30.2634 53.663 30 53 30Z" fill="#4B4E61"/>
              </svg>
            </View>
            <View style={styles.uploadText}>
              <Text style={styles.uploadMainText}>
                Drop Your Images here or <Text style={styles.uploadLinkText}>Click to browse</Text>
              </Text>
              <Text style={styles.uploadSubText}>PNG, JPEG and GIF files are allowed</Text>
            </View>
          </TouchableOpacity>

          {/* Image Thumbnails */}
          <View style={styles.imageThumbnails}>
            <View style={styles.imageThumbnail} />
            <View style={styles.imageThumbnail} />
            <TouchableOpacity style={styles.addImageButton} onPress={handleAddImage}>
              <svg width="24" height="24" viewBox="0 0 25 24" fill="none">
                <path d="M12.5 1.5C6.70156 1.5 2 6.20156 2 12C2 17.7984 6.70156 22.5 12.5 22.5C18.2984 22.5 23 17.7984 23 12C23 6.20156 18.2984 1.5 12.5 1.5ZM17 12.5625C17 12.6656 16.9156 12.75 16.8125 12.75H13.25V16.3125C13.25 16.4156 13.1656 16.5 13.0625 16.5H11.9375C11.8344 16.5 11.75 16.4156 11.75 16.3125V12.75H8.1875C8.08437 12.75 8 12.6656 8 12.5625V11.4375C8 11.3344 8.08437 11.25 8.1875 11.25H11.75V7.6875C11.75 7.58437 11.8344 7.5 11.9375 7.5H13.0625C13.1656 7.5 13.25 7.58437 13.25 7.6875V11.25H16.8125C16.9156 11.25 17 11.3344 17 11.4375V12.5625Z" fill="#007BFF"/>
              </svg>
              <Text style={styles.addImageText}>Add Image</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          {/* Product Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Product Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter store's name"
                placeholderTextColor="#7C8BA0"
                value={productName}
                onChangeText={setProductName}
              />
            </View>
          </View>

          {/* Description */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Description</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Enter product description here"
                placeholderTextColor="#7C8BA0"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Unit */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Unit (per lb)</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter Unit"
                placeholderTextColor="#7C8BA0"
                value={unit}
                onChangeText={setUnit}
              />
            </View>
          </View>

          {/* Price */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Price ($)</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter price"
                placeholderTextColor="#7C8BA0"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Discount */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Discount</Text>
            <TouchableOpacity style={styles.dropdownContainer}>
              <Text style={styles.dropdownText}>Select</Text>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4.5 6L8 9.5L11.5 6" stroke="black"/>
              </svg>
            </TouchableOpacity>
          </View>
        </View>

        {/* Color Selection */}
        <View style={styles.colorSection}>
          <Text style={styles.colorLabel}>Select your color</Text>
          <View style={styles.colorPalette}>
            {colors.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColor
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.publishButton} onPress={handlePublishProduct}>
            <Text style={styles.publishText}>Publish product</Text>
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
    paddingTop: 20,
    paddingBottom: 19,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 21,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  headerAction: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  detailsSection: {
    paddingHorizontal: 21,
    paddingTop: 18,
    gap: 7,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Raleway',
    color: '#000',
    lineHeight: 19,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#484C52',
    lineHeight: 16,
  },
  imageSection: {
    paddingHorizontal: 21,
    paddingTop: 24,
    gap: 17,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Raleway',
    color: '#000',
    lineHeight: 19,
    marginBottom: 10,
  },
  uploadArea: {
    padding: 48,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#9393A3',
    borderStyle: 'dashed',
    alignItems: 'center',
    gap: 32,
  },
  uploadIcon: {
    alignItems: 'center',
  },
  uploadText: {
    alignItems: 'center',
    gap: 6,
  },
  uploadMainText: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Nunito Sans',
    color: '#000',
    textAlign: 'center',
  },
  uploadLinkText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Nunito Sans',
    color: '#007BFF',
  },
  uploadSubText: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Nunito Sans',
    color: '#50555C',
    textAlign: 'center',
  },
  imageThumbnails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 17,
  },
  imageThumbnail: {
    width: 100,
    height: 99,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#9CA3AF',
    backgroundColor: '#F9F9F9',
  },
  addImageButton: {
    width: 157,
    padding: 25,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#9CA3AF',
    borderStyle: 'dashed',
    alignItems: 'center',
    gap: 1,
  },
  addImageText: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Nunito Sans',
    color: '#007BFF',
    lineHeight: 22,
  },
  formSection: {
    paddingHorizontal: 21,
    paddingTop: 33,
    gap: 21,
  },
  fieldContainer: {
    gap: 10,
  },
  inputContainer: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#FFF',
  },
  textAreaContainer: {
    height: 116,
  },
  textInput: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#000',
    padding: 0,
    margin: 0,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
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
  },
  colorSection: {
    paddingHorizontal: 22,
    paddingTop: 23,
    gap: 12,
  },
  colorLabel: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#023337',
  },
  colorPalette: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#06888C',
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 46,
    paddingBottom: 40,
    gap: 6,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#06888C',
    backgroundColor: '#FFF',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 9,
    elevation: 2,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#06888C',
    lineHeight: 25,
  },
  publishButton: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#06888C',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 9,
    elevation: 2,
  },
  publishText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
    lineHeight: 25,
  },
});
