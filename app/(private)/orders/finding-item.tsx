import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ArrowBackButtonSVG, NotificationSVG, SupportSVG } from '../../../components/icons';

interface ProductItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description: string;
}

const MOCK_PRODUCT: ProductItem = {
  id: '1',
  name: 'Valbest fully cooked chicken Nugget',
  price: 3.88,
  quantity: 2,
  image: 'https://api.builder.io/api/v1/image/assets/TEMP/8ca46a868ac10a74a0da8c30074c452c3ddf4ae8?width=114',
  description: 'Valbest fully cooked chicken Nugget- frozen, 9g protein per 4 nugget serving, 24 0z (1.5lb)',
};

export default function FindingItemScreen() {
  const [foundQuantity, setFoundQuantity] = useState('2');

  const handleGoBack = () => {
    router.back();
  };

  const handleNotifications = () => {
    console.log('Open notifications');
  };

  const handleSupport = () => {
    console.log('Open support');
  };

  const handleCancel = () => {
    router.back();
  };

  const handleConfirm = () => {
    console.log('Confirm found quantity:', foundQuantity);
    // Navigate to next step or back to finding items
    router.back();
  };

  const handleAddSubstitute = () => {
    console.log('Add substitute');
    // Navigate to substitute selection
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                <ArrowBackButtonSVG width={30} height={30} color="white" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Finding item</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={handleNotifications}>
                <NotificationSVG width={24} height={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSupport}>
                <SupportSVG width={24} height={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        {/* Search Result Header */}
        <View style={styles.searchResultHeader}>
          <Text style={styles.searchResultText}>Search Result (1)</Text>
        </View>

        {/* Product Card */}
        <View style={styles.productCard}>
          <View style={styles.productContent}>
            <View style={styles.productImageContainer}>
              <Image 
                source={{ uri: MOCK_PRODUCT.image }}
                style={styles.productImage}
              />
            </View>
            <View style={styles.productDetails}>
              <Text style={styles.productDescription}>
                {MOCK_PRODUCT.description}
              </Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>${MOCK_PRODUCT.price}</Text>
                <Text style={styles.quantityLabel}>(qty {MOCK_PRODUCT.quantity})</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quantity Input Section */}
        <View style={styles.quantitySection}>
          <Text style={styles.quantityQuestion}>How many did you find?</Text>
          <View style={styles.quantityInputContainer}>
            <TextInput
              style={styles.quantityInput}
              value={foundQuantity}
              onChangeText={setFoundQuantity}
              keyboardType="numeric"
              placeholder="0"
            />
            <View style={styles.quantityDivider} />
            <Text style={styles.quantityLabel}>out of {MOCK_PRODUCT.quantity}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>

        {/* Substitute Link */}
        <TouchableOpacity onPress={handleAddSubstitute}>
          <Text style={styles.substituteText}>
            Can&apos;t find a product?{' '}
            <Text style={styles.substituteLink}>Add a substitute</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  headerSection: {
    backgroundColor: '#06888C'
  },
  safeArea: {
    paddingTop: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
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
    fontFamily: 'Raleway',
    color: '#FFF',
    lineHeight: 22,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 23,
  },
  searchResultHeader: {
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
  },
  searchResultText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Raleway',
    color: '#898A8D',
  },
  productCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#FFF',
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 9,
    elevation: 2,
  },
  productContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 25,
    gap: 21,
  },
  productImageContainer: {
    width: 81,
    height: 76,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  productImage: {
    width: 57,
    height: 57,
    resizeMode: 'contain',
  },
  productDetails: {
    flex: 1,
    gap: 6,
  },
  productDescription: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#484C52',
    lineHeight: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#000',
  },
  quantityLabel: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#898A8D',
  },
  quantitySection: {
    gap: 14,
  },
  quantityQuestion: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Raleway',
    color: '#101010',
  },
  quantityInputContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 18,
  },
  quantityInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Nunito Sans',
    color: '#969BA0',
    paddingVertical: 0,
  },
  quantityDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#D9D9D9',
    marginHorizontal: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#06888C',
    backgroundColor: 'transparent',
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 9,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#06888C',
    lineHeight: 25,
    textAlign: 'center',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#06888C',
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 9,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
    lineHeight: 25,
    textAlign: 'center',
  },
  substituteText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Raleway',
    color: '#000',
    lineHeight: 25,
    textAlign: 'center',
  },
  substituteLink: {
    fontWeight: '700',
    color: '#F00',
  },
});
