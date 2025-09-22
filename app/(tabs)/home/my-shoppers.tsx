import { router } from 'expo-router';
import React from 'react';
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
import { Shopper } from '../../../types';

const MOCK_SHOPPERS: Shopper[] = [
  {
    id: '1',
    name: 'Mr Damilare Adebanjo',
    email: 'damilareadebanjo@gmail.com',
    phone: '+1 334 654 7788',
    storeAddress: '450 South Cradle Avenue, Chicago, IL',
    avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/1bea040750218d3fdbc0ef403ead8ea0f54d8666?width=80',
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Magrett Kingsley',
    email: 'damilareadebanjo@gmail.com',
    phone: '+1 334 654 7788',
    storeAddress: '450 South Cradle Avenue, Chicago, IL',
    avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/315a699410d8266b1cbfe1bf02c157b1f5fbdf8e?width=80',
    isAvailable: false,
  },
  {
    id: '3',
    name: 'Magrett Kingsley',
    email: 'damilareadebanjo@gmail.com',
    phone: '+1 334 654 7788',
    storeAddress: '450 South Cradle Avenue, Chicago, IL',
    avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/9cf7b3b8fed76dfbce2039d84b4bd4f49092511c?width=80',
    isAvailable: false,
  },
  {
    id: '4',
    name: 'Mr Damilare Adebanjo',
    email: 'damilareadebanjo@gmail.com',
    phone: '+1 334 654 7788',
    storeAddress: '450 South Cradle Avenue, Chicago, IL',
    avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/707685744fbf9f683d115b2e220d4a5c5ba01120?width=80',
    isAvailable: true,
  },
  {
    id: '5',
    name: 'Mr Damilare Adebanjo',
    email: 'damilareadebanjo@gmail.com',
    phone: '+1 334 654 7788',
    storeAddress: '450 South Cradle Avenue, Chicago, IL',
    avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/2c283f2455d3b129279a409cc19b9c93b9eb66c0?width=80',
    isAvailable: true,
  },
];

export default function MyShoppersScreen() {
  const handleGoBack = () => {
    router.back();
  };

  const handleNotifications = () => {
    console.log('Open notifications');
  };

  const handleSupport = () => {
    console.log('Open support');
  };

  const handleShopperPress = (shopperId: string) => {
    router.push(`/(tabs)/home/view-shopper?shopperId=${shopperId}`);
  };

  const handleAddShopper = () => {
    console.log('Add new shopper');
    // Navigate to add shopper page
  };

  const ShopperCard = ({ shopper }: { shopper: Shopper }) => (
    <TouchableOpacity 
      style={styles.shopperCard} 
      onPress={() => handleShopperPress(shopper.id)}
    >
      <View style={styles.shopperContent}>
        <Image 
          source={{ uri: shopper.avatar }}
          style={styles.shopperAvatar}
        />
        <View style={styles.shopperInfo}>
          <View style={styles.shopperDetails}>
            <Text style={styles.shopperName}>{shopper.name}</Text>
            <View style={[
              styles.statusBadge, 
              shopper.isAvailable ? styles.availableBadge : styles.unavailableBadge
            ]}>
              <Text style={[
                styles.statusText,
                shopper.isAvailable ? styles.availableText : styles.unavailableText
              ]}>
                {shopper.isAvailable ? 'Available' : 'Not available'}
              </Text>
            </View>
          </View>
          <svg width="7" height="13" viewBox="0 0 7 13" fill="none">
            <path d="M0.866949 12.4985C0.66474 12.4988 0.468777 12.4292 0.313076 12.3017C0.225444 12.2299 0.153007 12.1418 0.0999113 12.0423C0.0468157 11.9428 0.0141058 11.8339 0.00365506 11.7219C-0.0067957 11.6098 0.00521815 11.4969 0.0390082 11.3895C0.0727983 11.2821 0.1277 11.1823 0.200571 11.0958L4.07768 6.51173L0.339039 1.91906C0.267152 1.83158 0.213468 1.73092 0.181074 1.62286C0.148679 1.51481 0.138213 1.4015 0.150276 1.28944C0.16234 1.17738 0.196694 1.06878 0.251367 0.969879C0.306039 0.870982 0.379951 0.783737 0.468853 0.713159C0.558395 0.635301 0.663255 0.576573 0.776853 0.540662C0.89045 0.504751 1.01033 0.492432 1.12898 0.504478C1.24762 0.516525 1.36246 0.552676 1.4663 0.610663C1.57014 0.66865 1.66072 0.747221 1.73237 0.841446L5.91238 5.97292C6.03967 6.12596 6.10925 6.31791 6.10925 6.51601C6.10925 6.7141 6.03967 6.90606 5.91238 7.05909L1.58525 12.1906C1.49843 12.2941 1.38815 12.3759 1.26335 12.4294C1.13854 12.4829 1.00274 12.5065 0.866949 12.4985Z" fill="#333333"/>
          </svg>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#06888C" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.leftSection}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M19.6278 21.993C19.8661 22.2135 20 22.5125 20 22.8243C20 23.1361 19.8661 23.4352 19.6278 23.6556C19.3895 23.8761 19.0662 24 18.7292 24C18.3921 24 18.0689 23.8761 17.8306 23.6556L9.37313 15.8313C9.25486 15.7223 9.16102 15.5927 9.09699 15.4501C9.03296 15.3074 9 15.1545 9 15C9 14.8455 9.03296 14.6926 9.09699 14.5499C9.16102 14.4073 9.25486 14.2777 9.37313 14.1687L17.8306 6.34435C18.0689 6.12387 18.3921 6 18.7292 6C19.0662 6 19.3895 6.12387 19.6278 6.34435C19.8661 6.56483 20 6.86387 20 7.17568C20 7.48749 19.8661 7.78653 19.6278 8.00702L12.07 14.999L19.6278 21.993Z" fill="white"/>
              </svg>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Shoppers</Text>
          </View>
          <View style={styles.rightSection}>
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

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Shoppers Count */}
          <Text style={styles.shoppersCount}>You have 5 shoppers</Text>

          {/* Shoppers List */}
          <View style={styles.shoppersList}>
            {MOCK_SHOPPERS.map((shopper) => (
              <ShopperCard key={shopper.id} shopper={shopper} />
            ))}
          </View>

          {/* Add Shopper Button */}
          <TouchableOpacity style={styles.addShopperButton} onPress={handleAddShopper}>
            <Text style={styles.addShopperText}>Add Shopper</Text>
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
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  leftSection: {
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
  rightSection: {
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 21,
    paddingTop: 24,
    paddingBottom: 30,
  },
  shoppersCount: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#000',
    marginBottom: 20,
  },
  shoppersList: {
    gap: 10,
    marginBottom: 48,
  },
  shopperCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  shopperContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  shopperAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  shopperInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shopperDetails: {
    flex: 1,
    gap: 3,
  },
  shopperName: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#000',
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  availableBadge: {
    backgroundColor: 'rgba(44, 175, 11, 0.15)',
  },
  unavailableBadge: {
    backgroundColor: 'rgba(137, 138, 141, 0.15)',
  },
  statusText: {
    fontSize: 8,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  availableText: {
    color: '#2CAF0B',
  },
  unavailableText: {
    color: '#898A8D',
  },
  addShopperButton: {
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
  addShopperText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
    lineHeight: 25,
  },
});
