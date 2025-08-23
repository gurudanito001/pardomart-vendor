import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Order {
  id: string;
  orderId: string;
  customerName: string;
  status: 'placed' | 'cancelled' | 'progress' | 'completed';
}

const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    orderId: '1287651166',
    customerName: 'George Martins',
    status: 'placed',
  },
  {
    id: '2',
    orderId: '1287651166',
    customerName: 'George Martins',
    status: 'cancelled',
  },
  {
    id: '3',
    orderId: '1287651166',
    customerName: 'George Martins',
    status: 'placed',
  },
  {
    id: '4',
    orderId: '1287651166',
    customerName: 'George Martins',
    status: 'placed',
  },
  {
    id: '5',
    orderId: '1287651166',
    customerName: 'George Martins',
    status: 'placed',
  },
  {
    id: '6',
    orderId: '1287651166',
    customerName: 'George Martins',
    status: 'cancelled',
  },
  {
    id: '7',
    orderId: '1287651166',
    customerName: 'George Martins',
    status: 'cancelled',
  },
  {
    id: '8',
    orderId: '1287651166',
    customerName: 'George Martins',
    status: 'cancelled',
  },
  {
    id: '9',
    orderId: '1287651166',
    customerName: 'George Martins',
    status: 'placed',
  },
];

export default function TransactionsScreen() {
  const [selectedTab, setSelectedTab] = useState('all');

  const handleGoBack = () => {
    router.back();
  };

  const handleNotifications = () => {
    console.log('Open notifications');
  };

  const handleSupport = () => {
    console.log('Open support');
  };

  const handleRefresh = () => {
    console.log('Refresh transactions');
  };

  const handleFilter = () => {
    console.log('Open filter');
  };

  const handleNext = () => {
    console.log('Next page');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'placed':
        return {
          text: 'Order placed',
          backgroundColor: 'rgba(33, 196, 93, 0.10)',
          textColor: '#21C45D',
        };
      case 'cancelled':
        return {
          text: 'Order Cancelled',
          backgroundColor: 'rgba(244, 128, 34, 0.10)',
          textColor: '#F48022',
        };
      case 'progress':
        return {
          text: 'In Progress',
          backgroundColor: 'rgba(6, 136, 140, 0.10)',
          textColor: '#06888C',
        };
      case 'completed':
        return {
          text: 'Completed',
          backgroundColor: 'rgba(33, 196, 93, 0.10)',
          textColor: '#21C45D',
        };
      default:
        return {
          text: 'Unknown',
          backgroundColor: 'rgba(136, 136, 136, 0.10)',
          textColor: '#888',
        };
    }
  };

  const filteredOrders = selectedTab === 'all' 
    ? MOCK_ORDERS 
    : MOCK_ORDERS.filter(order => {
        switch (selectedTab) {
          case 'pending':
            return order.status === 'placed';
          case 'progress':
            return order.status === 'progress';
          case 'completed':
            return order.status === 'completed';
          default:
            return true;
        }
      });

  const OrderCard = ({ order }: { order: Order }) => {
    const statusBadge = getStatusBadge(order.status);
    
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderContent}>
          <View style={styles.orderLeft}>
            <View style={styles.orderIconContainer}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M17 4H7C5.89543 4 5 4.89543 5 6V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V6C19 4.89543 18.1046 4 17 4Z" 
                  stroke="#707070" 
                  strokeWidth="2"
                />
                <path 
                  d="M9 9H15M9 13H15M9 17H13" 
                  stroke="#707070" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />
              </svg>
            </View>
            <View style={styles.orderInfo}>
              <Text style={styles.orderId}>Order Id - {order.orderId}</Text>
              <Text style={styles.customerName}>Customer Name - {order.customerName}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusBadge.backgroundColor }]}>
            <Text style={[styles.statusText, { color: statusBadge.textColor }]}>
              {statusBadge.text}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#06888C" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <path 
              d="M20.1278 21.993C20.3661 22.2135 20.5 22.5125 20.5 22.8243C20.5 23.1361 20.3661 23.4352 20.1278 23.6556C19.8895 23.8761 19.5662 24 19.2292 24C18.8921 24 18.5689 23.8761 18.3306 23.6556L9.87313 15.8313C9.75486 15.7223 9.66102 15.5927 9.59699 15.4501C9.53296 15.3074 9.5 15.1545 9.5 15C9.5 14.8455 9.53296 14.6926 9.59699 14.5499C9.66102 14.4073 9.75486 14.2777 9.87313 14.1687L18.3306 6.34435C18.5689 6.12387 18.8921 6 19.2292 6C19.5662 6 19.8895 6.12387 20.1278 6.34435C20.3661 6.56483 20.5 6.86387 20.5 7.17568C20.5 7.48749 20.3661 7.78653 20.1278 8.00702L12.57 14.999L20.1278 21.993Z" 
              fill="white"
            />
          </svg>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Transactions</Text>
        
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
                d="M19.8 10.18C19.49 7.00002 17.61 2 11.8 2C5.99002 2 4.11001 7.00002 3.80002 10.18C2.71252 10.5927 1.9952 11.6368 2.00002 12.8V14.2C2.00002 15.7464 3.25365 17 4.80001 17C6.34642 17 7.60004 15.7464 7.60004 14.2V12.8C7.59498 11.6619 6.90404 10.6393 5.85001 10.21C6.05002 8.36998 7.03004 4.00002 11.8 4.00002C16.57 4.00002 17.54 8.36998 17.74 10.21C16.6882 10.6402 16.0007 11.6636 16 12.8V14.2C16.0022 14.7269 16.1524 15.2425 16.4335 15.6881C16.7147 16.1337 17.1154 16.4913 17.59 16.72C17.17 17.51 16.1 18.58 13.47 18.9C12.9443 18.1017 11.9272 17.787 11.0424 18.1489C10.1578 18.5108 10.1528 19.4481 10.3373 20.386C10.5218 21.3239 11.3442 22 11.8 22C12.1704 21.9979 12.5329 21.8931 12.8472 21.6971C13.1615 21.5011 13.4152 21.2217 13.58 20.89C17.87 20.4 19.24 18.19 19.67 16.89C20.8333 16.5132 21.6157 15.4227 21.6 14.2V12.8C21.6048 11.6368 20.8875 10.5927 19.8 10.18Z" 
                fill="white"
              />
            </svg>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {/* Filter Tabs */}
        <ScrollView 
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.tabContainer}
          contentContainerStyle={styles.tabContentContainer}
        >
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'all' && styles.activeTab]}
            onPress={() => setSelectedTab('all')}
          >
            <Text style={[styles.tabText, selectedTab === 'all' && styles.activeTabText]}>
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'pending' && styles.activeTab]}
            onPress={() => setSelectedTab('pending')}
          >
            <Text style={[styles.tabText, selectedTab === 'pending' && styles.activeTabText]}>
              Pending Order
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'progress' && styles.activeTab]}
            onPress={() => setSelectedTab('progress')}
          >
            <Text style={[styles.tabText, selectedTab === 'progress' && styles.activeTabText]}>
              Shop in progress
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'completed' && styles.activeTab]}
            onPress={() => setSelectedTab('completed')}
          >
            <Text style={[styles.tabText, selectedTab === 'completed' && styles.activeTabText]}>
              Completed
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
            <Text style={styles.refreshText}>Refresh</Text>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path 
                d="M13.3337 7.33346C13.1706 6.16028 12.6264 5.07324 11.7848 4.23979C10.9431 3.40635 9.85082 2.87274 8.67611 2.72116C7.50138 2.56959 6.30941 2.80845 5.28379 3.40096C4.25818 3.99347 3.45582 4.90675 3.00033 6.00013M2.66699 3.33346V6.00013H5.33366M2.66699 8.6668C2.83003 9.83998 3.37428 10.927 4.2159 11.7605C5.05752 12.5939 6.14982 13.1275 7.32455 13.2791C8.49927 13.4307 9.69124 13.1918 10.7169 12.5993C11.7425 12.0068 12.5448 11.0935 13.0003 10.0001M13.3337 12.6668V10.0001H10.667" 
                stroke="#484C52" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleFilter} style={styles.filterButton}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path 
                d="M3 4.6665H13M4.66667 7.99984H11.3333M6.66667 11.3332H9.33333" 
                stroke="black" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>

        {/* Orders List */}
        <ScrollView style={styles.ordersContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.ordersList}>
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </View>
        </ScrollView>

        {/* Pagination */}
        <View style={styles.paginationContainer}>
          <Text style={styles.paginationText}>Showing 1-10 of 20</Text>
          <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
            <Text style={styles.nextText}>Next</Text>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path 
                d="M13.3333 16.375L17.5 12M17.5 12L13.3333 7.625M17.5 12H7.5" 
                stroke="black" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 20,
    paddingTop: 19,
    paddingBottom: 16,
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
    paddingHorizontal: 20,
    paddingTop: 21,
  },
  tabContainer: {
    marginBottom: 20,
    flexGrow: 0,
  },
  tabContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 0,
  },
  tab: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeTab: {
    backgroundColor: '#06888C',
    borderColor: '#06888C',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Raleway',
    color: '#000',
    lineHeight: 12,
  },
  activeTabText: {
    color: '#FFF',
    fontWeight: '600',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    width: '95%',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  refreshText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#484C52',
    lineHeight: 22,
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
  ordersContainer: {
    flex: 1,
  },
  ordersList: {
    gap: 5,
  },
  orderCard: {
    paddingHorizontal: 11,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    backgroundColor: '#FFF',
  },
  orderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    flex: 1,
  },
  orderIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderInfo: {
    flex: 1,
    gap: 2,
  },
  orderId: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#000',
  },
  customerName: {
    fontSize: 8,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    lineHeight: 20,
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    opacity: 0.8,
  },
  paginationText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#202224',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  nextText: {
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'Nunito Sans',
    color: '#000',
  },
});
