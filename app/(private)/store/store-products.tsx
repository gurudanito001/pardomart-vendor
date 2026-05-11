import { VendorProduct } from '@/api';
import { useProducts } from '@/hooks/api/useProducts';
import { useVendors } from '@/hooks/api/useVendors';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import NotificationBell from '../../../components/NotificationBell';

interface StoreDetails {
  name: string;
  address: string;
  image: string;
}

export default function StoreProductsScreen() {
  const { storeId } = useLocalSearchParams<{ storeId: string }>();
  const { getVendorById } = useVendors();
  const { fetchProductsByStore } = useProducts();

  const [selectedTab, setSelectedTab] = useState('pickup');
  const [searchQuery, setSearchQuery] = useState('');
  const [storeDetails, setStoreDetails] = useState<StoreDetails>({
    name: '',
    address: '',
    image: '',
  });

  const { data: vendor, isLoading: isLoadingVendor } = useQuery({
    queryKey: ['vendor', storeId],
    queryFn: () => getVendorById(storeId!),
    enabled: !!storeId,
  });

  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products', storeId],
    queryFn: () => fetchProductsByStore(storeId!),
    enabled: !!storeId,
  });

  useEffect(() => {
    if (vendor) setStoreDetails({ name: vendor.name || "", address: vendor.address || "", image: vendor.image || "" });
  }, [vendor]);

  const handleGoBack = () => {
    router.back();
  };

  const handleNotifications = () => {};

  const handleSupport = () => {
    console.log('Open support');
  };

  const handleAddProduct = () => {
    console.log('Add new product');
    router.push({
      pathname: '/(private)/store/add-product',
      params: { storeId },
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
          {product.discountedPrice ? (
            <>
              <Text style={styles.discountText}>${product.discountedPrice.toFixed(2)}</Text>
              <Text style={styles.originalPriceStrikethrough}>${product.price?.toFixed(2)}</Text>
            </>
          ) : (
            <Text style={styles.productPrice}>${product.price?.toFixed(2)}</Text>
          )}
        </View>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.productSize}>
          {product.weight != null 
            ? `${product.weight}${product.weightUnit ? ` ${product.weightUnit}` : ''}` 
            : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const products = productsData?.data || [];
  const filteredProducts = products.filter(product => {
    if (!searchQuery) return true;
    return product.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });
  const totalProducts = productsData?.totalCount || 0;
  const showingCount = filteredProducts.length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#06888C' }]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#06888C" />
      
      {/* Extended Header Background */}
      <View style={styles.extendedHeader}>
        {/* Header Content */}
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <Path d="M19.6278 21.993C19.8661 22.2135 20 22.5125 20 22.8243C20 23.1361 19.8661 23.4352 19.6278 23.6556C19.3895 23.8761 19.0662 24 18.7292 24C18.3921 24 18.0689 23.8761 17.8306 23.6556L9.37313 15.8313C9.25486 15.7223 9.16102 15.5927 9.09699 15.4501C9.03296 15.3074 9 15.1545 9 15C9 14.8455 9.03296 14.6926 9.09699 14.5499C9.16102 14.4073 9.25486 14.2777 9.37313 14.1687L17.8306 6.34435C18.0689 6.12387 18.3921 6 18.7292 6C19.0662 6 19.3895 6.12387 19.6278 6.34435C19.8661 6.56483 20 6.86387 20 7.17568C20 7.48749 19.8661 7.78653 19.6278 8.00702L12.07 14.999L19.6278 21.993Z" fill="white"/>
            </Svg>
          </TouchableOpacity>

          <View style={styles.storeInfoSection}>
            <View style={styles.storeHeaderMain}>
              <View style={styles.storeLogoContainer}>
                <Image
                  source={{ uri: storeDetails.image }}
                  style={styles.headerStoreLogo}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.headerStoreName} numberOfLines={1}>{storeDetails.name}</Text>
            </View>
            <Text style={styles.storeLocation}>{storeDetails.address}</Text>
          </View>

          <View style={styles.headerIcons}>
            <NotificationBell from="/(private)/store/store-products" />
          </View>
        </View>
      </View>

      {/* Overlay Container for Tab Section and Search */}
      <View style={styles.overlayContainer}>
        {/* Tab Section - Positioned Absolutely */}
        <View style={styles.tabSection}>
          <View style={styles.tabContainer}>
            {/* <TouchableOpacity
              style={[styles.tab, selectedTab === 'shop' && styles.activeTab]}
              onPress={() => setSelectedTab('shop')}
            >
              <Svg width="14" height="14" viewBox="0 0 14 15" fill="none">
                <Path fillRule="evenodd" clipRule="evenodd" d="M4.52713 2.6377H9.47263C9.79465 2.63772 10.1054 2.75612 10.3458 2.97038C10.5862 3.18464 10.7395 3.4798 10.7764 3.7997L11.4834 9.9247C11.5046 10.1085 11.4867 10.2948 11.4309 10.4712C11.375 10.6476 11.2825 10.8103 11.1594 10.9484C11.0363 11.0866 10.8854 11.1971 10.7165 11.2728C10.5476 11.3485 10.3647 11.3877 10.1796 11.3877H3.82013C3.63507 11.3877 3.45212 11.3485 3.28326 11.2728C3.1144 11.1971 2.96346 11.0866 2.84035 10.9484C2.71723 10.8103 2.62472 10.6476 2.56889 10.4712C2.51305 10.2948 2.49516 10.1085 2.51638 9.9247L3.22338 3.7997C3.2603 3.4798 3.41354 3.18464 3.65394 2.97038C3.89433 2.75612 4.20511 2.63772 4.52713 2.6377ZM1.91963 3.6492C1.99348 3.0094 2.29996 2.41909 2.78075 1.99057C3.26154 1.56205 3.88309 1.32524 4.52713 1.3252H9.47263C10.1167 1.32524 10.7382 1.56205 11.219 1.99057C11.6998 2.41909 12.0063 3.0094 12.0801 3.6492L12.7871 9.7742C12.8296 10.1419 12.7938 10.5143 12.6821 10.8672C12.5704 11.2201 12.3854 11.5453 12.1392 11.8216C11.893 12.0979 11.5911 12.319 11.2534 12.4705C10.9156 12.6219 10.5497 12.7002 10.1796 12.7002H3.82013C3.45002 12.7002 3.08411 12.6219 2.74639 12.4705C2.40868 12.319 2.1068 12.0979 1.86056 11.8216C1.61433 11.5453 1.42931 11.2201 1.31764 10.8672C1.20598 10.5143 1.17019 10.1419 1.21263 9.7742L1.91963 3.6492ZM4.37488 4.60645C4.37488 4.4324 4.44402 4.26548 4.56709 4.14241C4.69016 4.01934 4.85708 3.9502 5.03113 3.9502C5.20518 3.9502 5.3721 4.01934 5.49517 4.14241C5.61824 4.26548 5.68738 4.4324 5.68738 4.60645V4.8252C5.68738 5.17329 5.82566 5.50713 6.0718 5.75327C6.31794 5.99941 6.65178 6.1377 6.99988 6.1377C7.34797 6.1377 7.68181 5.99941 7.92795 5.75327C8.1741 5.50713 8.31238 5.17329 8.31238 4.8252V4.60645C8.31238 4.4324 8.38152 4.26548 8.50459 4.14241C8.62766 4.01934 8.79458 3.9502 8.96863 3.9502C9.14268 3.9502 9.3096 4.01934 9.43267 4.14241C9.55574 4.26548 9.62488 4.4324 9.62488 4.60645V4.8252C9.62488 5.52139 9.34832 6.18907 8.85603 6.68135C8.36375 7.17363 7.69607 7.4502 6.99988 7.4502C6.30368 7.4502 5.636 7.17363 5.14372 6.68135C4.65144 6.18907 4.37488 5.52139 4.37488 4.8252V4.60645Z" fill="#BBBBBB"/>
              </Svg>
              <Text style={[styles.tabText, selectedTab === 'shop' && styles.activeTabText]}>
                Shop and Deliver
              </Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={[styles.tab, selectedTab === 'pickup' && styles.activeTab]}
              //onPress={() => setSelectedTab('pickup')}
            >
              <Svg width="14" height="14" viewBox="0 0 14 15" fill="none">
                <Path d="M2.625 2.34599C2.625 1.69849 3.14417 1.17932 3.79167 1.17932C4.43917 1.17932 4.95833 1.69849 4.95833 2.34599C4.95833 2.99349 4.43917 3.51265 3.79167 3.51265C3.14417 3.51265 2.625 2.99349 2.625 2.34599ZM5.83333 6.40015V5.26265C5.83333 4.62099 5.30833 4.09599 4.66667 4.09599H2.91667C2.275 4.09599 1.75 4.62099 1.75 5.26265V8.76265H2.91667V12.846H4.95833V12.7818C4.235 12.0468 3.79167 11.0377 3.79167 9.92932C3.79167 8.42432 4.61417 7.10599 5.83333 6.40015ZM9.625 9.92932C9.625 10.8918 8.8375 11.6793 7.875 11.6793C6.9125 11.6793 6.125 10.8918 6.125 9.92932C6.125 9.28182 6.48083 8.72765 7 8.42432V7.16432C5.82167 7.53765 4.95833 8.62849 4.95833 9.92932C4.95833 11.5393 6.265 12.846 7.875 12.846C9.485 12.846 10.7917 11.5393 10.7917 9.92932H9.625ZM11.3983 8.17932H8.75V4.67932H7.58333V9.34599H10.7683L12.2092 11.5102L13.1775 10.8627L11.3983 8.17932Z" fill="#06888C"/>
              </Svg>
              <Text style={[styles.tabText, vendor?.availableForShopping && styles.activeTabText]}>
                Pick up
              </Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={[styles.tab, selectedTab === 'delivery' && styles.activeTab]}
              onPress={() => setSelectedTab('delivery')}
            >
              <Svg width="14" height="14" viewBox="0 0 116 27" fill="none">
                <Rect width="116" height="26.0255" rx="13.0127" fill="white"/>
                <Path d="M16.6959 6.02551H10.6088C10.4474 6.02551 10.2925 6.08966 10.1783 6.20384C10.0641 6.31801 10 6.47287 10 6.63435V12.4167C10 12.7533 10.2722 13.0255 10.6088 13.0255H16.6959C16.8572 13.0253 17.0119 12.9611 17.126 12.847C17.24 12.7328 17.3041 12.578 17.3041 12.4167V6.63435C17.3041 6.47298 17.24 6.31822 17.126 6.20406C17.0119 6.0899 16.8572 6.02568 16.6959 6.02551Z" fill="#FFBC44"/>
              </Svg>
              <Text style={[styles.tabText, selectedTab === 'delivery' && styles.activeTabText]}>
                Delivery Person
              </Text>
            </TouchableOpacity> */}
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          </Svg>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Products"
            placeholderTextColor="#7C7B7B"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView style={[styles.scrollView, { backgroundColor: '#FFF' }]} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Products Header */}
          <Text style={styles.productsHeader}>Products ({totalProducts})</Text>

          {/* Products Grid */}
          {isLoadingProducts || isLoadingVendor ? (
            <ActivityIndicator size="large" color="#06888C" style={{ marginVertical: 40 }} />
          ) : (
            <View style={styles.productsGrid}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(renderProduct)
              ) : (
                <Text style={styles.noProductsText}>{searchQuery ? 'No products match your search.' : 'No products found for this store.'}</Text>
              )}
            </View>
          )}

          {/* Pagination */}
          <View style={styles.pagination}>
            <Text style={styles.paginationText}>Showing {showingCount} of {totalProducts}</Text>
            <TouchableOpacity style={styles.nextButton}>
              <Text style={styles.nextText}>Next</Text>
              <Svg width="24" height="24" viewBox="0 0 25 24" fill="none">
                <Path d="M13.3333 16.375L17.5 12M17.5 12L13.3333 7.625M17.5 12H7.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </Svg>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.addProductButton} onPress={handleAddProduct}>
          <Svg width="24" height="24" viewBox="0 0 24 25" fill="none">
            <Path d="M19 13.5H13V19.5H11V13.5H5V11.5H11V5.5H13V11.5H19V13.5Z" fill="white"/>
          </Svg>
          <Text style={styles.addProductText}>Add Product</Text>
        </TouchableOpacity>
        
      </View>
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
    paddingTop: 12,
    paddingBottom: 45,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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
    gap: 4,
    paddingHorizontal: 10,
  },
  storeHeaderMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  storeLogoContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  headerStoreName: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
    maxWidth: '80%',
  },
  headerStoreLogo: {
    width: 24,
    height: 24,
  },
  storeLocation: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: 'rgba(255, 255, 255, 0.8)',
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
    position: 'absolute',
    top: 85,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 20,
    gap: 17,
  },
  tabSection: {
    paddingVertical: 15,
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: '#FFF',
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#FFF',
  },
  tabText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#BBB',
  },
  activeTabText: {
    color: '#000',
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
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#000',
    padding: 0,
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
    paddingTop: 75,
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
    justifyContent: 'flex-start',
    gap: 10,
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
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  discountText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#06888C',
  },
  originalPriceStrikethrough: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#7C7B7B',
    textDecorationLine: 'line-through',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#000',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    opacity: 0.8,
  },
  nextText: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Nunito Sans',
    color: '#000',
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
  publishButton: {
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 16,
    backgroundColor: '#06888C',
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
  publishText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
    lineHeight: 25,
  },
});
