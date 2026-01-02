import { useAuth } from '@/context/AppProvider';
import { CustomerItem, useCustomers } from '@/hooks/api/useCustomers';
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


export default function CustomersScreen() {
  const [selectedStoreId, setSelectedStoreId] = useState<string | undefined>(undefined);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { state: authState } = useAuth();
  const { storeId } = useLocalSearchParams<{ storeId?: string }>();

  const { data: customers, isLoading, isError, refetch } = useCustomers(storeId);

  const handleGoBack = () => {
    router.back();
  };

  const handleNotifications = () => {
    console.log('Open notifications');
  };

  const handleFilter = () => {
    console.log('Open filter');
  };

  const handleViewDetails = (customerId?: string) => {
    if (!customerId) return;
    router.push({ pathname: '/(private)/home/customer-details' as any, params: { customerId, storeId: selectedStoreId } });
  };

  const displayedCustomers: CustomerItem[] = Array.isArray(customers) ? customers : [];
  const totalIsLoading = isLoading ;

  const CustomerCard = ({ customer }: { customer: CustomerItem }) => (
    <View style={styles.customerCard}>
      <View style={styles.customerContent}>
        <View style={styles.customerLeft}>
          <Image
            source={customer.avatarUrl ? { uri: customer.avatarUrl } : require('../../../assets/images/user profile.png')}
            style={styles.avatar}
          />
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{customer.name}</Text>
            <Text style={styles.customerEmail}>{customer.email}</Text>
            <Text style={styles.orderCount}>{customer.orderCount} Orders</Text>
          </View>
        </View>
        <View style={styles.customerRight}>
          <Text style={styles.totalAmount}>{customer.totalAmount}</Text>
          <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={() => handleViewDetails(customer.id)}
          >
            <Text style={styles.viewDetailsText}>View details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#06888C' }]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#06888C" />

      {/* Header */}
      <View style={styles.headerContainer}>

        <View style={styles.extendedHeader}>
          {/* Header Content */}
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                <Svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <Path d="M19.6278 21.993C19.8661 22.2135 20 22.5125 20 22.8243C20 23.1361 19.8661 23.4352 19.6278 23.6556C19.3895 23.8761 19.0662 24 18.7292 24C18.3921 24 18.0689 23.8761 17.8306 23.6556L9.37313 15.8313C9.25486 15.7223 9.16102 15.5927 9.09699 15.4501C9.03296 15.3074 9 15.1545 9 15C9 14.8455 9.03296 14.6926 9.09699 14.5499C9.16102 14.4073 9.25486 14.2777 9.37313 14.1687L17.8306 6.34435C18.0689 6.12387 18.3921 6 18.7292 6C19.0662 6 19.3895 6.12387 19.6278 6.34435C19.8661 6.56483 20 6.86387 20 7.17568C20 7.48749 19.8661 7.78653 19.6278 8.00702L12.07 14.999L19.6278 21.993Z" fill="white" />
                </Svg>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>All Customers</Text>
            </View>
          </View>

        </View>

      </View>


      <View style={[styles.contentWrapper, { backgroundColor: '#FFF' }]}>


        {/* Customers List */}
        {totalIsLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#06888C" />
          </View>
        ) : displayedCustomers.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 40 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>No customers yet</Text>
            <Text style={{ color: '#7C8BA0', marginTop: 8 }}>You don&apos;t have any customers yet.</Text>
            <TouchableOpacity onPress={() => refetch()} style={{ marginTop: 16, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#06888C' }}>
              <Text style={{ color: '#06888C' }}>Refresh</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView style={styles.customersContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.customersList}>
              {displayedCustomers.map((customer: CustomerItem) => (
                <CustomerCard key={customer.id} customer={customer} />
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#06888C',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 19,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 21,
    paddingTop: 19,
    paddingBottom: 19,
  },
  backButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    marginLeft: 12,
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Raleway',
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
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 19,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 19,
  },
  allCustomersButton: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: '#06888C',
  },
  allCustomersText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Raleway',
    color: '#FFF',
    lineHeight: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBB',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#000',
  },
  customersContainer: {
    flex: 1,
  },
  customersList: {
    gap: 10,
  },
  customerCard: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#FFF',
  },
  customerContent: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  customerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 32,
  },
  customerInfo: {
    flex: 1,
    gap: 2,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#000',
  },
  customerEmail: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#000',
  },
  orderCount: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#000',
  },
  customerRight: {
    alignItems: 'flex-end',
    gap: 5,
    width: 78,
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#000',
    textAlign: 'right',
  },
  viewDetailsButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#06888C',
    alignSelf: 'stretch',
  },
  viewDetailsText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
    textAlign: 'center',
  },
  dropdownWrapper: {
    position: 'relative',
    zIndex: 10,
    marginBottom: 19,
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
  overlayContainer: {
    paddingHorizontal: 20,
    gap: 17,
    minWidth: '60%',
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
});
