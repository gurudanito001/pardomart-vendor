import { Role, User, type Vendor } from '@/api/models';
import { MyShoppersSVG } from '@/components/icons/MyShoppersSVG';
import { useAuth } from '@/context/AppProvider';
import { useStaff } from '@/hooks/api/useStaff'; // Assuming this hook exists
import { useVendors } from '@/hooks/api/useVendors';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

export default function MyStaffScreen() {
  const {fetchVendors} = useVendors();
  const { storeId: initialStoreId } = useLocalSearchParams<{ storeId?: string }>();
  const [selectedStoreId, setSelectedStoreId] = useState<string | undefined>(initialStoreId);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { state: authState } = useAuth();
  const userId = authState.user?.id;

  // Fetch vendors for the dropdown filter
  const { data: vendors, isLoading: isLoadingStores } = useQuery({
    queryKey: ['vendors', userId],
    queryFn: () => fetchVendors({ userId }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!userId,
  });
  const stores: Vendor[] = vendors?.data ?? [];

  // Fetch shoppers based on the selected store
  const {
    data: shoppers,
    isLoading: isLoadingShoppers,
    refetch,
  } = useStaff(selectedStoreId);

  const handleGoBack = () => {
    router.back();
  };

  const handleViewDetails = (shopperId?: string) => {
    if (!shopperId) return;
    // Navigate to a shopper detail screen, e.g., 'view-shopper'
    router.push({
      pathname: '/(private)/home/view-staff' as any,
      params: { shopperId, storeId: selectedStoreId },
    });
  };

  const displayedShoppers: User[] = Array.isArray(shoppers) ? shoppers : [];
  const totalIsLoading = isLoadingShoppers || isLoadingStores;
  const selectedStoreName =
    stores.find((s: Vendor) => s.id === selectedStoreId)?.name || 'All Stores';

  const roleOptions = React.useMemo(() => [
    { label: 'Store Admin', value: Role.StoreAdmin },
    { label: 'Store Shopper', value: Role.StoreShopper },
  ], []);

  const getRoleName = (role?: Role) => {
    if (!role) return 'No Role';
    return roleOptions.find(r => r.value === role)?.label ?? 'Unknown Role';
  };

  const getStoreName = (vendorId?: string | null) => {
    if (!vendorId) return 'No Store Assigned';
    return stores.find(s => s.id === vendorId)?.name ?? 'No Store Assigned';
  };

  const ShopperCard = ({ shopper }: { shopper: User }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleViewDetails(shopper.id)}>
      <View style={styles.cardContent}>
        <View style={styles.cardLeft}>
          <Image
            source={
              shopper.image
                ? { uri: shopper.image }
                : require('../../../assets/images/user profile.png')
            }
            style={styles.avatar}
          />
          <View style={styles.info}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{shopper.name}</Text>
            </View>
            <Text style={styles.detailText}>{getStoreName(shopper?.vendorId)}</Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{getRoleName(shopper.role as Role)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#06888C" />

      {/* Header with Dropdown Filter */}
      <View style={styles.headerContainer}>
        <View style={styles.extendedHeader}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                <Svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <Path
                    d="M19.6278 21.993C19.8661 22.2135 20 22.5125 20 22.8243C20 23.1361 19.8661 23.4352 19.6278 23.6556C19.3895 23.8761 19.0662 24 18.7292 24C18.3921 24 18.0689 23.8761 17.8306 23.6556L9.37313 15.8313C9.25486 15.7223 9.16102 15.5927 9.09699 15.4501C9.03296 15.3074 9 15.1545 9 15C9 14.8455 9.03296 14.6926 9.09699 14.5499C9.16102 14.4073 9.25486 14.2777 9.37313 14.1687L17.8306 6.34435C18.0689 6.12387 18.3921 6 18.7292 6C19.0662 6 19.3895 6.12387 19.6278 6.34435C19.8661 6.56483 20 6.86387 20 7.17568C20 7.48749 19.8661 7.78653 19.6278 8.00702L12.07 14.999L19.6278 21.993Z"
                    fill="white"
                  />
                </Svg>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>My Staff</Text>
            </View>

            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push(`/(private)/home/add-staff` as any)}
              >
                <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <Path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="white" />
                </Svg>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.overlayContainer}>
            <View style={styles.dropdownWrapper}>
              <TouchableOpacity
                style={styles.dropdownHeader}
                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Text style={styles.dropdownHeaderText}>{selectedStoreName}</Text>
                <Svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <Path
                    d="M1 1.5L6 6.5L11 1.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </TouchableOpacity>
              {isDropdownOpen && (
                <View style={styles.dropdownList}>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedStoreId(undefined);
                      setIsDropdownOpen(false);
                    }}
                  >
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
      </View>

      {/* Content Body */}
      <View style={styles.contentWrapper}>
        {totalIsLoading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#06888C" />
          </View>
        ) : displayedShoppers.length === 0 ? (
          <View style={styles.centerContent}>
            <MyShoppersSVG color="#E0E0E0" width={80} height={80} />
            <Text style={styles.emptyStateTitle}>No staff Found</Text>
            <Text style={styles.emptyStateSubtitle}>
              There are no staff assigned to the selected store.
            </Text>
            <TouchableOpacity onPress={() => refetch()} style={styles.refreshButton}>
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.listContainer}>
              {displayedShoppers.map((shopper: User) => (
                <ShopperCard key={shopper.id} shopper={shopper} />
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  headerContainer: {
    backgroundColor: '#06888C',
  },
  extendedHeader: {
    backgroundColor: '#06888C',
    paddingVertical: 20,
    gap: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Raleway',
  },
  overlayContainer: {
    paddingHorizontal: 20,
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
    fontFamily: 'Open Sans',
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 19,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  emptyStateSubtitle: {
    color: '#7C8BA0',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  refreshButton: {
    marginTop: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#06888C',
  },
  refreshButtonText: {
    color: '#06888C',
    fontWeight: '600',
  },
  listContainer: {
    gap: 10,
    paddingBottom: 20,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#FFF',
  },
  cardContent: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#000',
  },
  detailText: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#555',
  },
  roleBadge: {
    backgroundColor: 'rgba(6, 136, 140, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#06888C',
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  viewDetailsButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#06888C',
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    padding: 6,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});
