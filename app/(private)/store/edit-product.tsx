import { UpdateVendorProductPayload, VendorProduct } from '@/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { useCategories } from '@/hooks/api/useCategories';
import { useProducts } from '@/hooks/api/useProducts';
import { useTags } from '@/hooks/api/useTags';
import { useImagePicker } from '@/hooks/useImagePicker';
import { useQuery } from '@tanstack/react-query';
import { Camera, CameraView } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Modal, Platform, ScrollView, StatusBar, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { toast } from 'sonner-native';
import { ArrowBackSVG, NotificationSVG } from '../../../components/icons';

export default function EditProductScreen() {
  const { productId, storeId } = useLocalSearchParams<{ productId: string; storeId: string }>();
  const { getProductById, updateProduct, fetchProductsByStore, loading: isSubmitting } = useProducts();
  const { fetchAllSubCategories } = useCategories();
  const { fetchAllTags } = useTags();

  const { data: subCategories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['subCategories'],
    queryFn: fetchAllSubCategories,
    staleTime: 1000 * 60 * 5,
  });

  const { data: tags, isLoading: isLoadingTags } = useQuery({
    queryKey: ['tags'],
    queryFn: fetchAllTags,
    staleTime: 1000 * 60 * 5,
  });

  const [barcode, setBarcode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [stock, setStock] = useState('');
  const [sku, setSku] = useState('');
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScannerVisible, setIsScannerVisible] = useState(false);

  const { selectedImages, pickFromGallery, removeImage, isLoading: imageLoading } = useImagePicker({ base64: true, multiple: true });

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const { data: productData, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['vendorProduct', productId],
    queryFn: async () => {
      const res = await getProductById(productId!);
      return res as VendorProduct;
    },
    enabled: !!productId,
  });

  useEffect(() => {
    if (!productData) return;
    setName(productData.name || '');
    setDescription(productData.description || '');
    setPrice(productData.price != null ? String(productData.price) : '');
    setDiscountedPrice(productData.discountedPrice != null ? String(productData.discountedPrice) : '');
    setIsAvailable(productData.isAvailable ?? true);
    // productData.categoryIds may be null; prefer to fetch the product list by name
    // and extract categories from the returned item (see API sample in request).
    setCategoryIds(productData.categoryIds || []);
    (async () => {
      try {
        if (fetchProductsByStore && productData.name) {
          // determine storeId: prefer explicit param, fallback to vendor/store on product
          const targetStoreId = storeId ?? (productData as any)?.vendorId ?? (productData as any)?.storeId;
          if (!targetStoreId) return;
          const resp = await fetchProductsByStore(targetStoreId, { name: productData.name });
          // response shape expected: { data: [ { categories: [...] } ] }
          const list = (resp && (resp as any).data) || (resp as any);
          const first = Array.isArray(list) ? list[0] : list?.data?.[0] || null;
          const categories = first?.categories || [];
          if (Array.isArray(categories) && categories.length > 0) {
            const catIds = categories.map((c: any) => c.id).filter(Boolean);
            if (catIds.length > 0) setCategoryIds(catIds);
          }
        }
      } catch (err) {
        // non-fatal; keep existing categoryIds if any
        // Log for debugging during development
        console.warn('fetchProductsByStore failed', err);
      }
    })();
    setExistingImages(productData.images || []);
    // Prefill common editable fields when available on the fetched product
    setBarcode(productData.barcode || '');
    setSku(productData.sku || '');
    setStock(productData.stock != null ? String(productData.stock) : '');
    // tags might be named tagIds or tags depending on API shape
    setTagIds((productData as any).tagIds || (productData as any).tags || []);
  }, [productData, fetchProductsByStore, storeId]);

  const handleGoBack = () => router.back();
  const handleNotifications = () => {};
  const handleCancel = () => router.back();

  const handleScanBarcode = async () => {
    if (hasPermission === null) {
      toast.info('Requesting for camera permission...');
      return;
    }
    if (hasPermission === false) {
      toast.error('No access to camera. Please enable it in your settings.');
      return;
    }
    setIsScannerVisible(true);
  };

  const handleSave = async () => {
    if (!productId) {
      toast.error('Missing product ID');
      return;
    }

    if (!name.trim()) return toast.error('Product name is required.');
    if (!price) return toast.error('Price is required.');
    if (categoryIds.length === 0) return toast.error('At least one Category is required.');

    const payload: UpdateVendorProductPayload = {
      name: name.trim(),
      description: description.trim() || null,
      price: parseFloat(price),
      discountedPrice: discountedPrice ? parseFloat(discountedPrice) : null,
      sku: sku.trim() || null,
      stock: stock ? parseInt(stock, 10) : null,
      isAvailable,
      categoryIds,
      tagIds,
    };

    const newImages = selectedImages.map(img => img.base64).filter((b64): b64 is string => !!b64);
    if (newImages.length > 0) payload.images = newImages;

    const updated = await updateProduct(productId, payload);
    if (updated) {
      const targetStoreId = storeId ?? (productData as any)?.vendorId ?? (productData as any)?.storeId;
      router.replace({ pathname: '/(private)/store/store-products', params: { storeId: targetStoreId } });
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Modal
        visible={isScannerVisible}
        animationType="slide"
        onRequestClose={() => setIsScannerVisible(false)}
      >
        <View style={styles.scannerContainer}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            onBarcodeScanned={(scanningResult) => {
              if (scanningResult.data) {
                setIsScannerVisible(false);
                setBarcode(scanningResult.data);
                toast.success(`Barcode Scanned: ${scanningResult.data}`);
              }
            }}
            barcodeScannerSettings={{ barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "qr", "code128"] }}
          />
          <TouchableOpacity style={styles.scannerCloseButton} onPress={() => setIsScannerVisible(false)}><Text style={styles.scannerCloseText}>Cancel</Text></TouchableOpacity>
        </View>
      </Modal>
        <StatusBar barStyle="light-content" backgroundColor="#06888C" />

        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                <ArrowBackSVG />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Edit Product</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={handleNotifications} style={styles.headerAction}>
                <NotificationSVG />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Edit Product details</Text>
            <Text style={styles.sectionSubtitle}>Update your product information</Text>
          </View>

          <View style={styles.imageSection}>
            <Text style={styles.fieldLabel}>Product Images</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.imageThumbnails}>
                {existingImages.map((uri, index) => (
                  <View key={`exist-${index}`} style={styles.imageThumbnail}>
                    <Image source={{ uri }} style={styles.previewImage} />
                  </View>
                ))}
                {selectedImages.map((image, index) => (
                  <View key={`new-${index}`} style={styles.imageThumbnail}>
                    <Image source={{ uri: image.uri }} style={styles.previewImage} />
                    <TouchableOpacity style={styles.removeImageButton} onPress={() => removeImage(index)}>
                      <Text style={styles.removeImageText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity style={styles.addImageButton} onPress={() => pickFromGallery()}>
                  <Svg width="24" height="24" viewBox="0 0 25 24" fill="none">
                    <Path d="M12.5 1.5C6.70156 1.5 2 6.20156 2 12C2 17.7984 6.70156 22.5 12.5 22.5C18.2984 22.5 23 17.7984 23 12C23 6.20156 18.2984 1.5 12.5 1.5ZM17 12.5625C17 12.6656 16.9156 12.75 16.8125 12.75H13.25V16.3125C13.25 16.4156 13.1656 16.5 13.0625 16.5H11.9375C11.8344 16.5 11.75 16.4156 11.75 16.3125V12.75H8.1875C8.08437 12.75 8 12.6656 8 12.5625V11.4375C8 11.3344 8.08437 11.25 8.1875 11.25H11.75V7.6875C11.75 7.58437 11.8344 7.5 11.9375 7.5H13.0625C13.1656 7.5 13.25 7.58437 13.25 7.6875V11.25H16.8125C16.9156 11.25 17 11.3344 17 11.4375V12.5625Z" fill="#007BFF"/>
                  </Svg>
                  <Text style={styles.addImageText}>Add Image</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

          <View style={styles.formSection}>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Barcode</Text>
              <View style={styles.barcodeContainer}>
                <TextInput
                  style={[styles.textInput, styles.barcodeInput]}
                  placeholder="Enter or scan barcode"
                  placeholderTextColor="#7C8BA0"
                  value={barcode}
                  onChangeText={setBarcode}
                />
                <TouchableOpacity style={styles.scanButton} onPress={handleScanBarcode}>
                  <Text style={styles.scanButtonText}>Scan</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Product Name*</Text>
              <View style={styles.inputContainer}>
                <TextInput style={styles.textInput} placeholder="Enter product name" placeholderTextColor="#7C8BA0" value={name} onChangeText={setName} />
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Description</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer]}>
                <TextInput style={[styles.textInput, styles.textArea]} placeholder="Enter product description here" placeholderTextColor="#7C8BA0" value={description} onChangeText={setDescription} multiline numberOfLines={4} textAlignVertical="top" />
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Price ($)*</Text>
              <View style={styles.inputContainer}>
                <TextInput style={styles.textInput} placeholder="Enter price" placeholderTextColor="#7C8BA0" value={price} onChangeText={setPrice} keyboardType="numeric" />
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Discounted Price ($)</Text>
              <View style={styles.inputContainer}>
                <TextInput style={styles.textInput} placeholder="Enter discounted price (optional)" placeholderTextColor="#7C8BA0" value={discountedPrice} onChangeText={setDiscountedPrice} keyboardType="numeric" />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.fieldContainer, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Stock</Text>
                <View style={styles.inputContainer}>
                  <TextInput style={styles.textInput} placeholder="e.g., 100" placeholderTextColor="#7C8BA0" value={stock} onChangeText={setStock} keyboardType="number-pad" />
                </View>
              </View>
              <View style={[styles.fieldContainer, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>SKU</Text>
                <View style={styles.inputContainer}>
                  <TextInput style={styles.textInput} placeholder="e.g., SKU123" placeholderTextColor="#7C8BA0" value={sku} onChangeText={setSku} />
                </View>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Categories*</Text>
              <MultiSelect options={subCategories || []} selectedItems={categoryIds} onSelectionChange={setCategoryIds} placeholder="Select categories" isLoading={isLoadingCategories} />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Tags</Text>
              <MultiSelect options={tags || []} selectedItems={tagIds} onSelectionChange={setTagIds} placeholder="Select tags" isLoading={isLoadingTags} />
            </View>

            <View style={styles.switchContainer}>
              <Text style={styles.fieldLabel}>Is Available?</Text>
              <Switch trackColor={{ false: '#767577', true: '#06888C' }} thumbColor={isAvailable ? '#f4f3f4' : '#f4f3f4'} ios_backgroundColor="#3e3e3e" onValueChange={setIsAvailable} value={isAvailable} />
            </View>
          </View>

          <View style={styles.bottomActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel} disabled={isSubmitting}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.publishButton} onPress={handleSave} disabled={isSubmitting || imageLoading || isLoadingProduct}>
              <Text style={styles.publishText}>Save changes</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {(isSubmitting || imageLoading || isLoadingProduct) && <LoadingSpinner overlay message={isSubmitting ? 'Saving product...' : 'Loading product...'} />}
      </SafeAreaView>
    </KeyboardAvoidingView>
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
    marginLeft: -10, // Adjust for visual alignment
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
    paddingBottom: 40,
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
  imageThumbnails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  imageThumbnail: {
    width: 100,
    height: 99,
    borderRadius: 8,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  addImageButton: {
    width: 100,
    height: 99,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#9CA3AF',
    borderStyle: 'dashed',
    alignItems: 'center',
    gap: 1,
    justifyContent: 'center',
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
  barcodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#FFF',
    paddingLeft: 18,
  },
  barcodeInput: {
    flex: 1,
  },
  scanButton: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    backgroundColor: '#E0E0E0',
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  scanButtonText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#000',
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
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 46,
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
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  scannerCloseButton: {
    position: 'absolute',
    bottom: 50,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
  },
  scannerCloseText: {
    color: '#000',
    fontSize: 16,
  },
});
