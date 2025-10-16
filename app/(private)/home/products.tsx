import type { VendorProduct } from '@/api';
import type { Vendor } from '@/api/models';
import { useAuth } from '@/context/AppProvider';
import { useMyProducts } from '@/hooks/api/useProductQueries';
import { useVendors } from '@/hooks/api/useVendors';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

export default function StoreProductsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStoreId, setSelectedStoreId] = useState<string | undefined>(undefined);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    isError,
    error,
  } = useMyProducts(selectedStoreId);
  const { fetchVendors } = useVendors();
  const { state: authState } = useAuth();
  const userId = authState.user?.id;

  const { data: vendorsData, isLoading: isLoadingStores } = useQuery({
    queryKey: ['vendors', userId],
    queryFn: () => fetchVendors({ userId }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!userId,
  });

  const handleGoBack = () => {
    router.back();
  };

  const handleNotifications = () => {
    console.log('Open notifications');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Search for:', query);
  };

  const handleAddProduct = () => {
    router.push({
      pathname: '/(private)/store/add-product',
      params: { storeId: selectedStoreId },
    });
  };

  const handlePublishStore = () => {
    console.log('Publishing store...');
    // Handle store publishing
  };

  const renderProduct = (product: VendorProduct) => (
    <TouchableOpacity
      key={product.id}
      style={styles.productCard}
      onPress={() => router.push({ pathname: '/(private)/store/view-product', params: { productId: product.id } } as any)}
      activeOpacity={0.85}
    >
      <View style={styles.productImageContainer}>
        <Image 
          source={{ uri: product.images?.[0] || 'https://via.placeholder.com/150' }}
          style={styles.productImage}
          resizeMode="contain"
        />
      </View>
      <View style={styles.productDetails}>
        <View style={styles.priceContainer}>
          {product.discountedPrice && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>${product.discountedPrice.toFixed(2)}</Text>
            </View>
          )}
          <Text style={styles.productPrice}>${product.price?.toFixed(2)}</Text>
        </View>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.productSize}>{product.weight || ''}</Text>
      </View>
    </TouchableOpacity>
  );

  const products = productsData?.data ?? [];
  const totalProducts = productsData?.totalCount ?? 0;
  const paginationInfo = `Showing ${products.length} of ${totalProducts}`;

  const stores = vendorsData?.data ?? [];
  const isLoading = isLoadingProducts || isLoadingStores;

  const selectedStoreName =
    stores.find((s: Vendor) => s.id === selectedStoreId)?.name || 'All Stores';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#06888C" />
      
      {/* Extended Header Background */}
      <View style={styles.extendedHeader}>
        {/* Header Content */}
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <Svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <Path d="M19.6278 21.993C19.8661 22.2135 20 22.5125 20 22.8243C20 23.1361 19.8661 23.4352 19.6278 23.6556C19.3895 23.8761 19.0662 24 18.7292 24C18.3921 24 18.0689 23.8761 17.8306 23.6556L9.37313 15.8313C9.25486 15.7223 9.16102 15.5927 9.09699 15.4501C9.03296 15.3074 9 15.1545 9 15C9 14.8455 9.03296 14.6926 9.09699 14.5499C9.16102 14.4073 9.25486 14.2777 9.37313 14.1687L17.8306 6.34435C18.0689 6.12387 18.3921 6 18.7292 6C19.0662 6 19.3895 6.12387 19.6278 6.34435C19.8661 6.56483 20 6.86387 20 7.17568C20 7.48749 19.8661 7.78653 19.6278 8.00702L12.07 14.999L19.6278 21.993Z" fill="white"/>
              </Svg>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>All Products</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={handleNotifications}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Path d="M8.645 20.5C8.86103 21.2219 9.30417 21.8549 9.90858 22.3049C10.513 22.755 11.2464 22.998 12 22.998C12.7536 22.998 13.487 22.755 14.0914 22.3049C14.6958 21.8549 15.139 21.2219 15.355 20.5H8.645ZM3 19.5H21V16.5L19 13.5V8.5C19 7.58075 18.8189 6.6705 18.4672 5.82122C18.1154 4.97194 17.5998 4.20026 16.9497 3.55025C16.2997 2.90024 15.5281 2.38463 14.6788 2.03284C13.8295 1.68106 12.9193 1.5 12 1.5C11.0807 1.5 10.1705 1.68106 9.32122 2.03284C8.47194 2.38463 7.70026 2.90024 7.05025 3.55025C6.40024 4.20026 5.88463 4.97194 5.53284 5.82122C5.18106 6.6705 5 7.58075 5 8.5V13.5L3 16.5V19.5Z" fill="white"/>
              </Svg>
            </TouchableOpacity>
          </View>
        </View>


        {/* Overlay Container for Tab Section and Search */}
          <View style={styles.overlayContainer}>
            <View style={styles.dropdownWrapper}>
              <TouchableOpacity
                style={styles.dropdownHeader}
                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Text style={styles.dropdownHeaderText}>{selectedStoreName}</Text>
                <Svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <Path d="M1 1.5L6 6.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </Svg>
              </TouchableOpacity>
              {isDropdownOpen && (
                <View style={styles.dropdownList}>
                  <TouchableOpacity style={styles.dropdownItem} onPress={() => { setSelectedStoreId(undefined); setIsDropdownOpen(false); }}>
                    <Text style={styles.dropdownItemText}>All Stores</Text>
                  </TouchableOpacity>
                  {stores.map((store: Vendor) => (
                    <TouchableOpacity
                      key={store.id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedStoreId(store.id);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{store.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
      </View>

     

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.productsHeader}>Products ({totalProducts})</Text>

          {isLoading && (
            <ActivityIndicator size="large" color="#06888C" style={{ marginVertical: 40 }} />
          )}

          {isError && (
            <Text style={styles.noProductsText}>Error: {error.message}</Text>
          )}

          {!isLoading && !isError && (
            <View style={styles.productsGrid}>
              {products.length > 0 ? (
                products.map(renderProduct)
              ) : (
                <Text style={styles.noProductsText}>No products found.</Text>
              )}
            </View>
          )}

          {!isLoading && products.length > 0 && (
            <View style={styles.pagination}>
              <Text style={styles.paginationText}>{paginationInfo}</Text>
            </View>
          )}
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
  extendedHeader: {
    backgroundColor: '#06888C',
    paddingVertical: 20,
    gap: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: "flex-start",
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  backButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeInfoSection: {
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
    lineHeight: 22,
  },
  storeLogoContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(6, 136, 140, 0.20)',
    backgroundColor: '#FFEBF0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerStoreLogo: {
    width: 60,
    height: 60,
  },
  storeLocation: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#FFF',
    textAlign: 'center',
  },
  headerIcons: {
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
  overlayContainer: {
    paddingHorizontal: 20,
    gap: 17,
    minWidth: '60%',
  },
  activeTab: {
    backgroundColor: '#FFF',
  },
  tabText: {
    fontSize: 10,
    fontWeight: '500',
    fontFamily: 'Open Sans',
    color: '#BBB',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '700',
    fontFamily: 'Raleway',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#F0F0F0',
    gap: 14,
  },
  searchPlaceholder: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#7C7B7B',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 20,
  },
  productsHeader: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#000',
    marginBottom: 24,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    rowGap: 30,
    marginBottom: 30,
  },
  productCard: {
    width: '31%', // Adjust for 3 items per row with spacing
    gap: 6,
  },
  productImageContainer: {
    borderRadius: 16,
    backgroundColor: '#FAFAFB',
    padding: 3,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productDetails: {
    gap: 6,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  discountBadge: {
    paddingVertical: 1,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#DA5742',
  },
  discountText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#FFF',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#000',
    flex: 1,
  },
  productName: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#7C7B7B',
    lineHeight: 16,
  },
  productSize: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#7C7B7B',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  paginationText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#202224',
    opacity: 0.8,
  },
  nextButton: {
  },
  bottomActions: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  addProductButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 16,
    backgroundColor: '#06888C',
    gap: 10,
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 9,
    elevation: 3,
  },
  addProductText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
    lineHeight: 25,
  },
  noProductsText: {
    flex: 1,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#6B7280',
  },
  dropdownWrapper: {
    position: 'relative',
    zIndex: 10,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  dropdownHeaderText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
  },
  dropdownList: {
    position: 'absolute',
    top: '110%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemText: {
    fontSize: 16,
  },
});
