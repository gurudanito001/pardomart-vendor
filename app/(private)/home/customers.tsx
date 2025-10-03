import { User } from '@/api';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { ArrowBackSVG, NotificationSVG, SupportSVG } from '../../../components/icons';

const MOCK_CUSTOMERS: User[] = [
  {
    id: '1',
    name: 'Jonathan Smith',
    email: 'jonathansmith@gmail.com',
    mobileNumber: '+1 334 654 7788'
  },
  {
    id: '2',
    name: 'Jonathan Smith',
    email: 'jonathansmith@gmail.com'
  },
  {
    id: '3',
    name: 'Jonathan Smith',
    email: 'jonathansmith@gmail.com'
  },
  {
    id: '4',
    name: 'Jonathan Smith',
    email: 'jonathansmith@gmail.com'
  },
  {
    id: '5',
    name: 'Jonathan Smith',
    email: 'jonathansmith@gmail.com'
  },
  {
    id: '6',
    name: 'Jonathan Smith',
    email: 'jonathansmith@gmail.com'
  },
  {
    id: '7',
    name: 'Jonathan Smith',
    email: 'jonathansmith@gmail.com'
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

  const handleViewDetails = (customerId?: string) => {
    if (!customerId) return;
    router.push({ pathname: '/(private)/home/customer-details' as any, params: { customerId } });
  };

  const CustomerCard = ({ customer }: { customer: User }) => (
    <View style={styles.customerCard}>
      <View style={styles.customerContent}>
        <View style={styles.customerLeft}>
          <Image source={require('../../../assets/images/user profile.png')} style={styles.avatar} />
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{customer.name}</Text>
            <Text style={styles.customerEmail}>{customer.email}</Text>
          </View>
        </View>
        <View style={styles.customerRight}>
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
          <ArrowBackSVG width={30} height={30} color="white" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>My Customers</Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleNotifications} style={styles.headerAction}>
            <NotificationSVG width={24} height={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleSupport} style={styles.headerAction}>
            <SupportSVG width={24} height={24} color="white" />
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
            <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <Path 
                d="M3 4.66675H13M4.66667 8.00008H11.3333M6.66667 11.3334H9.33333" 
                stroke="black" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </Svg>
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
