import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { useCategories } from '@/hooks/api/useCategories';
import { useProducts } from '@/hooks/api/useProducts';
import { useTags } from '@/hooks/api/useTags';
import { useQuery } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Modal, Platform, ScrollView, StatusBar, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [stock, setStock] = useState('');
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [published, setPublished] = useState(false);
  const [isAlcohol, setIsAlcohol] = useState(false);
  const [isAgeRestricted, setIsAgeRestricted] = useState(false);
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [isWeightUnitModalVisible, setIsWeightUnitModalVisible] = useState(false);
  const weightUnits = ['lb', 'oz', 'g', 'kg', 'gal', 'fl oz', 'l', 'ml', 'ct'];
  const [images, setImages] = useState<{ id: string; uri: string; base64?: string; isExisting: boolean }[]>([]);
  const imagesLoadedRef = React.useRef(false);

  const { data: productData, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['vendorProduct', productId],
    queryFn: async () => {
      const res = await getProductById(productId!);
      return res;
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
    setPublished(productData.published ?? false);
    setIsAlcohol(productData.isAlcohol ?? false);
    setIsAgeRestricted(productData.isAgeRestricted ?? false);
    setWeight(productData.weight != null ? String(productData.weight) : '');
    setWeightUnit(productData.weightUnit || '');
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
    
    if (!imagesLoadedRef.current && productData.images && Array.isArray(productData.images)) {
      setImages(productData.images.map((url, index) => ({
        id: `existing-${index}-${Date.now()}`,
        uri: url,
        isExisting: true
      })));
      imagesLoadedRef.current = true;
    }
    // Prefill common editable fields when available on the fetched product
    setStock(productData.stock != null ? String(productData.stock) : '');
    // tags might be named tagIds or tags depending on API shape
    const rawTags = (productData as any).tagIds || (productData as any).tags || [];
    const initialTagIds = Array.isArray(rawTags) ? rawTags.map((t: any) => (typeof t === 'object' ? t.id : t)) : [];
    setTagIds(initialTagIds);
  }, [productData, fetchProductsByStore, storeId]);

  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        // setImageLoading(true); // Set loading state before picking images
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        base64: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const remainingSlots = 3 - images.length;
        const newAssets = result.assets.slice(0, remainingSlots);
        if (result.assets.length > remainingSlots) {
          toast.info(`You can only add up to 3 images. Only the first ${remainingSlots} were added.`);
        }
        const newImages = newAssets.map((asset, index) => ({
          id: `${Date.now()}-${index}`,
          uri: asset.uri,
          base64: asset.base64 || undefined,
          isExisting: false,
        }));
        setImages((prev) => [...prev, ...newImages]);
        // setImageLoading(false); // Reset loading state after picking images
      }
    } catch (error) {
      // setImageLoading(false); // Reset loading state on error
      toast.error('Failed to pick images');
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleGoBack = () => router.back();
  const handleNotifications = () => {};
  const handleCancel = () => router.back();

  const handleSave = async () => {
    if (!productId) {
      toast.error('Missing product ID');
      return;
    }

    if (!name.trim()) return toast.error('Product name is required.');
    if (!price) return toast.error('Price is required.');
    if (categoryIds.length === 0) return toast.error('At least one Category is required.');

    const payload: any = {
      name: name.trim(),
      description: description.trim() || null,
      price: parseFloat(price),
      discountedPrice: discountedPrice ? parseFloat(discountedPrice) : null,
      stock: stock ? parseInt(stock, 10) : null,
      isAvailable,
      published,
      isAlcohol,
      isAgeRestricted,
      weight: weight ? parseFloat(weight) : null,
      weightUnit: weightUnit.trim() || null,
      categoryIds: categoryIds.map((c: any) => (typeof c === 'object' ? c.id || c.value : c)),
      tags: tagIds.map((t: any) => (typeof t === 'object' ? t.id || t.value : t)),
      images: images.map(img => img.isExisting ? img.uri : img.base64).filter((val): val is string => !!val),
    };

    console.log('Updating product with payload:', payload);
    const updated = await updateProduct(productId, payload);
    if (updated) {
      const targetStoreId = storeId ?? (productData as any)?.vendorId ?? (productData as any)?.storeId;
      router.replace({ pathname: '/(private)/store/store-products', params: { storeId: targetStoreId } });
    }
  };

  const renderImageItem = ({ item, drag, isActive }: RenderItemParams<{ id: string; uri: string; base64?: string; isExisting: boolean }>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          style={[styles.imageThumbnail, { opacity: isActive ? 0.5 : 1 }]}
        >
          <Image source={{ uri: item.uri }} style={styles.previewImage} />
          <TouchableOpacity style={styles.removeImageButton} onPress={() => removeImage(item.id)}>
            <Text style={styles.removeImageText}>✕</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView style={[styles.container, { backgroundColor: '#06888C' }]} edges={['top', 'left', 'right']}>
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

        <ScrollView contentContainerStyle={styles.content} style={{ backgroundColor: '#FFF' }} showsVerticalScrollIndicator={false}>
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Edit Product details</Text>
            <Text style={styles.sectionSubtitle}>Update your product information</Text>
          </View>

          <View style={styles.imageSection}>
            <Text style={styles.fieldLabel}>Product Images</Text>
            <View style={{ height: 120, paddingVertical: 10 }}>
              <DraggableFlatList
                data={images}
                onDragEnd={({ data }) => setImages(data)}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={renderImageItem}
                contentContainerStyle={styles.imageThumbnails}
                ListFooterComponent={
                  images.length < 3 ? (
                    <TouchableOpacity style={styles.addImageButton} onPress={pickImages}>
                      <Svg width="24" height="24" viewBox="0 0 25 24" fill="none">
                        <Path d="M12.5 1.5C6.70156 1.5 2 6.20156 2 12C2 17.7984 6.70156 22.5 12.5 22.5C18.2984 22.5 23 17.7984 23 12C23 6.20156 18.2984 1.5 12.5 1.5ZM17 12.5625C17 12.6656 16.9156 12.75 16.8125 12.75H13.25V16.3125C13.25 16.4156 13.1656 16.5 13.0625 16.5H11.9375C11.8344 16.5 11.75 16.4156 11.75 16.3125V12.75H8.1875C8.08437 12.75 8 12.6656 8 12.5625V11.4375C8 11.3344 8.08437 11.25 8.1875 11.25H11.75V7.6875C11.75 7.58437 11.8344 7.5 11.9375 7.5H13.0625C13.1656 7.5 13.25 7.58437 13.25 7.6875V11.25H16.8125C16.9156 11.25 17 11.3344 17 11.4375V12.5625Z" fill="#007BFF"/>
                      </Svg>
                      <Text style={styles.addImageText}>Add Image</Text>
                    </TouchableOpacity>
                  ) : null
                }
              />
            </View>
          </View>

          <View style={styles.formSection}>

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
            </View>

            <View style={styles.row}>
              <View style={[styles.fieldContainer, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Weight</Text>
                <View style={styles.inputContainer}>
                  <TextInput style={styles.textInput} placeholder="e.g., 0.5" placeholderTextColor="#7C8BA0" value={weight} onChangeText={setWeight} keyboardType="numeric" />
                </View>
              </View>
              <View style={[styles.fieldContainer, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Unit</Text>
                <View style={styles.inputContainer}>
                  <TouchableOpacity onPress={() => setIsWeightUnitModalVisible(true)}>
                    <Text style={[styles.textInput, !weightUnit && { color: '#7C8BA0' }]}>
                      {weightUnit || "Select Unit"}
                    </Text>
                  </TouchableOpacity>
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
            <View style={styles.switchContainer}>
              <Text style={styles.fieldLabel}>Published?</Text>
              <Switch trackColor={{ false: '#767577', true: '#06888C' }} thumbColor={published ? '#f4f3f4' : '#f4f3f4'} ios_backgroundColor="#3e3e3e" onValueChange={setPublished} value={published} />
            </View>
            <View style={styles.switchContainer}>
              <Text style={styles.fieldLabel}>Alcohol?</Text>
              <Switch trackColor={{ false: '#767577', true: '#06888C' }} thumbColor={isAlcohol ? '#f4f3f4' : '#f4f3f4'} ios_backgroundColor="#3e3e3e" onValueChange={setIsAlcohol} value={isAlcohol} />
            </View>
            <View style={styles.switchContainer}>
              <Text style={styles.fieldLabel}>Age Restricted?</Text>
              <Switch trackColor={{ false: '#767577', true: '#06888C' }} thumbColor={isAgeRestricted ? '#f4f3f4' : '#f4f3f4'} ios_backgroundColor="#3e3e3e" onValueChange={setIsAgeRestricted} value={isAgeRestricted} />
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

        <Modal transparent visible={isWeightUnitModalVisible} animationType="fade" onRequestClose={() => setIsWeightUnitModalVisible(false)}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsWeightUnitModalVisible(false)}>
            <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
              <Text style={styles.modalTitle}>Select Unit</Text>
              <ScrollView>
                {weightUnits.map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    style={[styles.optionItem, weightUnit === unit && styles.selectedOption]}
                    onPress={() => {
                      setWeightUnit(unit);
                      setIsWeightUnitModalVisible(false);
                    }}
                  >
                    <Text style={[styles.optionText, weightUnit === unit && styles.selectedOptionText]}>{unit}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
        {(isSubmitting || imageLoading || isLoadingProduct) && <LoadingSpinner overlay message={isSubmitting ? 'Saving product...' : 'Loading product...'} />}
      </SafeAreaView>
    </KeyboardAvoidingView>
    </GestureHandlerRootView>
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
    paddingRight: 20,
  },
  imageThumbnail: {
    width: 100,
    height: 99,
    borderRadius: 8,
    marginRight: 12,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxHeight: '60%',
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
