import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountPrice?: number;
  size: string;
  image: string;
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'celcius life Fit Zero Sugar Essentials ....',
    price: 3.78,
    size: '16 fl oz',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/73ef3ace6cb9e3da41717958fab761f4422f0ed4?width=216',
  },
  {
    id: '2',
    name: 'celcius life Fit Zero Sugar Essentials ....',
    price: 3.78,
    originalPrice: 3.78,
    discountPrice: 0.89,
    size: '16 fl oz',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/a44c4cd4c79fe841be67a1e84d911471ffaf8827?width=210',
  },
  {
    id: '3',
    name: 'celcius life Fit Zero Sugar Essentials ....',
    price: 3.78,
    size: '16 fl oz',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/2a5cee148104ad29fdebca65e2d500762eea50a8?width=140',
  },
];

export default function UnpublishedStoreScreen() {
  const [selectedTab, setSelectedTab] = useState('pickup');
  const [searchQuery, setSearchQuery] = useState('');

  const handleGoBack = () => {
    router.back();
  };

  const handleNotifications = () => {
    console.log('Open notifications');
  };

  const handleSupport = () => {
    console.log('Open support');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Search for:', query);
  };

  const handleAddProduct = () => {
    console.log('Add new product');
    // Navigate to add product screen
    router.push('/(tabs)/store/add-product');
  };

  const handlePublishStore = () => {
    console.log('Publishing store...');
    // Handle store publishing
  };

  const renderProduct = (product: Product) => (
    <View key={product.id} style={styles.productCard}>
      <View style={styles.productImageContainer}>
        <Image 
          source={{ uri: product.image }}
          style={styles.productImage}
          resizeMode="contain"
        />
      </View>
      <View style={styles.productDetails}>
        <View style={styles.priceContainer}>
          {product.discountPrice && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>${product.discountPrice}</Text>
            </View>
          )}
          <Text style={styles.productPrice}>${product.price}</Text>
        </View>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.productSize}>{product.size}</Text>
      </View>
    </View>
  );

  const renderProductRow = (products: Product[], startIndex: number) => (
    <View key={startIndex} style={styles.productRow}>
      {products.slice(startIndex, startIndex + 3).map(renderProduct)}
    </View>
  );

  // Create an array with 9 products (3 rows of 3)
  const allProducts = [
    ...MOCK_PRODUCTS,
    ...MOCK_PRODUCTS,
    ...MOCK_PRODUCTS,
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#06888C" />
      
      {/* Extended Header Background */}
      <View style={styles.extendedHeader}>
        {/* Header Content */}
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <path d="M19.6278 21.993C19.8661 22.2135 20 22.5125 20 22.8243C20 23.1361 19.8661 23.4352 19.6278 23.6556C19.3895 23.8761 19.0662 24 18.7292 24C18.3921 24 18.0689 23.8761 17.8306 23.6556L9.37313 15.8313C9.25486 15.7223 9.16102 15.5927 9.09699 15.4501C9.03296 15.3074 9 15.1545 9 15C9 14.8455 9.03296 14.6926 9.09699 14.5499C9.16102 14.4073 9.25486 14.2777 9.37313 14.1687L17.8306 6.34435C18.0689 6.12387 18.3921 6 18.7292 6C19.0662 6 19.3895 6.12387 19.6278 6.34435C19.8661 6.56483 20 6.86387 20 7.17568C20 7.48749 19.8661 7.78653 19.6278 8.00702L12.07 14.999L19.6278 21.993Z" fill="white"/>
            </svg>
          </TouchableOpacity>

          <View style={styles.storeInfoSection}>
            <View style={styles.storeLogoContainer}>
              <Image
                source={{ uri: 'https://api.builder.io/api/v1/image/assets/TEMP/9d36f317a6f8107bd18c045ccb4b42f2bad7ba6f?width=120' }}
                style={styles.headerStoreLogo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.storeLocation}>Wesside 120 ny jersey 2.5 Miles</Text>
          </View>

          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={handleNotifications}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M8.645 20.5C8.86103 21.2219 9.30417 21.8549 9.90858 22.3049C10.513 22.755 11.2464 22.998 12 22.998C12.7536 22.998 13.487 22.755 14.0914 22.3049C14.6958 21.8549 15.139 21.2219 15.355 20.5H8.645ZM3 19.5H21V16.5L19 13.5V8.5C19 7.58075 18.8189 6.6705 18.4672 5.82122C18.1154 4.97194 17.5998 4.20026 16.9497 3.55025C16.2997 2.90024 15.5281 2.38463 14.6788 2.03284C13.8295 1.68106 12.9193 1.5 12 1.5C11.0807 1.5 10.1705 1.68106 9.32122 2.03284C8.47194 2.38463 7.70026 2.90024 7.05025 3.55025C6.40024 4.20026 5.88463 4.97194 5.53284 5.82122C5.18106 6.6705 5 7.58075 5 8.5V13.5L3 16.5V19.5Z" fill="white"/>
              </svg>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleSupport}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M19.8 10.18C19.49 7.00002 17.61 2 11.8 2C5.99002 2 4.11001 7.00002 3.80002 10.18C2.71252 10.5927 1.9952 11.6368 2.00002 12.8V14.2C2.00002 15.7464 3.25365 17 4.80001 17C6.34642 17 7.60004 15.7464 7.60004 14.2V12.8C7.59498 11.6619 6.90404 10.6393 5.85001 10.21C6.05002 8.36998 7.03004 4.00002 11.8 4.00002C16.57 4.00002 17.54 8.36998 17.74 10.21C16.6882 10.6402 16.0007 11.6636 16 12.8V14.2C16.0022 14.7269 16.1524 15.2425 16.4335 15.6881C16.7147 16.1337 17.1154 16.4913 17.59 16.72C17.17 17.51 16.1 18.58 13.47 18.9C12.9443 18.1017 11.9272 17.787 11.0424 18.1489C10.1578 18.5108 9.65279 19.4481 9.83729 20.386C10.0218 21.3239 10.8442 22 11.8 22C12.1704 21.9979 12.5329 21.8931 12.8472 21.6971C13.1615 21.5011 13.4152 21.2217 13.58 20.89C17.87 20.4 19.24 18.19 19.67 16.89C20.8333 16.5132 21.6157 15.4227 21.6 14.2V12.8C21.6048 11.6368 20.8875 10.5927 19.8 10.18ZM5.60002 14.2C5.60002 14.6418 5.24185 15 4.80001 15C4.35816 15 4.00004 14.6419 4.00004 14.2V12.8C3.99923 12.6944 4.01933 12.5897 4.05917 12.492C4.09901 12.3942 4.15781 12.3053 4.23217 12.2304C4.30654 12.1554 4.395 12.0959 4.49247 12.0553C4.58993 12.0148 4.69446 11.9939 4.80003 11.9939C4.90561 11.9939 5.01014 12.0148 5.1076 12.0553C5.20506 12.0959 5.29352 12.1554 5.36789 12.2304C5.44226 12.3053 5.50105 12.3942 5.5409 12.492C5.58074 12.5897 5.60083 12.6944 5.60002 12.8V14.2ZM18 12.8C18 12.3582 18.3582 12 18.8 12C19.2419 12 19.6 12.3582 19.6 12.8V14.2C19.6 14.6418 19.2419 15 18.8 15C18.3582 15 18 14.6419 18 14.2V12.8Z" fill="white"/>
              </svg>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Overlay Container for Tab Section and Search */}
      <View style={styles.overlayContainer}>
        {/* Tab Section - Positioned Absolutely */}
        <View style={styles.tabSection}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'shop' && styles.activeTab]}
              onPress={() => setSelectedTab('shop')}
            >
              <svg width="14" height="14" viewBox="0 0 14 15" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M4.52713 2.6377H9.47263C9.79465 2.63772 10.1054 2.75612 10.3458 2.97038C10.5862 3.18464 10.7395 3.4798 10.7764 3.7997L11.4834 9.9247C11.5046 10.1085 11.4867 10.2948 11.4309 10.4712C11.375 10.6476 11.2825 10.8103 11.1594 10.9484C11.0363 11.0866 10.8854 11.1971 10.7165 11.2728C10.5476 11.3485 10.3647 11.3877 10.1796 11.3877H3.82013C3.63507 11.3877 3.45212 11.3485 3.28326 11.2728C3.1144 11.1971 2.96346 11.0866 2.84035 10.9484C2.71723 10.8103 2.62472 10.6476 2.56889 10.4712C2.51305 10.2948 2.49516 10.1085 2.51638 9.9247L3.22338 3.7997C3.2603 3.4798 3.41354 3.18464 3.65394 2.97038C3.89433 2.75612 4.20511 2.63772 4.52713 2.6377ZM1.91963 3.6492C1.99348 3.0094 2.29996 2.41909 2.78075 1.99057C3.26154 1.56205 3.88309 1.32524 4.52713 1.3252H9.47263C10.1167 1.32524 10.7382 1.56205 11.219 1.99057C11.6998 2.41909 12.0063 3.0094 12.0801 3.6492L12.7871 9.7742C12.8296 10.1419 12.7938 10.5143 12.6821 10.8672C12.5704 11.2201 12.3854 11.5453 12.1392 11.8216C11.893 12.0979 11.5911 12.319 11.2534 12.4705C10.9156 12.6219 10.5497 12.7002 10.1796 12.7002H3.82013C3.45002 12.7002 3.08411 12.6219 2.74639 12.4705C2.40868 12.319 2.1068 12.0979 1.86056 11.8216C1.61433 11.5453 1.42931 11.2201 1.31764 10.8672C1.20598 10.5143 1.17019 10.1419 1.21263 9.7742L1.91963 3.6492ZM4.37488 4.60645C4.37488 4.4324 4.44402 4.26548 4.56709 4.14241C4.69016 4.01934 4.85708 3.9502 5.03113 3.9502C5.20518 3.9502 5.3721 4.01934 5.49517 4.14241C5.61824 4.26548 5.68738 4.4324 5.68738 4.60645V4.8252C5.68738 5.17329 5.82566 5.50713 6.0718 5.75327C6.31794 5.99941 6.65178 6.1377 6.99988 6.1377C7.34797 6.1377 7.68181 5.99941 7.92795 5.75327C8.1741 5.50713 8.31238 5.17329 8.31238 4.8252V4.60645C8.31238 4.4324 8.38152 4.26548 8.50459 4.14241C8.62766 4.01934 8.79458 3.9502 8.96863 3.9502C9.14268 3.9502 9.3096 4.01934 9.43267 4.14241C9.55574 4.26548 9.62488 4.4324 9.62488 4.60645V4.8252C9.62488 5.52139 9.34832 6.18907 8.85603 6.68135C8.36375 7.17363 7.69607 7.4502 6.99988 7.4502C6.30368 7.4502 5.636 7.17363 5.14372 6.68135C4.65144 6.18907 4.37488 5.52139 4.37488 4.8252V4.60645Z" fill="#BBBBBB"/>
              </svg>
              <Text style={[styles.tabText, selectedTab === 'shop' && styles.activeTabText]}>
                Shop and Deliver
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, selectedTab === 'pickup' && styles.activeTab]}
              onPress={() => setSelectedTab('pickup')}
            >
              <svg width="14" height="14" viewBox="0 0 14 15" fill="none">
                <path d="M2.625 2.34599C2.625 1.69849 3.14417 1.17932 3.79167 1.17932C4.43917 1.17932 4.95833 1.69849 4.95833 2.34599C4.95833 2.99349 4.43917 3.51265 3.79167 3.51265C3.14417 3.51265 2.625 2.99349 2.625 2.34599ZM5.83333 6.40015V5.26265C5.83333 4.62099 5.30833 4.09599 4.66667 4.09599H2.91667C2.275 4.09599 1.75 4.62099 1.75 5.26265V8.76265H2.91667V12.846H4.95833V12.7818C4.235 12.0468 3.79167 11.0377 3.79167 9.92932C3.79167 8.42432 4.61417 7.10599 5.83333 6.40015ZM9.625 9.92932C9.625 10.8918 8.8375 11.6793 7.875 11.6793C6.9125 11.6793 6.125 10.8918 6.125 9.92932C6.125 9.28182 6.48083 8.72765 7 8.42432V7.16432C5.82167 7.53765 4.95833 8.62849 4.95833 9.92932C4.95833 11.5393 6.265 12.846 7.875 12.846C9.485 12.846 10.7917 11.5393 10.7917 9.92932H9.625ZM11.3983 8.17932H8.75V4.67932H7.58333V9.34599H10.7683L12.2092 11.5102L13.1775 10.8627L11.3983 8.17932Z" fill="#06888C"/>
              </svg>
              <Text style={[styles.tabText, selectedTab === 'pickup' && styles.activeTabText]}>
                Pick up
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, selectedTab === 'delivery' && styles.activeTab]}
              onPress={() => setSelectedTab('delivery')}
            >
              <svg width="14" height="14" viewBox="0 0 116 27" fill="none">
                <rect width="116" height="26.0255" rx="13.0127" fill="white"/>
                <path d="M16.6959 6.02551H10.6088C10.4474 6.02551 10.2925 6.08966 10.1783 6.20384C10.0641 6.31801 10 6.47287 10 6.63435V12.4167C10 12.7533 10.2722 13.0255 10.6088 13.0255H16.6959C16.8572 13.0253 17.0119 12.9611 17.126 12.847C17.24 12.7328 17.3041 12.578 17.3041 12.4167V6.63435C17.3041 6.47298 17.24 6.31822 17.126 6.20406C17.0119 6.0899 16.8572 6.02568 16.6959 6.02551Z" fill="#FFBC44"/>
              </svg>
              <Text style={[styles.tabText, selectedTab === 'delivery' && styles.activeTabText]}>
                Delivery Person
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M13.2353 13.9318C13.1474 13.9314 13.0605 13.9135 12.9797 13.8791C12.8988 13.8448 12.8256 13.7947 12.7643 13.7318L10.3153 11.2828C9.05417 12.3026 7.44984 12.7998 5.83303 12.6717C4.21621 12.5437 2.71014 11.8002 1.62528 10.5946C0.540426 9.38894 -0.0405212 7.81302 0.00219959 6.1917C0.0449203 4.57038 0.708053 3.02725 1.85489 1.88041C3.00174 0.733565 4.54487 0.070433 6.16619 0.0277123C7.78751 -0.0150085 9.36342 0.565939 10.5691 1.65079C11.7747 2.73565 12.5182 4.24172 12.6462 5.85854C12.7743 7.47536 12.2771 9.07968 11.2573 10.3408L13.7063 12.7898C13.7994 12.8829 13.8629 13.0016 13.8886 13.1308C13.9143 13.26 13.9011 13.394 13.8507 13.5157C13.8003 13.6374 13.7149 13.7414 13.6054 13.8146C13.4958 13.8878 13.367 13.9268 13.2353 13.9268V13.9318ZM6.33227 1.36478C5.34336 1.36478 4.37667 1.65803 3.55442 2.20744C2.73217 2.75684 2.09131 3.53774 1.71287 4.45137C1.33444 5.365 1.23542 6.37033 1.42834 7.34024C1.62127 8.31014 2.09747 9.20106 2.79674 9.90032C3.496 10.5996 4.38691 11.0758 5.35682 11.2687C6.32672 11.4616 7.33206 11.3626 8.24569 10.9842C9.15932 10.6057 9.94021 9.96488 10.4896 9.14264C11.039 8.32039 11.3323 7.35369 11.3323 6.36478C11.3307 5.03919 10.8034 3.76834 9.86605 2.831C8.92871 1.89367 7.65787 1.36637 6.33227 1.36478Z" fill="black"/>
          </svg>
          <Text style={styles.searchPlaceholder}>Search Products</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Products Header */}
          <Text style={styles.productsHeader}>Products (423)</Text>

          {/* Products Grid */}
          <View style={styles.productsGrid}>
            {Array.from({ length: 3 }, (_, rowIndex) => (
              renderProductRow(allProducts, rowIndex * 3)
            ))}
          </View>

          {/* Pagination */}
          <View style={styles.pagination}>
            <Text style={styles.paginationText}>Showing 1-10 of 20</Text>
            <TouchableOpacity style={styles.nextButton}>
              <Text style={styles.nextText}>Next</Text>
              <svg width="24" height="24" viewBox="0 0 25 24" fill="none">
                <path d="M13.3333 16.375L17.5 12M17.5 12L13.3333 7.625M17.5 12H7.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.addProductButton} onPress={handleAddProduct}>
          <svg width="24" height="24" viewBox="0 0 24 25" fill="none">
            <path d="M19 13.5H13V19.5H11V13.5H5V11.5H11V5.5H13V11.5H19V13.5Z" fill="white"/>
          </svg>
          <Text style={styles.addProductText}>Add Product</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.publishButton} onPress={handlePublishStore}>
          <Text style={styles.publishText}>Publish Store</Text>
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
    paddingTop: 20,
    paddingBottom: 91,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
    gap: 10,
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
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 20,
    gap: 17,
  },
  tabSection: {
    paddingTop: 5,
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
    gap: 30,
    marginBottom: 30,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  productCard: {
    width: 120,
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
