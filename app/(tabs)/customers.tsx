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
import { Customer } from '../../types';

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'Jonathan Smith',
    email: 'jonathansmith@gmail.com',
    phone: '+1 334 654 7788',
    address: 'Westside 12th asery. New California, 90123',
    orderCount: 120,
    totalAmount: 2300.44,
    avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/1c02f988f6152857cceceaad4514db57c0b09aa3?width=120',
  },
  {
    id: '2',
    name: 'Jonathan Smith',
    email: 'jonathansmith@gmail.com',
    orderCount: 12,
    totalAmount: 2220.44,
    avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/47065a1a8073c47748a335ed377b58fe1099426d?width=100',
  },
  {
    id: '3',
    name: 'Jonathan Smith',
    email: 'jonathansmith@gmail.com',
    orderCount: 12,
    totalAmount: 1200.44,
    avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/1a653f15dfae5eb2d1df45f0d239230620b07913?width=100',
  },
  {
    id: '4',
    name: 'Jonathan Smith',
    email: 'jonathansmith@gmail.com',
    orderCount: 12,
    totalAmount: 800.44,
    avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/bc5877a3925c0bf64832f3a6324b91a31a06971b?width=100',
  },
  {
    id: '5',
    name: 'Jonathan Smith',
    email: 'jonathansmith@gmail.com',
    orderCount: 12,
    totalAmount: 1100.44,
    avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/5e2a8bd7f3b0323b9655ca20ef577b4cc73e8adb?width=100',
  },
  {
    id: '6',
    name: 'Jonathan Smith',
    email: 'jonathansmith@gmail.com',
    orderCount: 12,
    totalAmount: 9000.44,
    avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/219fd9d999aa7014cecba9e2ac09740ee9be0bb8?width=100',
  },
  {
    id: '7',
    name: 'Jonathan Smith',
    email: 'jonathansmith@gmail.com',
    orderCount: 12,
    totalAmount: 2300.44,
    avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/e3a1b46f8910ba90bd335fae8046a232f73543ba?width=100',
  },
];

export default function CustomersScreen() {
  const handleGoBack = () => {
    router.back();
  };

  const handleNotifications = () => {
    console.log('Open notifications');
  };

  const handleSupport = () => {
    console.log('Open support');
  };

  const handleFilter = () => {
    console.log('Open filter');
  };

  const handleViewDetails = (customerId: string) => {
    router.push(`/customer-details?customerId=${customerId}`);
  };

  const CustomerCard = ({ customer }: { customer: Customer }) => (
    <View style={styles.customerCard}>
      <View style={styles.customerContent}>
        <View style={styles.customerLeft}>
          <Image source={{ uri: customer.avatar }} style={styles.avatar} />
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{customer.name}</Text>
            <Text style={styles.customerEmail}>{customer.email}</Text>
            <Text style={styles.orderCount}>{customer.orderCount} Orders</Text>
          </View>
        </View>
        <View style={styles.customerRight}>
          <Text style={styles.totalAmount}>${customer.totalAmount.toFixed(2)}</Text>
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#06888C" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <path 
              d="M19.6278 21.993C19.8661 22.2135 20 22.5125 20 22.8243C20 23.1361 19.8661 23.4352 19.6278 23.6556C19.3895 23.8761 19.0662 24 18.7292 24C18.3921 24 18.0689 23.8761 17.8306 23.6556L9.37313 15.8313C9.25486 15.7223 9.16102 15.5927 9.09699 15.4501C9.03296 15.3074 9 15.1545 9 15C9 14.8455 9.03296 14.6926 9.09699 14.5499C9.16102 14.4073 9.25486 14.2777 9.37313 14.1687L17.8306 6.34435C18.0689 6.12387 18.3921 6 18.7292 6C19.0662 6 19.3895 6.12387 19.6278 6.34435C19.8661 6.56483 20 6.86387 20 7.17568C20 7.48749 19.8661 7.78653 19.6278 8.00702L12.07 14.999L19.6278 21.993Z" 
              fill="white"
            />
          </svg>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>My Customers</Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleNotifications} style={styles.headerAction}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path 
                d="M8.645 20.5C8.86103 21.2219 9.30417 21.8549 9.90858 22.3049C10.513 22.755 11.2464 22.998 12 22.998C12.7536 22.998 13.487 22.755 14.0914 22.3049C14.6958 21.8549 15.139 21.2219 15.355 20.5H8.645ZM3 19.5H21V16.5L19 13.5V8.5C19 7.58075 18.8189 6.6705 18.4672 5.82122C18.1154 4.97194 17.5998 4.20026 16.9497 3.55025C16.2997 2.90024 15.5281 2.38463 14.6788 2.03284C13.8295 1.68106 12.9193 1.5 12 1.5C11.0807 1.5 10.1705 1.68106 9.32122 2.03284C8.47194 2.38463 7.70026 2.90024 7.05025 3.55025C6.40024 4.20026 5.88463 4.97194 5.53284 5.82122C5.18106 6.6705 5 7.58075 5 8.5V13.5L3 16.5V19.5Z" 
                fill="white"
              />
            </svg>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleSupport} style={styles.headerAction}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M19.8 10.18C19.49 7.00002 17.61 2 11.8 2C5.99002 2 4.11001 7.00002 3.80002 10.18C2.71252 10.5927 1.9952 11.6368 2.00002 12.8V14.2C2.00002 15.7464 3.25365 17 4.80001 17C6.34642 17 7.60004 15.7464 7.60004 14.2V12.8C7.59498 11.6619 6.90404 10.6393 5.85001 10.21C6.05002 8.36998 7.03004 4.00002 11.8 4.00002C16.57 4.00002 17.54 8.36998 17.74 10.21C16.6882 10.6402 16.0007 11.6636 16 12.8V14.2C16.0022 14.7269 16.1524 15.2425 16.4335 15.6881C16.7147 16.1337 17.1154 16.4913 17.59 16.72C17.17 17.51 16.1 18.58 13.47 18.9C12.9443 18.1017 11.9272 17.787 11.0424 18.1489C10.1578 18.5108 9.65279 19.4481 9.83729 20.386C10.0218 21.3239 10.8442 22 11.8 22C12.1704 21.9979 12.5329 21.8931 12.8472 21.6971C13.1615 21.5011 13.4152 21.2217 13.58 20.89C17.87 20.4 19.24 18.19 19.67 16.89C20.8333 16.5132 21.6157 15.4227 21.6 14.2V12.8C21.6048 11.6368 20.8875 10.5927 19.8 10.18Z" 
                fill="white"
              />
            </svg>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {/* Controls */}
        <View style={styles.controlsContainer}>
          <View style={styles.allCustomersButton}>
            <Text style={styles.allCustomersText}>All Customers</Text>
          </View>
          
          <TouchableOpacity onPress={handleFilter} style={styles.filterButton}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path 
                d="M3 4.66675H13M4.66667 8.00008H11.3333M6.66667 11.3334H9.33333" 
                stroke="black" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>

        {/* Customers List */}
        <ScrollView style={styles.customersContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.customersList}>
            {MOCK_CUSTOMERS.map((customer) => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 21,
    paddingTop: 19,
    paddingBottom: 19,
    backgroundColor: '#06888C',
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
    fontWeight: '600',
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
    width: 94,
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
    fontWeight: '600',
    fontFamily: 'Raleway',
    color: '#FFF',
    textAlign: 'center',
  },
});
