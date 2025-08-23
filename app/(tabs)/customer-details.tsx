import { router, useLocalSearchParams } from 'expo-router';
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
import {
  ArrowBackButtonSVG,
  ArrowBackSVG,
  NotificationSVG,
  OrderSVG,
  SupportSVG
} from '../../components/icons';
import { Customer, Transaction } from '../../types';

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', orderId: 'Order 556445', date: 'Aug 12, 2025, 04:35am', amount: 342.66 },
  { id: '2', orderId: 'Order 556445', date: 'Aug 12, 2025, 04:35am', amount: 342.66 },
  { id: '3', orderId: 'Order 556445', date: 'Aug 12, 2025, 04:35am', amount: 342.66 },
  { id: '4', orderId: 'Order 556445', date: 'Aug 12, 2025, 04:35am', amount: 342.66 },
  { id: '5', orderId: 'Order 556445', date: 'Aug 12, 2025, 04:35am', amount: 342.66 },
  { id: '6', orderId: 'Order 556445', date: 'Aug 12, 2025, 04:35am', amount: 342.66 },
];

export default function CustomerDetailsScreen() {
  const params = useLocalSearchParams();
  const customerId = params.customerId as string;

  // Mock customer data - in a real app, you'd fetch this based on customerId
  const customer: Customer = {
    id: customerId || '1',
    name: 'Jonathan Smith',
    email: 'Joanthansmith@gmail.com',
    phone: '+1 334 654 7788',
    address: 'Westside 12th asery. New California, 90123',
    orderCount: 120,
    totalAmount: 2300.44,
    avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/1c02f988f6152857cceceaad4514db57c0b09aa3?width=120',
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleNotifications = () => {
    console.log('Open notifications');
  };

  const handleSupport = () => {
    console.log('Open support');
  };

  const handleViewAllTransactions = () => {
    console.log('View all transactions');
  };

  const TransactionItem = ({ transaction }: { transaction: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionContent}>
        <View style={styles.orderIconContainer}>
          <OrderSVG width={24} height={24} color="black" />
        </View>
        <View style={styles.transactionDetails}>
          <View style={styles.transactionInfo}>
            <Text style={styles.orderId}>{transaction.orderId}</Text>
            <Text style={styles.transactionDate}>{transaction.date}</Text>
          </View>
          <Text style={styles.transactionAmount}>+${transaction.amount.toFixed(2)}</Text>
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
        
        <Text style={styles.headerTitle}>Customer details</Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleNotifications} style={styles.headerAction}>
            <NotificationSVG width={24} height={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleSupport} style={styles.headerAction}>
            <SupportSVG width={24} height={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Customer Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          
          <View style={styles.customerInfoContainer}>
            <Image source={{ uri: customer.avatar }} style={styles.customerAvatar} />
            <View style={styles.customerDetails}>
              <View style={styles.customerNameRow}>
                <Text style={styles.customerName}>{customer.name}</Text>
                <Text style={styles.orderCount}>{customer.orderCount} Orders</Text>
              </View>
              <Text style={styles.customerEmail}>{customer.email}</Text>
            </View>
          </View>
        </View>

        {/* Contact Information Fields */}
        <View style={styles.fieldsContainer}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Email Address</Text>
            <View style={styles.fieldInput}>
              <Text style={styles.fieldValue}>{customer.email}</Text>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Phone Number</Text>
            <View style={styles.fieldInput}>
              <Text style={styles.fieldValue}>{customer.phone}</Text>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Address</Text>
            <View style={styles.fieldInput}>
              <Text style={styles.fieldValue}>{customer.address}</Text>
            </View>
          </View>
        </View>

        {/* Transaction History Section */}
        <View style={styles.transactionSection}>
          <View style={styles.transactionHeader}>
            <Text style={styles.sectionTitle}>Transaction history</Text>
            <TouchableOpacity onPress={handleViewAllTransactions}>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionsList}>
            {MOCK_TRANSACTIONS.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </View>
        </View>

        {/* Go Back Button */}
        <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
          <ArrowBackButtonSVG width={24} height={24} color="white" />
          <Text style={styles.goBackText}>Go back</Text>
        </TouchableOpacity>
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
  },
  section: {
    paddingTop: 17,
  },
  sectionTitle: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    lineHeight: 25,
    marginBottom: 19,
  },
  customerInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 19,
  },
  customerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  customerDetails: {
    flex: 1,
    gap: 4,
  },
  customerNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customerName: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#000',
    lineHeight: 16,
  },
  orderCount: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#000',
    lineHeight: 14,
  },
  customerEmail: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#333',
    lineHeight: 14,
  },
  fieldsContainer: {
    gap: 22,
    marginBottom: 49,
  },
  fieldGroup: {
    gap: 9,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#000',
    lineHeight: 16,
  },
  fieldInput: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#F0F8F8',
  },
  fieldValue: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#000',
    lineHeight: 20,
  },
  transactionSection: {
    marginBottom: 50,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 19,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#06888C',
    lineHeight: 25,
  },
  transactionsList: {
    gap: 8,
  },
  transactionItem: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    backgroundColor: '#FFF',
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  orderIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#BFE3C6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionInfo: {
    gap: 4,
  },
  orderId: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#000',
    lineHeight: 14,
  },
  transactionDate: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#707070',
    lineHeight: 12,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#2CAF0B',
    lineHeight: 19,
  },
  goBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 120,
    borderRadius: 16,
    backgroundColor: '#06888C',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 9,
    elevation: 2,
  },
  goBackText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
    lineHeight: 25,
  },
});
