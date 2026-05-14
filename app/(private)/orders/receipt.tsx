import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import * as Print from 'expo-print';
import { router, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ViewShot from 'react-native-view-shot';
import { apiConfig } from '../../../api/config';
import { OrderApi } from '../../../api/endpoints/order-api';
import { ArrowBackButtonSVG } from '../../../components/icons';
import { toast } from '../../../utils/toast';

const DashedDivider = () => <View style={styles.dashedDivider} />;

export default function ReceiptScreen() {
  const _params = useLocalSearchParams();
  const orderId = Array.isArray(_params?.orderId)
    ? _params.orderId[0]
    : (_params?.orderId as string | undefined);

  const orderApi = useMemo(() => new OrderApi(apiConfig), []);
  const viewShotRef = useRef<ViewShot>(null);

  const { data: order, isLoading } = useQuery({
    queryKey: ['order-receipt', orderId],
    queryFn: async () => {
      const response = await orderApi.orderIdGet(orderId!);
      return response.data;
    },
    enabled: !!orderId,
  });

  // Calculate the raw item subtotal based on the items in the order
  const itemSubtotal = order?.orderItems?.reduce((sum: number, item: any) => {
    const product = item.chosenReplacement?.vendorProduct || item.vendorProduct;
    return sum + (((product?.discountedPrice || product?.price) || 0) * (item.quantityFound ?? item.quantity ?? 1));
  }, 0) || 0;

  const tip = (order?.shopperTip || 0) + (order?.deliveryPersonTip || 0);

  const orderDate = new Date(order?.createdAt || Date.now()).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const generateReceiptHtml = () => {
    const itemsHtml = order?.orderItems?.map((item: any) => {
      const product = item.chosenReplacement?.vendorProduct || item.vendorProduct || {};
      const qty = item.quantityFound ?? item.quantity ?? 1;
      const price = product.discountedPrice || product.price || 0;
      const lineTotal = qty * price;
      return `
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <div style="flex: 1;">
            <div style="font-size: 14px; font-weight: 600;">${product.name || 'Product'}</div>
            <div style="font-size: 12px; color: #7C7B7B;">${qty} x $${price.toFixed(2)}</div>
          </div>
          <div style="font-size: 14px; font-weight: 600;">$${lineTotal.toFixed(2)}</div>
        </div>
      `;
    }).join('') || '';

    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #100A37; padding: 40px; }
            .header { text-align: center; margin-bottom: 20px; }
            .store-name { font-size: 24px; font-weight: bold; margin-bottom: 4px; }
            .store-address { font-size: 14px; color: #7C7B7B; }
            .divider { border-bottom: 1px dashed #E0E9F5; margin: 20px 0; }
            .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .label { font-size: 14px; color: #7C7B7B; }
            .value { font-size: 14px; font-weight: bold; }
            .total-row { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
            .total-label { font-size: 18px; font-weight: bold; }
            .total-value { font-size: 20px; font-weight: bold; color: #F48022; }
            .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="store-name">${order?.vendor?.name || 'PardoMart Store'}</div>
            <div class="store-address">${order?.vendor?.description || 'Online Marketplace'}</div>
          </div>
          <div class="divider"></div>
          <div class="row">
            <div class="label">Order Code:</div>
            <div class="value">#${order?.orderCode}</div>
          </div>
          <div class="row">
            <div class="label">Date:</div>
            <div class="value">${orderDate}</div>
          </div>
          <div class="row">
            <div class="label">Payment Method:</div>
            <div class="value">${order?.paymentMethod || 'Card'}</div>
          </div>
          <div class="row">
            <div class="label">Shopper:</div>
            <div class="value">${order?.shopper?.name || 'N/A'}</div>
          </div>
          <div class="divider"></div>
          <div class="section-title">Items</div>
          ${itemsHtml}
          <div class="divider"></div>
          <div class="row">
            <div class="label">Subtotal</div>
            <div class="value">$${itemSubtotal.toFixed(2)}</div>
          </div>
          <div class="row">
            <div class="label">Shopping Fee</div>
            <div class="value">$${(order?.shoppingFee || 0).toFixed(2)}</div>
          </div>
          <div class="row">
            <div class="label">Delivery Fee</div>
            <div class="value">$${(order?.deliveryFee || 0).toFixed(2)}</div>
          </div>
          <div class="row">
            <div class="label">Service Fee</div>
            <div class="value">$${(order?.serviceFee || 0).toFixed(2)}</div>
          </div>
          ${tip > 0 ? `
          <div class="row">
            <div class="label">Tip</div>
            <div class="value">$${tip.toFixed(2)}</div>
          </div>` : ''}
          <div class="divider"></div>
          <div class="total-row">
            <div class="total-label">Total Amount</div>
            <div class="total-value">$${(order?.totalAmount || 0).toFixed(2)}</div>
          </div>
        </body>
      </html>
    `;
  };

  const shareAsImage = async () => {
    try {
      if (viewShotRef.current?.capture) {
        const uri = await viewShotRef.current.capture();
        await Sharing.shareAsync(uri, { mimeType: 'image/jpeg', dialogTitle: 'Share Receipt Image' });
      }
    } catch (error) {
      toast.error('Failed to generate image');
    }
  };

  const shareAsPdf = async () => {
    try {
      const html = generateReceiptHtml();
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Share Receipt PDF' });
    } catch (error) {
      toast.error('Failed to generate PDF');
    }
  };

    const handleBackPress = () => {
        router.back();
    };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]} edges={['top', 'left', 'right']}>
        <ActivityIndicator size="large" color="#F48022" />
        <Text style={styles.loadingText}>Loading Receipt...</Text>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={[styles.container, styles.center]} edges={['top', 'left', 'right']}>
        <Text style={styles.errorText}>Receipt not found.</Text>
        <Pressable style={styles.backButtonFallback} onPress={() => router.back()}>
          <Text style={styles.backButtonFallbackText}>Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                  <ArrowBackButtonSVG width={30} height={30} color="white" />
                </TouchableOpacity>
        <Text style={styles.headerTitle}>E-Receipt</Text>
        <View style={{ width: 30 }} />
        {/* Spacer to center the title */}
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        
        {/* Receipt Card */}
        <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }}>
          <View style={styles.receiptCard}>
          
          {/* Store Info */}
          <View style={styles.receiptHeader}>
            <Text style={styles.storeName}>{order.vendor?.name || 'PardoMart Store'}</Text>
            <Text style={styles.storeAddress}>{order.vendor?.description || 'Online Marketplace'}</Text>
          </View>

          <DashedDivider />

          {/* Order Info */}
          <View style={styles.orderMetadata}>
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>Order Code:</Text>
              <Text style={styles.metadataValue}>#{order.orderCode}</Text>
            </View>
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>Date:</Text>
              <Text style={styles.metadataValue}>{orderDate}</Text>
            </View>
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>Payment Method:</Text>
              <Text style={styles.metadataValue}>{order.paymentMethod || 'Card'}</Text>
            </View>
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>Shopper:</Text>
              <Text style={styles.metadataValue}>{order.shopper?.name ?? 'N/A'}</Text>
            </View>
          </View>

          <DashedDivider />

          {/* Items List */}
          <View style={styles.itemsSection}>
            <Text style={styles.sectionTitle}>Items</Text>
            {order.orderItems?.map((item: any) => {
              const product = item.chosenReplacement?.vendorProduct || item.vendorProduct || {};
              const qty = item.quantityFound ?? item.quantity ?? 1;
              const price = product.discountedPrice || product.price || 0;
              const lineTotal = qty * price;
              
              return (
                <View key={item.id} style={styles.itemRow}>
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{product.name || 'Product'}</Text>
                    <Text style={styles.itemQty}>{qty} x ${price.toFixed(2)}</Text>
                  </View>
                  <Text style={styles.itemLineTotal}>${lineTotal.toFixed(2)}</Text>
                </View>
              );
            })}
          </View>

          <DashedDivider />

          {/* Cost Breakdown */}
          <View style={styles.breakdownSection}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Subtotal</Text>
              <Text style={styles.breakdownValue}>${itemSubtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Shopping Fee</Text>
              <Text style={styles.breakdownValue}>${(order.shoppingFee || 0).toFixed(2)}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Delivery Fee</Text>
              <Text style={styles.breakdownValue}>${(order.deliveryFee || 0).toFixed(2)}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Service Fee</Text>
              <Text style={styles.breakdownValue}>${(order.serviceFee || 0).toFixed(2)}</Text>
            </View>
            {tip > 0 ? (
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Tip</Text>
                <Text style={styles.breakdownValue}>${tip.toFixed(2)}</Text>
              </View>
            ) : null}
          </View>

          <DashedDivider />

          {/* Total */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>${(order.totalAmount || 0).toFixed(2)}</Text>
          </View>

        </View>
        </ViewShot>

        {/* Share Buttons */}
        <View style={styles.shareButtonsContainer}>
          <Pressable style={styles.shareButton} onPress={shareAsImage}>
            <Ionicons name="image-outline" size={20} color="#06888C" />
            <Text style={styles.shareButtonText}>Share as Image</Text>
          </Pressable>
          <Pressable style={styles.shareButton} onPress={shareAsPdf}>
            <Ionicons name="document-text-outline" size={20} color="#06888C" />
            <Text style={styles.shareButtonText}>Share as PDF</Text>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 14,
    color: '#7C7B7B',
    fontFamily: 'OpenSans-SemiBold',
  },
  errorText: {
    fontSize: 16,
    color: '#06888C',
    fontFamily: 'OpenSans-Bold',
    marginBottom: 20,
  },
  backButtonFallback: {
    backgroundColor: '#06888C',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonFallbackText: {
    color: '#FFF',
    fontFamily: 'Raleway-Bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 21,
    paddingTop: 10,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Raleway-Bold',
    color: '#000',
  },
  scrollContent: {
    flex: 1,
  },
  scrollPadding: {
    paddingHorizontal: 21,
    paddingBottom: 40,
    paddingTop: 10,
  },
  receiptCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    ...(Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 10 },
      android: { elevation: 4 },
      web: { boxShadow: '0 4px 15px rgba(0,0,0,0.06)' },
    }) as any),
    marginBottom: 25,
  },
  receiptHeader: { alignItems: 'center', marginBottom: 20 },
  storeName: { fontSize: 20, fontFamily: 'Raleway-Bold', color: '#100A37', marginBottom: 4 },
  storeAddress: { fontSize: 12, fontFamily: 'OpenSans-Regular', color: '#7C7B7B', textAlign: 'center' },
  dashedDivider: { width: '100%', height: 1, borderWidth: 1, borderColor: '#E0E9F5', borderStyle: 'dashed', marginVertical: 20 },
  orderMetadata: { gap: 10 },
  metadataRow: { flexDirection: 'row', justifyContent: 'space-between' },
  metadataLabel: { fontSize: 12, fontFamily: 'OpenSans-Regular', color: '#7C7B7B' },
  metadataValue: { fontSize: 12, fontFamily: 'OpenSans-SemiBold', color: '#100A37' },
  itemsSection: { gap: 12 },
  sectionTitle: { fontSize: 14, fontFamily: 'OpenSans-Bold', color: '#100A37', marginBottom: 5 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  itemDetails: { flex: 1, paddingRight: 10 },
  itemName: { fontSize: 14, fontFamily: 'OpenSans-SemiBold', color: '#100A37', marginBottom: 4 },
  itemQty: { fontSize: 12, fontFamily: 'OpenSans-Regular', color: '#7C7B7B' },
  itemLineTotal: { fontSize: 14, fontFamily: 'OpenSans-SemiBold', color: '#100A37' },
  breakdownSection: { gap: 10 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between' },
  breakdownLabel: { fontSize: 12, fontFamily: 'OpenSans-Regular', color: '#7C7B7B' },
  breakdownValue: { fontSize: 12, fontFamily: 'OpenSans-SemiBold', color: '#100A37' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 16, fontFamily: 'OpenSans-Bold', color: '#100A37' },
  totalValue: { fontSize: 18, fontFamily: 'OpenSans-Bold', color: '#06888C' },
  shareButtonsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
  shareButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 6, paddingHorizontal: 5 },
  shareButtonText: { color: '#06888C', fontSize: 14, fontFamily: 'Raleway-Bold' },
  backButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});