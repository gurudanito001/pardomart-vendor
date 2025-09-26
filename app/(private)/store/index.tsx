import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
import { Path, Svg } from 'react-native-svg';
import EmptyStore from '../../../components/EmptyStore';

export default function StoreScreen() {
  const { empty } = useLocalSearchParams();
  const [hasStores, setHasStores] = useState(true); // For now, defaulting to true, can be connected to real data later
  const [showEmptyState, setShowEmptyState] = useState(false);

  useEffect(() => {
    // If empty parameter is passed, show empty state
    if (empty === 'true') {
      setShowEmptyState(true);
    } else {
      // Check if user actually has stores (this would be from real data/API)
      setShowEmptyState(!hasStores);
    }
  }, [empty, hasStores]);

  const handleGoBack = () => {
    router.back();
  };

  const handleNotifications = () => {
    console.log('Open notifications');
  };

  const handleSupport = () => {
    console.log('Open support');
  };

  const handleStorePress = (storeName: string) => {
    console.log(`Open store: ${storeName}`);
  };

  const handleAddNewStore = () => {
    router.push('/(private)/store/add-store' as any);
  };

  const handleViewUnpublishedStore = () => {
    router.push('/(private)/store/unpublished-store' as any);
  };

  const StoreCard = ({ 
    storeName, 
    address, 
    onPress 
  }: {
    storeName: string;
    address: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity style={styles.storeCard} onPress={onPress}>
      <View style={styles.storeCardContent}>
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: 'https://api.builder.io/api/v1/image/assets/TEMP/9d36f317a6f8107bd18c045ccb4b42f2bad7ba6f?width=120' }}
            style={styles.storeLogo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.storeInfo}>
          <Text style={styles.storeName}>{storeName}</Text>
          <Text style={styles.storeAddress}>{address}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const AddStoreCard = ({ onPress }: { onPress: () => void }) => (
    <TouchableOpacity style={styles.addStoreCard} onPress={onPress}>
      <View style={styles.addStoreContent}>
        {/* Plus Icon */}
        <Svg width="48" height="48" viewBox="0 0 49 48" fill="none">
          <Path d="M38.5 25.996H26.5V37.996H22.5V25.996H10.5V21.996H22.5V9.99597H26.5V21.996H38.5V25.996Z" fill="black"/>
        </Svg>
        <Text style={styles.addStoreText}>Add new store</Text>
      </View>
    </TouchableOpacity>
  );

  // If showing empty state, render EmptyStore component
  if (showEmptyState) {
    return (
      <EmptyStore
        onGoBack={handleGoBack}
        onNotifications={handleNotifications}
        onSupport={handleSupport}
      />
    );
  }

  // Otherwise, render populated store content
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#06888C" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.leftSection}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              {/* Back Arrow Icon */}
              <Svg width="30" height="30" viewBox="0 0 31 30" fill="none">
                <Path d="M20.1278 21.993C20.3661 22.2135 20.5 22.5125 20.5 22.8243C20.5 23.1361 20.3661 23.4352 20.1278 23.6556C19.8895 23.8761 19.5662 24 19.2292 24C18.8921 24 18.5689 23.8761 18.3306 23.6556L9.87313 15.8313C9.75486 15.7223 9.66102 15.5927 9.59699 15.4501C9.53296 15.3074 9.5 15.1545 9.5 15C9.5 14.8455 9.53296 14.6926 9.59699 14.5499C9.66102 14.4073 9.75486 14.2777 9.87313 14.1687L18.3306 6.34435C18.5689 6.12387 18.8921 6 19.2292 6C19.5662 6 19.8895 6.12387 20.1278 6.34435C20.3661 6.56483 20.5 6.86387 20.5 7.17568C20.5 7.48749 20.3661 7.78653 20.1278 8.00702L12.57 14.999L20.1278 21.993Z" fill="white"/>
              </Svg>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Store</Text>
          </View>
          <View style={styles.rightSection}>
            <TouchableOpacity style={styles.iconButton} onPress={handleNotifications}>
              {/* Notification Bell Icon */}
              <Svg width="24" height="24" viewBox="0 0 25 24" fill="none">
                <Path d="M9.145 20.5C9.36103 21.2219 9.80417 21.8549 10.4086 22.3049C11.013 22.755 11.7464 22.998 12.5 22.998C13.2536 22.998 13.987 22.755 14.5914 22.3049C15.1958 21.8549 15.639 21.2219 15.855 20.5H9.145ZM3.5 19.5H21.5V16.5L19.5 13.5V8.5C19.5 7.58075 19.3189 6.6705 18.9672 5.82122C18.6154 4.97194 18.0998 4.20026 17.4497 3.55025C16.7997 2.90024 16.0281 2.38463 15.1788 2.03284C14.3295 1.68106 13.4193 1.5 12.5 1.5C11.5807 1.5 10.6705 1.68106 9.82122 2.03284C8.97194 2.38463 8.20026 2.90024 7.55025 3.55025C6.90024 4.20026 6.38463 4.97194 6.03284 5.82122C5.68106 6.6705 5.5 7.58075 5.5 8.5V13.5L3.5 16.5V19.5Z" fill="white"/>
              </Svg>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleSupport}>
              {/* Support Icon */}
              <Svg width="24" height="24" viewBox="0 0 25 24" fill="none">
                <Path fillRule="evenodd" clipRule="evenodd" d="M20.3 10.18C19.99 7.00002 18.11 2 12.3 2C6.49002 2 4.61001 7.00002 4.30002 10.18C3.21252 10.5927 2.4952 11.6368 2.50002 12.8V14.2C2.50002 15.7464 3.75365 17 5.30001 17C6.84642 17 8.10004 15.7464 8.10004 14.2V12.8C8.09498 11.6619 7.40404 10.6393 6.35001 10.21C6.55002 8.36998 7.53004 4.00002 12.3 4.00002C17.07 4.00002 18.04 8.36998 18.24 10.21C17.1882 10.6402 16.5007 11.6636 16.5 12.8V14.2C16.5022 14.7269 16.6524 15.2425 16.9335 15.6881C17.2147 16.1337 17.6154 16.4913 18.09 16.72C17.67 17.51 16.6 18.58 13.97 18.9C13.4443 18.1017 12.4272 17.787 11.5424 18.1489C10.6578 18.5108 10.1528 19.4481 10.3373 20.386C10.5218 21.3239 11.3442 22 12.3 22C12.6704 21.9979 13.0329 21.8931 13.3472 21.6971C13.6615 21.5011 13.9152 21.2217 14.08 20.89C18.37 20.4 19.74 18.19 20.17 16.89C21.3333 16.5132 22.1157 15.4227 22.1 14.2V12.8C22.1048 11.6368 21.3875 10.5927 20.3 10.18ZM6.10002 14.2C6.10002 14.6418 5.74185 15 5.30001 15C4.85816 15 4.50004 14.6419 4.50004 14.2V12.8C4.49923 12.6944 4.51933 12.5897 4.55917 12.492C4.59901 12.3942 4.65781 12.3053 4.73217 12.2304C4.80654 12.1554 4.895 12.0959 4.99247 12.0553C5.08993 12.0148 5.19446 11.9939 5.30003 11.9939C5.40561 11.9939 5.51014 12.0148 5.6076 12.0553C5.70506 12.0959 5.79352 12.1554 5.86789 12.2304C5.94226 12.3053 6.00105 12.3942 6.0409 12.492C6.08074 12.5897 6.10083 12.6944 6.10002 12.8V14.2ZM18.5 12.8C18.5 12.3582 18.8582 12 19.3 12C19.7419 12 20.1 12.3582 20.1 12.8V14.2C20.1 14.6418 19.7419 15 19.3 15C18.8582 15 18.5 14.6419 18.5 14.2V12.8Z" fill="white"/>
              </Svg>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Stores Count */}
          <Text style={styles.storesCount}>You have 4 stores added</Text>

          {/* Store Cards Grid */}
          <View style={styles.storeGrid}>
            {/* First Row */}
            <View style={styles.storeRow}>
              <StoreCard
                storeName="Jewel Osco"
                address="wallgreaan lane 1234 Wesbromich, New York, 06675"
                onPress={() => handleStorePress('Jewel Osco 1')}
              />
              <StoreCard
                storeName="Jewel Osco"
                address="lane 1234 Wesbromich, Southside"
                onPress={() => handleStorePress('Jewel Osco 2')}
              />
            </View>

            {/* Second Row */}
            <View style={styles.storeRow}>
              <StoreCard
                storeName="Jewel Osco"
                address="Wesbromich, New York, 06675 454miles"
                onPress={() => handleStorePress('Jewel Osco 3')}
              />
              <StoreCard
                storeName="Jewel Osco"
                address="southsid3e wlassgreenn newyork 6654"
                onPress={() => handleStorePress('Jewel Osco 4')}
              />
            </View>

            {/* Third Row */}
            <View style={styles.storeRow}>
              <TouchableOpacity style={styles.unpublishedStoreCard} onPress={handleViewUnpublishedStore}>
                <View style={styles.storeCardContent}>
                  <View style={styles.logoContainer}>
                    <Image
                      source={{ uri: 'https://api.builder.io/api/v1/image/assets/TEMP/9d36f317a6f8107bd18c045ccb4b42f2bad7ba6f?width=120' }}
                      style={styles.storeLogo}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={styles.storeInfo}>
                    <Text style={styles.storeName}>Jewel Osco</Text>
                    <Text style={styles.storeAddress}>Unpublished Store - View Products</Text>
                    <View style={styles.unpublishedBadge}>
                      <Text style={styles.unpublishedText}>UNPUBLISHED</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <View style={{ flex: 1 }} />
            </View>

            {/* Add Store Card */}
            <View style={styles.addStoreRow}>
              <AddStoreCard onPress={handleAddNewStore} />
            </View>
          </View>

          {/* Add New Store Button */}
          <TouchableOpacity style={styles.addStoreButton} onPress={handleAddNewStore}>
            <Text style={styles.addStoreButtonText}>Add a new Store</Text>
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
    paddingVertical: 19,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    paddingHorizontal: 20,
    paddingTop: 21,
    paddingBottom: 30,
  },
  storesCount: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#000',
    marginBottom: 29,
  },
  storeGrid: {
    gap: 24,
    marginBottom: 29,
  },
  storeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 21,
  },
  addStoreRow: {
    flexDirection: 'row',
  },
  storeCard: {
    flex: 1,
    padding: 25,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#06888C',
    backgroundColor: '#FFF',
    shadowColor: 'rgba(0, 0, 0, 0.10)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 3,
  },
  storeCardContent: {
    alignItems: 'center',
    gap: 19,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(6, 136, 140, 0.20)',
    backgroundColor: '#FFEBF0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeLogo: {
    width: 60,
    height: 60,
  },
  storeInfo: {
    alignItems: 'center',
    gap: 5,
    width: '100%',
  },
  storeName: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#000',
    textAlign: 'center',
  },
  storeAddress: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#484C52',
    textAlign: 'center',
    lineHeight: 14,
  },
  addStoreCard: {
    width: 185,
    height: 185,
    padding: 44,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(6, 136, 140, 0.50)',
    backgroundColor: '#F0F8F8',
    shadowColor: 'rgba(0, 0, 0, 0.10)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 3,
  },
  addStoreContent: {
    flex: 1,
    alignItems: 'center',
    gap: 12,
    justifyContent: 'center',
  },
  addStoreText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#000',
    textAlign: 'center',
  },
  addStoreButton: {
    height: 55,
    paddingVertical: 14,
    paddingHorizontal: 50,
    backgroundColor: '#06888C',
    borderRadius: 16,
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
  addStoreButtonText: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 25,
  },
  unpublishedStoreCard: {
    flex: 1,
    padding: 25,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F8BB15',
    backgroundColor: '#FFF',
    shadowColor: 'rgba(0, 0, 0, 0.10)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 3,
  },
  unpublishedBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    backgroundColor: '#F8BB15',
    alignSelf: 'center',
    marginTop: 4,
  },
  unpublishedText: {
    fontSize: 8,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
    textAlign: 'center',
  },
});
