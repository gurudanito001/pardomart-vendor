import { OrderApi } from '@/api';
import { apiConfig } from '@/api/config';
import { OrderStatus } from '@/api/models';
import { useOrderDetails } from '@/hooks/api/useOrderDetails';
import { useImagePicker } from '@/hooks/useImagePicker';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  Linking,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

import { Path, Svg } from 'react-native-svg';

// Import existing components
import { ArrowBackSVG, ChatFilledSVG, NotificationSVG, PhoneOutlineSVG } from '@/components/icons';
import { Button } from '@/components/ui';
import { colors, shadows, spacing, typography } from '@/styles/theme';

const DeliveryMethodIcon = ({ method }: { method?: string }) => {
  if (method === 'customer_pickup') {
    return (
      <Svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        <Path d="M60 52.5C68.2843 52.5 75 45.7843 75 37.5C75 29.2157 68.2843 22.5 60 22.5C51.7157 22.5 45 29.2157 45 37.5C45 45.7843 51.7157 52.5 60 52.5ZM60 60C43.4315 60 30 73.4315 30 90V97.5H90V90C90 73.4315 76.5685 60 60 60Z" fill="black"/>
      </Svg>
    );
  }
  return (
    <Svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <Path d="M15 60H60V67.5H15V60ZM7.5 41.25H45V48.75H7.5V41.25Z" fill="black"/>
      <Path d="M112.196 62.2725L100.946 36.0225C100.657 35.3481 100.176 34.7733 99.5635 34.3694C98.9509 33.9654 98.2333 33.7501 97.4995 33.75H86.2495V26.25C86.2495 25.2554 85.8545 24.3016 85.1512 23.5984C84.4479 22.8951 83.4941 22.5 82.4995 22.5H22.4995V30H78.7495V77.085C77.0418 78.0785 75.5472 79.3996 74.3515 80.9724C73.1558 82.5452 72.2826 84.3388 71.782 86.25H48.217C47.3043 82.715 45.1337 79.6343 42.112 77.5852C39.0903 75.5362 35.4251 74.6595 31.8033 75.1196C28.1815 75.5796 24.8518 77.3447 22.4383 80.0841C20.0249 82.8235 18.6934 86.3491 18.6934 90C18.6934 93.6509 20.0249 97.1765 22.4383 99.9159C24.8518 102.655 28.1815 104.42 31.8033 104.88C35.4251 105.34 39.0903 104.464 42.112 102.415C45.1337 100.366 47.3043 97.285 48.217 93.75H71.782C72.5978 96.9684 74.4634 99.8229 77.0837 101.862C79.704 103.901 82.9294 105.008 86.2495 105.008C89.5697 105.008 92.7951 103.901 95.4154 101.862C98.0357 99.8229 99.9013 96.9684 100.717 93.75H108.75C109.744 93.75 110.698 93.3549 111.401 92.6517C112.104 91.9484 112.5 90.9946 112.5 90V63.75C112.499 63.242 112.396 62.7393 112.196 62.2725ZM33.7495 97.5C32.2662 97.5 30.8161 97.0601 29.5828 96.236C28.3494 95.4119 27.3881 94.2406 26.8204 92.8701C26.2528 91.4997 26.1043 89.9917 26.3937 88.5368C26.683 87.082 27.3974 85.7456 28.4462 84.6967C29.4951 83.6478 30.8315 82.9335 32.2864 82.6441C33.7412 82.3547 35.2492 82.5032 36.6197 83.0709C37.9901 83.6386 39.1615 84.5999 39.9856 85.8332C40.8097 87.0666 41.2495 88.5166 41.2495 90C41.2495 91.9891 40.4594 93.8968 39.0528 95.3033C37.6463 96.7098 35.7387 97.5 33.7495 97.5ZM86.2495 41.25H95.0246L103.065 60H86.2495V41.25ZM86.2495 97.5C84.7662 97.5 83.3161 97.0601 82.0828 96.236C80.8494 95.4119 79.8881 94.2406 79.3205 92.8701C78.7528 91.4997 78.6043 89.9917 78.8937 88.5368C79.183 87.082 79.8974 85.7456 80.9462 84.6967C81.9951 83.6478 83.3315 82.9335 84.7864 82.6441C86.2412 82.3547 87.7492 82.5032 89.1197 83.0709C90.4901 83.6386 91.6615 84.5999 92.4856 85.8332C93.3097 87.0666 93.7495 88.5166 93.7495 90C93.7495 91.9891 92.9594 93.8968 91.5528 95.3033C90.1463 96.7098 88.2387 97.5 86.2495 97.5ZM105 86.25H100.717C99.891 83.0379 98.0224 80.1907 95.4042 78.1547C92.786 76.1188 89.5662 75.0092 86.2495 75V67.5H105V86.25Z" fill="black"/>
    </Svg>
  );
};

// Shopping bag icon for the info card
const ShoppingBagIcon = () => (
  <Svg width="25" height="25" viewBox="0 0 25 25" fill="none">
    <Path fillRule="evenodd" clipRule="evenodd" d="M8.08443 4.6875H16.9157C17.4907 4.68754 18.0457 4.89898 18.475 5.28158C18.9042 5.66419 19.1779 6.19126 19.2438 6.7625L20.5063 17.7C20.5442 18.0283 20.5122 18.3608 20.4125 18.6759C20.3128 18.9909 20.1476 19.2814 19.9278 19.5281C19.7079 19.7748 19.4384 19.9722 19.1369 20.1074C18.8353 20.2426 18.5086 20.3125 18.1782 20.3125H6.82193C6.49148 20.3125 6.16477 20.2426 5.86324 20.1074C5.56171 19.9722 5.29218 19.7748 5.07232 19.5281C4.85247 19.2814 4.68728 18.9909 4.58757 18.6759C4.48787 18.3608 4.45592 18.0283 4.49381 17.7L5.75631 6.7625C5.82225 6.19126 6.09589 5.66419 6.52517 5.28158C6.95444 4.89898 7.5094 4.68754 8.08443 4.6875ZM3.42818 6.49375C3.56006 5.35126 4.10734 4.29713 4.9659 3.53192C5.82445 2.76671 6.93436 2.34383 8.08443 2.34375H16.9157C18.0658 2.34383 19.1757 2.76671 20.0342 3.53192C20.8928 4.29713 21.4401 5.35126 21.5719 6.49375L22.8344 17.4313C22.9102 18.0878 22.8463 18.7529 22.6469 19.383C22.4475 20.0131 22.1171 20.594 21.6774 21.0874C21.2377 21.5808 20.6986 21.9756 20.0956 22.246C19.4925 22.5164 18.8391 22.6562 18.1782 22.6562H6.82193C6.16103 22.6562 5.50761 22.5164 4.90455 22.246C4.30149 21.9756 3.76242 21.5808 3.32271 21.0874C2.88301 20.594 2.55262 20.0131 2.35321 19.383C2.15381 18.7529 2.0899 18.0878 2.16568 17.4313L3.42818 6.49375ZM7.81256 8.20312C7.81256 7.89232 7.93602 7.59425 8.15579 7.37448C8.37556 7.15472 8.67363 7.03125 8.98443 7.03125C9.29523 7.03125 9.59331 7.15472 9.81308 7.37448C10.0328 7.59425 10.1563 7.89232 10.1563 8.20312V8.59375C10.1563 9.21535 10.4032 9.81149 10.8428 10.251C11.2823 10.6906 11.8785 10.9375 12.5001 10.9375C13.1217 10.9375 13.7178 10.6906 14.1573 10.251C14.5969 9.81149 14.8438 9.21535 14.8438 8.59375V8.20312C14.8438 7.89232 14.9673 7.59425 15.187 7.37448C15.4068 7.15472 15.7049 7.03125 16.0157 7.03125C16.3265 7.03125 16.6246 7.15472 16.8443 7.37448C17.0641 7.59425 17.1876 7.89232 17.1876 8.20312V8.59375C17.1876 9.83695 16.6937 11.0292 15.8146 11.9083C14.9355 12.7874 13.7433 13.2812 12.5001 13.2812C11.2569 13.2812 10.0646 12.7874 9.1855 11.9083C8.30642 11.0292 7.81256 9.83695 7.81256 8.59375V8.20312Z" fill="white"/>
  </Svg>
);

export default function CompleteShoppingScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { data: order, isLoading } = useOrderDetails(orderId);
  const queryClient = useQueryClient();
  const orderApi = useMemo(() => new OrderApi(apiConfig), []);
  const [isOptionModalVisible, setOptionModalVisible] = useState(false);

  const { selectedImage, pickFromGallery, pickFromCamera, reset: resetImage } = useImagePicker({
    base64: true,
    allowsEditing: true,
    quality: 0.7,
  });

  // State guard: If order is already completed, skip to success screen
  useEffect(() => {
    if (order && !isLoading) {
      const status = order.orderStatus;
      if (status === 'ready_for_pickup' || status === 'ready_for_delivery') {
        router.replace({ pathname: '/(private)/orders/success', params: { orderId } });
      } else if (['picked_up_by_customer', 'en_route_to_delivery', 'delivered'].includes(status || '')) {
        router.replace({ pathname: '/(private)/orders/order-details', params: { orderId } });
      } else if (status === 'currently_shopping' || status === 'accepted_for_shopping') {
        router.replace({ pathname: '/(private)/orders/shopping-list', params: { orderId } });
      }
    }
  }, [order, isLoading, orderId]);

  const updateOrderStatusMutation = useMutation({
    mutationFn: (payload: { orderStatus: OrderStatus; proofOfDeliveryImageUrl?: string }) => {
      if (!orderId) throw new Error('Order ID is missing');
      // Use the generic update order endpoint as requested
      return orderApi.orderIdPatch(payload as any, orderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orderDetails', orderId] });
      queryClient.invalidateQueries({ queryKey: ['vendorOrders'] });
      router.replace({
        pathname: '/(private)/orders/success',
        params: { orderId },
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to update order status.');
    },
  });

  const handleBackPress = () => {
    router.back();
  };

  const handleChatCustomer = () => {
    if (!order?.user) {
      toast.error('Customer details not available');
      return;
    }
    router.push({
      pathname: '/(private)/orders/chat',
      params: { orderId: orderId!, customer: JSON.stringify(order.user) },
    });
  };

  const handleCallCustomer = () => {
    if (order?.user?.mobileNumber) {
      Linking.openURL(`tel:${order.user.mobileNumber}`);
    } else {
      toast.error('Customer phone number is not available.');
    }
  };

  const handleCompleteShoppingPress = () => {
    if (!order) return;

    let nextStatus: OrderStatus | undefined;
    if (order.deliveryMethod === 'customer_pickup') {
      nextStatus = 'ready_for_pickup';
    } else if (order.deliveryMethod === 'delivery_person') {
      nextStatus = 'ready_for_delivery';
    }

    if (nextStatus) {
      const payload: any = { orderStatus: nextStatus };
      if (selectedImage?.base64) {
        payload.proofOfDeliveryImageUrl = `data:image/jpeg;base64,${selectedImage.base64}`;
      }
      updateOrderStatusMutation.mutate(payload);
    } else {
      toast.error('Invalid delivery method');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.primary }]} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <ArrowBackSVG width={30} height={30} color="white" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Complete Shopping</Text>
        
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={handleChatCustomer}>
            <ChatFilledSVG width={24} height={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleCallCustomer}>
            <PhoneOutlineSVG width={24} height={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <NotificationSVG width={24} height={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Main Content */}
      <View style={styles.content}>
        {/* Bagging Proof Section */}
        {order?.deliveryMethod === 'customer_pickup' && (
          <View style={styles.uploadSection}>
            <Text style={styles.uploadTitle}>Photo of items</Text>
            <Text style={styles.uploadSubtitle}>
              (Optional) Upload a photo of the bagged items to provide confirmation to the customer.
            </Text>

            <TouchableOpacity 
              style={[styles.uploadBox, selectedImage && styles.uploadBoxActive]} 
              onPress={() => setOptionModalVisible(true)}
            >
              {selectedImage ? (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: selectedImage.uri }} style={styles.imagePreview} />
                  <TouchableOpacity style={styles.changeImageBtn} onPress={() => setOptionModalVisible(true)}>
                    <Text style={styles.changeImageText}>Change Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.removeImageBadge} onPress={resetImage}>
                    <Ionicons name="close" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <View style={styles.cameraIconContainer}>
                    <Ionicons name="camera-outline" size={40} color={colors.primary} />
                  </View>
                  <Text style={styles.uploadPlaceholderText}>Take or choose a bagging photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Information Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconContainer}>
            <View style={styles.shoppingBagCircle}>
              <ShoppingBagIcon />
            </View>
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}>
              {order?.deliveryMethod === 'customer_pickup'
                ? 'The customer will come to pick up their order.'
                : 'The order will be pushed to delivery persons to deliver to the customer.'}
            </Text>
          </View>
        </View>
      </View>

      {/* Complete Shopping Button */}
      <View style={styles.buttonContainer}>
        <Button
          title="Complete Shopping"
          onPress={handleCompleteShoppingPress}
          variant="primary"
          size="large"
          fullWidth
          style={styles.completeButton}
          loading={updateOrderStatusMutation.isPending}
          disabled={updateOrderStatusMutation.isPending}
        />
      </View>

      {/* Selection Modal */}
      <Modal
        visible={isOptionModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setOptionModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setOptionModalVisible(false)}
        >
          <View style={styles.optionModalContent}>
            <Text style={styles.modalTitle}>Proof of Bagging</Text>
            <Text style={styles.modalSubtitle}>Select a source for your image</Text>
            
            <TouchableOpacity 
              style={styles.optionButton} 
              onPress={async () => {
                setOptionModalVisible(false);
                await pickFromCamera();
              }}
            >
              <Ionicons name="camera" size={24} color={colors.primary} />
              <Text style={styles.optionButtonText}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.optionButton} 
              onPress={async () => {
                setOptionModalVisible(false);
                await pickFromGallery();
              }}
            >
              <Ionicons name="images" size={24} color={colors.primary} />
              <Text style={styles.optionButtonText}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelOptionButton} 
              onPress={() => setOptionModalVisible(false)}
            >
              <Text style={styles.cancelOptionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: 19,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    fontFamily: typography.families.accent,
    color: colors.background,
    flex: 1,
    marginLeft: 10,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: spacing.lg,
  },
  uploadSection: {
    marginBottom: 40,
  },
  uploadTitle: {
    fontSize: 22,
    fontFamily: typography.families.accent,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  uploadSubtitle: {
    fontSize: 14,
    fontFamily: typography.families.secondary,
    color: '#7C7B7B',
    marginBottom: 24,
    lineHeight: 20,
  },
  uploadBox: {
    width: '100%',
    height: 240,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    backgroundColor: '#FAFAFB',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  uploadBoxActive: {
    borderStyle: 'solid',
    borderColor: colors.primary,
  },
  uploadPlaceholder: {
    alignItems: 'center',
    gap: 12,
  },
  cameraIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(6, 136, 140, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadPlaceholderText: {
    fontSize: 14,
    fontFamily: typography.families.secondary,
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
  imagePreviewContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  changeImageBtn: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  changeImageText: {
    color: 'white',
    fontFamily: typography.families.secondary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  removeImageBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF4444',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 14,
    width: '100%',
    ...shadows.md,
  },
  infoIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shoppingBagCircle: {
    width: 40,
    height: 40,
    backgroundColor: '#BFE3C6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoText: {
    fontSize: 12,
    fontFamily: typography.families.secondary,
    color: '#898A8D',
    lineHeight: 16,
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
  },
  completeButton: {
    paddingVertical: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  optionModalContent: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: typography.families.accent,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: typography.families.secondary,
    color: '#7C7B7B',
    marginBottom: 24,
    textAlign: 'center',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    marginBottom: 12,
    gap: 16,
  },
  optionButtonText: {
    fontSize: 16,
    fontFamily: typography.families.secondary,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  cancelOptionButton: {
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelOptionText: {
    fontSize: 16,
    fontFamily: typography.families.accent,
    fontWeight: typography.weights.bold,
    color: '#FF4444',
  },
});
