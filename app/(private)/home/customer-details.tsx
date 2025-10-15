import type { Transaction } from '@/api';
import NotificationBell from '@/components/NotificationBell';
import { useCustomers, useCustomerTransactions } from '@/hooks/api/useCustomerQueries';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
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
import {
  ArrowBackSVG,
  OrderSVG
} from '../../../components/icons';

export default function CustomerDetailsScreen() {
  const params = useLocalSearchParams();
  const customerId = params.customerId as string | undefined;
  const storeId = params.storeId as string | undefined;

  // Fetch customer data
  const { data: customers, isLoading: isLoadingCustomers } = useCustomers(storeId);
  const customer = customers?.find((c) => c.id === customerId);

  // Fetch customer transactions
  const {
    data: transactions,
    isLoading: isLoadingTransactions,
  } = useCustomerTransactions(customerId, storeId);

  const handleGoBack = () => {
    router.back();
  };

  const handleNotifications = () => {
    console.log('Open notifications');
  };

  const handleViewAllTransactions = () => {
    if (!customerId) return;
    router.push({
      pathname: '/(private)/home/transactions' as any,
      params: { userId: customerId, storeId },
    });
  };

  const TransactionItem = ({ transaction }: { transaction: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionContent}>
        <View style={styles.orderIconContainer}>
          <OrderSVG width={24} height={24} color="black" />
        </View>
        <View style={styles.transactionDetails}>
          <Text style={styles.orderId}>
            {transaction.orderId ? `Order #${transaction.orderId}` : 'Transaction'}
          </Text>
          <Text style={styles.transactionAmount}>${transaction.amount?.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );

  if (!customer) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredMessage}>
          <Text>Customer data not found.</Text>
          <TouchableOpacity onPress={handleGoBack}>
            <Text style={styles.viewAllText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#06888C" />

      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowBackSVG width={30} height={30} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Customer details</Text>

        <View style={styles.headerActions}>
          <View style={styles.headerAction}>
            <NotificationBell from="/(private)/shared/customer-details" />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoadingCustomers ? (
          <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#06888C" />
        ) : customer ? (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Customer Information</Text>
              <View style={styles.customerInfoContainer}>
                <Image
                  source={
                    (customer as any).avatarUrl
                      ? { uri: (customer as any).avatarUrl }
                      : require('../../../assets/images/user profile.png')
                  }
                  style={styles.customerAvatar}
                />
                <View style={styles.customerDetails}>
                  <View style={styles.customerNameRow}>
                    <Text style={styles.customerName}>{customer.name}</Text>
                  </View>
                  <Text style={styles.customerEmail}>{customer.email}</Text>
                </View>
              </View>
            </View>

            <View style={styles.transactionSection}>
              <View style={styles.transactionHeader}>
                <Text style={styles.sectionTitle}>Payment history</Text>
                <TouchableOpacity onPress={handleViewAllTransactions}>
                  <Text style={styles.viewAllText}>View all</Text>
                </TouchableOpacity>
              </View>
              {isLoadingTransactions ? (
                <ActivityIndicator color="#06888C" />
              ) : (transactions?.length ?? 0) > 0 ? (
                <View style={styles.transactionsList}>
                  {transactions?.map((transaction) => (
                    <TransactionItem key={transaction.id} transaction={transaction} />
                  ))}
                </View>
              ) : (
                <Text style={styles.noTransactionsText}>No payment history found.</Text>
              )}
            </View>
          </>
        ) : (
          <Text style={styles.noTransactionsText}>Customer not found.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  centeredMessage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 21,
    paddingTop: 19,
    paddingBottom: 19,
    backgroundColor: "#06888C",
  },
  backButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    marginLeft: 12,
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Raleway",
    lineHeight: 22,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  headerAction: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 22,
  },
  section: {
    paddingTop: 17,
  },
  sectionTitle: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Raleway",
    lineHeight: 25,
    marginBottom: 19,
  },
  customerInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  customerName: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Open Sans",
    color: "#000",
    lineHeight: 16,
  },
  customerEmail: {
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "Open Sans",
    color: "#333",
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
    fontWeight: "700",
    fontFamily: "Open Sans",
    color: "#000",
    lineHeight: 16,
  },
  fieldInput: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#B4BED4",
    backgroundColor: "#F0F8F8",
  },
  fieldValue: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Open Sans",
    color: "#000",
    lineHeight: 20,
  },
  transactionSection: {
    marginBottom: 50,
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 19,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Raleway",
    color: "#06888C",
    lineHeight: 25,
  },
  transactionsList: {
    gap: 12,
  },
  transactionItem: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    backgroundColor: "#FFF",
  },
  transactionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  orderIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#BFE3C6",
    justifyContent: "center",
    alignItems: "center",
  },
  transactionDetails: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Open Sans",
    color: "#000",
    lineHeight: 16,
  },
  orderId: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#000',
    lineHeight: 14,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#000',
    textAlign: 'right',
  },
  goBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    marginHorizontal: 20,
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
  noTransactionsText: {
    textAlign: 'center',
    color: '#7C8BA0',
    marginTop: 20,
    fontFamily: 'Open Sans',
  },
});
