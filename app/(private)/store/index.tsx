import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Path, Svg } from 'react-native-svg';
import EmptyStore from '../../../components/EmptyStore';
import { useAuth } from '../../../context/AppProvider';
import { useVendors } from '../../../hooks/api/useVendors';

export default function StoreScreen() {
  const { empty } = useLocalSearchParams();
  const { state: authState } = useAuth();
  const userId = authState.user?.id;

  const [refreshing, setRefreshing] = React.useState(false);

  const { fetchVendors } = useVendors();

  const { 
    data: vendorsData, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['vendors', 'management', userId],
    queryFn: () => fetchVendors({ 
      userId, 
      page: 1, 
      size: 20, 
      // Ensure we explicitly request both published and unpublished
      isPublished: undefined 
    } as any),
    enabled: !!userId && authState.isReady,
  });

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleGoBack = () => {
    router.back();
  };

  const handleNotifications = () => {};

  const handleSupport = () => {
    console.log('Open support');
  };

  const handleStorePress = (vendorId: string) => {
    // Navigate to a screen that can use the storeId to fetch details
    router.push(`/(private)/store/store-homepage?storeId=${vendorId}`);
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
    image,
    onPress,
    isPublished
  }: {
    storeName: string;
    address: string;
    image: string;
    isPublished?: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity 
      style={[styles.storeCard, !isPublished && styles.unpublishedStoreCard]} 
      onPress={onPress}
    >
      <View style={styles.storeCardContent}>
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: image }}
            style={styles.storeLogo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.storeInfo}>
          <Text style={styles.storeName}>{storeName}</Text>
          <Text style={styles.storeAddress}>{address}</Text>
          {!isPublished && (
            <View style={styles.unpublishedBadge}>
              <Text style={styles.unpublishedText}>Unpublished</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const vendors = vendorsData?.data ?? [];
  const totalStores = vendorsData?.totalCount ?? 0;
  const isEmpty = !isLoading && totalStores === 0;
  const isInitialLoading = isLoading && vendors.length === 0;

  // Empty state
  if (empty === 'true' || isEmpty) {
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
    <SafeAreaView style={[styles.container, { backgroundColor: '#06888C' }]} edges={['top', 'left', 'right']}>
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
            <Text style={styles.headerTitle}>My Stores</Text>
          </View>
          {/* <View style={styles.rightSection}>
            <NotificationBell from="/(private)/store" />
          </View> */}
        </View>
      </View>

      <ScrollView 
        style={[styles.scrollView, { backgroundColor: '#FFF' }]} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#06888C']}
            tintColor="#06888C"
          />
        }
      >
        <View style={styles.content}>
          {/* Stores Count */}
          <Text style={styles.storesCount}>You have {totalStores} {totalStores === 1 ? 'store' : 'stores'} added</Text>

          {/* Store Cards Grid (dynamic) */}
          <View style={styles.storeGrid}>
            {isInitialLoading ? (
              <ActivityIndicator size="large" color="#06888C" style={{ marginTop: 40 }} />
            ) : (
              Array.from({ length: Math.ceil(vendors.length / 2) }).map((_, rowIndex) => (
                <View key={rowIndex} style={styles.storeRow}>
                  {vendors.slice(rowIndex * 2, rowIndex * 2 + 2).map((vendor) => {
                    const name = vendor.name || 'Unnamed Store';
                    const address = vendor.address || '';
                    const image = vendor.image || 'https://api.builder.io/api/v1/image/assets/TEMP/9d36f317a6f8107bd18c045ccb4b42f2bad7ba6f?width=120';
                    return (
                      <StoreCard
                        key={vendor.id}
                        storeName={name}
                        address={address}
                        image={image}
                        isPublished={(vendor as any).isPublished}
                        onPress={() => handleStorePress(vendor.id!)}
                      />
                    );
                  })}
                </View>
              ))
            )}
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
    gap: 20,
    marginBottom: 29,
  },
  storeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  addStoreRow: {
    flexDirection: 'row',
  },
  storeCard: {
    width: '48%',
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
    fontSize: 18,
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
