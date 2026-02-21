import { OrderApi } from '@/api';
import { apiConfig } from '@/api/config';
import type { OrderItem, OrderStatus } from '@/api/models';
import { useOrderDetails } from '@/hooks/api/useOrderDetails';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { toast } from 'sonner-native';
import { ArrowBackSVG, NotificationSVG } from '../../../components/icons';
import { CompletedOrdersSVG } from '../../../components/icons/CompletedOrdersSVG';

type GroupedItems = Record<string, OrderItem[]>;

const OrderIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M17 4H7C5.89543 4 5 4.89543 5 6V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V6C19 4.89543 18.1046 4 17 4Z" stroke="black" strokeWidth="2"/>
    <Path d="M9 9H15M9 13H15M9 17H13" stroke="black" strokeWidth="2" strokeLinecap="round"/>
  </Svg>
);

export default function ShoppingListScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { data: order, isLoading, isError, error } = useOrderDetails(orderId);
  const [activeTab, setActiveTab] = useState<'not_found' | 'pending' | 'completed'>();
  const queryClient = useQueryClient();
  const orderApi = useMemo(() => new OrderApi(apiConfig), []);

  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ status }: { status: OrderStatus }) => {
      if (!orderId) throw new Error('Order ID is missing');
      return orderApi.orderIdStatusPatch({ status }, orderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orderDetails', orderId] });
      queryClient.invalidateQueries({ queryKey: ['vendorOrders'] });
      toast.success('Order status updated successfully!');
    },
    onError: (err: any) => {
      const errorMessage =
        err?.response?.data?.message || // Message from the backend API
        err?.response?.data?.error ||   // Alternative backend error field
        err?.message ||                 // Standard JS Error message (e.g., Network Error)
        'Failed to update order status.'; // Fallback message

      toast.error(errorMessage);
      console.error('Order status update failed:', err);
    },
  });


  const {
    not_found_Items,
    pendingItems,
    completedItems,
    itemsLeft,
    pendingCount,
    notFoundCount,
    completedCount,
    isShoppingComplete,
    isPostBagging,
  } = useMemo(() => {
    const items = order?.orderItems ?? [];

    const groupByCategory = (filteredItems: OrderItem[]): GroupedItems =>
      filteredItems.reduce((acc, item) => {
        const categoryName = item.vendorProduct?.categories?.[0]?.name || 'Uncategorized';
        if (!acc[categoryName]) {
          acc[categoryName] = [];
        }
        acc[categoryName].push(item);
        return acc;
      }, {} as GroupedItems);

    const pending = items.filter(item => !item.status || item.status === 'PENDING');
    const not_found = items.filter(item => item.status === 'NOT_FOUND');
    const completed = items.filter(item => item.status === 'FOUND' || item.status === 'REPLACED');

      const postBaggingStatuses: OrderStatus[] = [
      // Handoff States
      'ready_for_pickup',
      'ready_for_delivery',
    
      // Active Delivery Flow
      'en_route_to_pickup',
      'arrived_at_store',
      'en_route_to_delivery', // Replaces generic 'en_route'
      'arrived_at_customer_location',
      
      // Return Flow (Post-bagging exceptions)
      'en_route_to_return_pickup',
      'arrived_at_return_pickup_location',
      'en_route_to_return_to_store',
      'returned_to_store',
    
      // Terminal Success States
      'delivered',
      'picked_up_by_customer',
    ];

    return {
      not_found_Items: groupByCategory(not_found),
      notFoundCount: not_found.length,
      pendingItems: groupByCategory(pending),
      pendingCount: pending.length,
      completedItems: groupByCategory(completed),
      completedCount: completed.length,
      itemsLeft: pending.length + not_found.length,
      isShoppingComplete: pending.length === 0 && not_found.length === 0,
      isPostBagging: postBaggingStatuses.includes(order?.orderStatus as OrderStatus),
    };
  }, [order]);

  useEffect(() => {
    if (order) {
      if (pendingCount > 0) {
        setActiveTab('pending');
      } else if (notFoundCount > 0) {
        setActiveTab('not_found');
      } else {
        setActiveTab('completed');
      }
    }
  }, [order, pendingCount, notFoundCount]);

  const handleGoBack = () => {
    router.back();
  };

  const handleNotifications = () => {
    console.log('Open notifications');
  };

  const handleContinueShopping = () => {
    if (!orderId) {
      toast.error('Order ID is missing.');
      return;
    }
    router.push({
      pathname: '/(private)/orders/finding-items',
      params: { orderId },
    });
  };

  const handleCompletedBagging = () => {
    if (!orderId) {
      toast.error('Order ID is missing.');
      return;
    }
    updateOrderStatusMutation.mutate({ status: 'completed_bagging' });
  };

  const handleCompleteOrder = () => {
    if (!order) return;

    let nextStatus: OrderStatus | undefined;
    if (order.deliveryMethod === 'customer_pickup') {
      nextStatus = 'ready_for_pickup';
    } else if (order.deliveryMethod === 'delivery_person') {
      nextStatus = 'ready_for_delivery';
    }

    if (nextStatus) {
      updateOrderStatusMutation.mutate({ status: nextStatus }, {
        onSuccess: () => {
          router.push({
            pathname: '/(private)/orders/success',
            params: { orderId },
          });
        },
      });
    } else {
      toast.error('Unable to complete order: Invalid delivery method.');
    }
  };

  const handlePreviewOrder = () => {
    if (!orderId) {
      toast.error('Order ID is missing.');
      return;
    }
    router.push({
      pathname: '/(private)/orders/preview-page',
      params: { orderId },
    });
  };
  const renderOrderItem = (item: OrderItem) => (
    <View key={item.id} style={styles.itemCard}>
      <Image 
        source={{ uri: item.vendorProduct?.images?.[0] || 'https://via.placeholder.com/100' }} 
        style={styles.itemImage} 
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.vendorProduct?.product?.name}
        </Text>
        <View style={styles.itemMeta}>
          <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
          <Text style={styles.itemPrice}>${item.vendorProduct?.price?.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );

  const renderCategoryGroup = (title: string, items: OrderItem[]) => (
    <View key={title}>
      <Text style={styles.categoryTitle}>{title}</Text>
      <View style={styles.itemsGrid}>
        {items.map(item => renderOrderItem(item))}
      </View>
    </View>
  );

  const renderSection = (title: string, groupedItems: GroupedItems) => {
    const categories = Object.keys(groupedItems);

    return (
      <View style={styles.section}>
        {categories.length > 0 ? (
          categories.map(category => renderCategoryGroup(category, groupedItems[category]))
        ) : (
          <Text style={styles.emptySectionText}>No items in this section.</Text>
        )}
      </View>
    );
  };

  if (order && (order.orderStatus === 'delivered' || order.orderStatus === 'picked_up_by_customer')) {
    return (
      <SafeAreaView style={[styles.container, styles.centered, { backgroundColor: '#FFF' }]}>
        <CompletedOrdersSVG />
        <Text style={styles.successTitle}>Order Completed</Text>
        <Text style={styles.successMessage}>
          This order has been successfully {order.orderStatus === 'delivered' ? 'delivered' : 'picked up'}.
        </Text>
        <TouchableOpacity style={styles.continueButton} onPress={handlePreviewOrder}>
          <Text style={styles.continueButtonText}>Preview Completed Order</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#06888C" />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={[styles.container, styles.centered, { backgroundColor: '#FFF' }]}>
        <Text style={styles.errorText}>Error: {error?.message}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#06888C' }]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#06888C" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowBackSVG />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Shopping List</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleNotifications} style={styles.headerAction}>
              <NotificationSVG />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'pending' && styles.activeTabItem]}
          onPress={() => setActiveTab('pending')}>
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
            Pending ({pendingCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'not_found' && styles.activeTabItem]}
          onPress={() => setActiveTab('not_found')}>
          <Text style={[styles.tabText, activeTab === 'not_found' && styles.activeTabText]}>
            Not Found ({notFoundCount})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'completed' && styles.activeTabItem]}
          onPress={() => setActiveTab('completed')}>
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>Completed ({completedCount})</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.itemsLeftContainer}>
        <View style={styles.itemsLeftCard}>
          <OrderIcon />
          <Text style={styles.itemsLeftText}>
            {itemsLeft} Items left
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'pending' && renderSection('Pending Approval', pendingItems)}
        {activeTab === 'not_found' && renderSection('Not Found', not_found_Items)}
        {activeTab === 'completed' && renderSection('Completed', completedItems)}
      </ScrollView>

      <View style={styles.footer}>
        {isShoppingComplete ? (
          isPostBagging ? (
            null
          ) : (
            order?.orderStatus === 'completed_bagging' ? (
              <TouchableOpacity 
                style={[styles.continueButton, updateOrderStatusMutation.isPending && styles.disabledButton]} 
                onPress={handleCompleteOrder}
                disabled={updateOrderStatusMutation.isPending}
              >
                <Text style={styles.continueButtonText}>
                  {updateOrderStatusMutation.isPending ? 'Processing...' : 'Complete Order'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.continueButton, updateOrderStatusMutation.isPending && styles.disabledButton]} 
                onPress={handleCompletedBagging}
                disabled={updateOrderStatusMutation.isPending}
              >
                <Text style={styles.continueButtonText}>
                  {updateOrderStatusMutation.isPending ? 'Processing...' : 'Completed Bagging'}
                </Text>
              </TouchableOpacity>
            )
          )
        ) : (
          <TouchableOpacity style={styles.continueButton} onPress={handleContinueShopping}>
            <Text style={styles.continueButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        )}
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Raleway',
    color: '#06888C',
    marginTop: 20,
  },
  successMessage: {
    fontSize: 16,
    color: '#484C52',
    textAlign: 'center',
    marginVertical: 10,
    paddingHorizontal: 40,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  emptySectionText: {
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 5,
    backgroundColor: '#F9F9F9',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: '#EFEFEF',
  },
  activeTabItem: {
    backgroundColor: '#06888C',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
  },
  header: {
    backgroundColor: '#06888C',
    paddingBottom: 19,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 21,
    paddingTop: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100, // Space for the footer
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Raleway',
    color: '#333',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#555',
    marginBottom: 12,
    marginTop: 8,
  },
  itemsGrid: {
    gap: 12,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    resizeMode: 'contain',
    backgroundColor: '#FFF',
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#484C52',
    marginBottom: 8,
  },
  itemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemQuantity: {
    fontSize: 12,
    fontFamily: 'Open Sans',
    color: '#7C7B7B',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Open Sans',
    color: '#000',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 30, // Extra padding for home bar
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  continueButton: {
    backgroundColor: '#06888C',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
  },
  disabledButton: {
    backgroundColor: '#A9A9A9',
  },
  itemsLeftContainer: {
    paddingHorizontal: 23,
    marginTop: 7,
  },
  itemsLeftCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingVertical: 9,
    paddingHorizontal: 22,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  itemsLeftText: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#000000',
    lineHeight: 22,
  }
});