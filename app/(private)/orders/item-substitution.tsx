import { useOrderDetails } from '@/hooks/api/useOrderDetails';
import { useUpdateOrderItemStatus } from '@/hooks/api/useOrderMutations';
import { Camera, CameraView } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Path, Svg } from 'react-native-svg';
import { toast } from 'sonner-native';
import { ArrowBackButtonSVG, NotificationSVG } from '../../../components/icons';

const ChatIcon = () => (
  <Svg width="23" height="22" viewBox="0 0 23 22" fill="none">
    <Path d="M4.27376 17.4166L3.42126 17.0775C3.36034 17.2307 3.34191 17.3976 3.3679 17.5604C3.39388 17.7233 3.46333 17.8762 3.56891 18.0029C3.67449 18.1296 3.8123 18.2254 3.96781 18.2804C4.12332 18.3353 4.29077 18.3472 4.45251 18.315L4.27376 17.4166ZM8.58759 16.5586L9.02209 15.751L8.73151 15.5952L8.40884 15.6594L8.58759 16.5586ZM5.76242 13.6739L6.61492 14.013L6.76434 13.6335L6.58467 13.2678L5.76242 13.6739ZM18.0238 11C18.0238 13.9755 15.4085 16.5 12.0379 16.5V18.3333C16.2922 18.3333 19.8571 15.1121 19.8571 11H18.0238ZM6.05301 11C6.05301 8.02446 8.66917 5.49996 12.0388 5.49996V3.66663C7.78459 3.66663 4.21876 6.88779 4.21876 11H6.05301ZM12.0388 5.49996C15.4085 5.49996 18.0238 8.02446 18.0238 11H19.8571C19.8571 6.88779 16.2931 3.66663 12.0388 3.66663V5.49996ZM12.0379 16.5C10.9333 16.5 9.90484 16.225 9.02209 15.751L8.15309 17.3653C9.34781 18.0058 10.6824 18.3385 12.0379 18.3333V16.5ZM4.45251 18.315L8.76634 17.457L8.40884 15.6594L4.09501 16.5174L4.45251 18.3159V18.315ZM6.58467 13.2678C6.2357 12.5627 6.0544 11.7867 6.05301 11H4.21876C4.21876 12.1 4.47726 13.1431 4.93926 14.08L6.58467 13.2678ZM4.91084 13.3347L3.42126 17.0784L5.12442 17.7549L6.61309 14.0121L4.90992 13.3347H4.91084Z" fill="white"/>
    <Path d="M8.8571 11.9166C9.36336 11.9166 9.77376 11.5062 9.77376 10.9999C9.77376 10.4937 9.36336 10.0833 8.8571 10.0833C8.35084 10.0833 7.94043 10.4937 7.94043 10.9999C7.94043 11.5062 8.35084 11.9166 8.8571 11.9166Z" fill="white"/>
    <Path d="M12.0651 11.9166C12.5714 11.9166 12.9818 11.5062 12.9818 10.9999C12.9818 10.4937 12.5714 10.0833 12.0651 10.0833C11.5588 10.0833 11.1484 10.4937 11.1484 10.9999C11.1484 11.5062 11.5588 11.9166 12.0651 11.9166Z" fill="white"/>
    <Path d="M15.2741 11.9166C15.7803 11.9166 16.1908 11.5062 16.1908 10.9999C16.1908 10.4937 15.7803 10.0833 15.2741 10.0833C14.7678 10.0833 14.3574 10.4937 14.3574 10.9999C14.3574 11.5062 14.7678 11.9166 15.2741 11.9166Z" fill="white"/>
  </Svg>
);

const ScanIcon = () => (
  <Svg width="18" height="19" viewBox="0 0 18 19" fill="none" stroke="#FFF" strokeWidth="2">
    <Path d="M1 5.5V3.5C1 2.96957 1.21071 2.46086 1.58579 2.08579C1.96086 1.71071 2.46957 1.5 3 1.5H5M1 13.5V15.5C1 16.0304 1.21071 16.5391 1.58579 16.9142C1.96086 17.2893 2.46957 17.5 3 17.5H5M13 1.5H15C15.5304 1.5 16.0391 1.71071 16.4142 2.08579C16.7893 2.46086 17 2.96957 17 3.5V5.5M13 17.5H15C15.5304 17.5 16.0391 17.2893 16.4142 16.9142C16.7893 16.5391 17 16.0304 17 15.5V13.5M4 9.5H14" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export default function ItemSubstitutionScreen() {
  const { orderId, itemId } = useLocalSearchParams<{ orderId: string; itemId: string }>();
  const { data: order, isLoading } = useOrderDetails(orderId);
  const { mutate: updateItemStatus, isPending: isUpdating } = useUpdateOrderItemStatus();

  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (currentItem && !initialized) {
      setQuantity(String(currentItem.quantity || 1));
      setInitialized(true);
    }
  }, [currentItem, initialized]);

  const currentItem = useMemo(() => {
    return order?.orderItems?.find(i => i.id === itemId);
  }, [order, itemId]);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getCameraPermissions();
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  const handleNotifications = () => {
    console.log('Open notifications');
  };

  const handleChatCustomer = () => {
    console.log('Chat with customer');
  };

  const handleNoSubstitution = () => {
    if (!orderId || !itemId) return;

    const payload = { status: 'NOT_FOUND' };

    updateItemStatus({ orderId, itemId, payload }, {
      onSuccess: () => {
        toast.success("Item marked as not found");
        router.back();
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to update item status");
      }
    });
  };

  const handleScanItem = () => {
    if (hasPermission === null) {
      toast.info('Requesting camera permission...');
      return;
    }
    if (hasPermission === false) {
      toast.error('No camera access');
      return;
    }
    setScanned(false);
    setIsScannerVisible(true);
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    setIsScannerVisible(false);

    if (!orderId || !itemId) {
      toast.error("Missing order or item information");
      return;
    }

    // Check if scanned barcode matches any suggested replacement
    const replacement = currentItem?.replacements?.find((r: any) => r.product?.barcode === data);
    
    console.log('Scanned Barcode:', data);
    console.log('Found Replacement:', replacement);

    const payload: any = {
      status: 'REPLACED',
      quantityFound: parseInt(quantity, 10) || 1,
      // If we found a matching replacement in the suggestions, send its ID.
      // Otherwise send the barcode so backend can handle ad-hoc substitution.
      ...(replacement ? { chosenReplacementId: replacement.id } : { replacementBarcode: data }),
    };

    console.log('Submitting substitution payload:', JSON.stringify(payload, null, 2));

    updateItemStatus({ orderId, itemId, payload }, {
      onSuccess: () => {
        toast.success("Item substituted successfully");
        router.back();
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to substitute item");
        setScanned(false);
      }
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#06888C' }]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#06888C" />
      {/* Header Section */}
      <View style={styles.headerSection}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                <ArrowBackButtonSVG width={30} height={30} color="white" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Item substitution</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={handleNotifications}>
                <NotificationSVG width={24} height={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
      </View>

      <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      {isLoading ? (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#06888C" />
        </View>
      ) : (
        <>
      {!currentItem ? (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ fontSize: 16, color: '#666', marginBottom: 20 }}>Item not found</Text>
          <TouchableOpacity onPress={handleGoBack} style={{ padding: 10, backgroundColor: '#06888C', borderRadius: 8 }}>
            <Text style={{ color: '#FFF' }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
      <>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Delivery Info Section */}
        <View style={styles.deliverySection}>
          <View style={styles.deliveryHeader}>
            <Text style={styles.deliveryTime}>Deliver by 10:00 AM</Text>
            <View style={styles.itemsLeftContainer}>
              <Text style={styles.itemsLeftText}>13 Items left</Text>
              <View style={styles.progressBar}>
                <View style={styles.progressFill} />
              </View>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Ordered Item Card */}
          <View style={styles.orderedItemCard}>
            <View style={styles.itemRow}>
              <View style={styles.itemImageContainer}>
                <Image 
                source={{ uri: currentItem?.vendorProduct?.images?.[0] || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentItem?.vendorProduct?.name || 'Item')}&background=F0F0F0&color=06888C&size=100` }}
                  style={styles.itemImage}
                />
              </View>
              <View style={styles.itemDetails}>
                <Text style={styles.itemLabel}>{currentItem?.vendorProduct?.name}</Text>
                <Text style={styles.itemDescription}>{currentItem?.vendorProduct?.description}</Text>
                <View style={styles.itemBottomRow}>
                  <Text style={styles.itemPrice}>${currentItem?.vendorProduct?.price?.toFixed(2)}</Text>
                  <Text style={styles.quantityFound}>
                    {currentItem?.quantityFound ?? 0} of {currentItem?.quantity} found
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quantity Input */}
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantity to substitute</Text>
            <TextInput
              style={styles.quantityInput}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              placeholder="Enter quantity"
            />
          </View>

          {/* Substitution Guidance */}
          <View style={styles.guidanceSection}>
            <Text style={styles.guidanceTitle}>Feel free to pick your own substitution</Text>
            <Text style={styles.guidanceText}>
              We suggest finding an item similar in price, size, quantity or type.
            </Text>
          </View>

          {/* Chat Customer Section */}
          <View style={styles.chatSection}>
            <Text style={styles.chatText}>
              Feeling unsure about what to pick? you can always chat the customer
            </Text>
            <TouchableOpacity style={styles.chatButton} onPress={handleChatCustomer}>
              <ChatIcon />
              <Text style={styles.chatButtonText}>Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity 
          style={[styles.noSubstitutionButton, isUpdating && { opacity: 0.5 }]} 
          onPress={handleNoSubstitution}
          disabled={isUpdating}
        >
          <Text style={styles.noSubstitutionText}>No substitution found</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.scanButton, isUpdating && { opacity: 0.5 }]} onPress={handleScanItem} disabled={isUpdating}>
          {isUpdating ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <ScanIcon />
              <Text style={styles.scanButtonText}>Scan Item</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      </>
      )}
      </>
      )}
      </View>

      <Modal
        visible={isScannerVisible}
        animationType="slide"
        onRequestClose={() => setIsScannerVisible(false)}
      >
        <View style={styles.scannerContainer}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            onBarcodeScanned={handleBarCodeScanned}
            barcodeScannerSettings={{ barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "qr", "code128"] }}
          />
          <TouchableOpacity style={styles.scannerCloseButton} onPress={() => setIsScannerVisible(false)}><Text style={styles.scannerCloseText}>Cancel</Text></TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  headerSection: {
    backgroundColor: '#06888C',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
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
  scrollView: {
    flex: 1,
  },
  deliverySection: {
    paddingHorizontal: 21,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
    shadowColor: 'rgba(0, 0, 0, 0.20)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 9,
    elevation: 2,
    backgroundColor: '#FFF',
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  deliveryTime: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#101010',
  },
  itemsLeftContainer: {
    width: 123,
    gap: 4,
  },
  itemsLeftText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#06888C',
    textAlign: 'right',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#D9D9D9',
    borderRadius: 16,
  },
  progressFill: {
    width: 18,
    height: 4,
    backgroundColor: '#06888C',
    borderRadius: 16,
  },
  mainContent: {
    padding: 27,
    paddingHorizontal: 21,
    backgroundColor: '#FAFAFB',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    gap: 21,
  },
  orderedItemCard: {
    padding: 16,
    paddingHorizontal: 17,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#FFF',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  itemImageContainer: {
    width: 81,
    height: 76,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  itemImage: {
    width: 57,
    height: 57,
    resizeMode: 'contain',
  },
  itemDetails: {
    flex: 1,
    gap: 6,
  },
  itemLabel: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#000',
  },
  itemDescription: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#484C52',
    lineHeight: 16,
  },
  itemBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#000',
  },
  quantityFound: {
    fontSize: 12,
    fontWeight: '300',
    fontFamily: 'Open Sans',
    color: '#7C7B7B',
    textAlign: 'right',
  },
  guidanceSection: {
    gap: 8,
  },
  guidanceTitle: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#000',
  },
  guidanceText: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#7C7B7B',
    lineHeight: 16,
  },
  chatSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 17,
    paddingHorizontal: 22,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#06888C',
    backgroundColor: '#FAFAFB',
  },
  chatText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#707070',
    lineHeight: 20,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#06888C',
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 9,
    elevation: 2,
  },
  chatButtonText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Raleway',
    color: '#FFF',
  },
  bottomActions: {
    paddingHorizontal: 22,
    paddingBottom: 32,
    gap: 13,
    backgroundColor: '#FFF',
  },
  noSubstitutionButton: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#06888C',
    backgroundColor: 'transparent',
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 9,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noSubstitutionText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#000',
    lineHeight: 25,
    textAlign: 'center',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 16,
    backgroundColor: '#06888C',
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 9,
    elevation: 2,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
    lineHeight: 25,
    textAlign: 'center',
  },
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  scannerCloseButton: {
    position: 'absolute',
    bottom: 50,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
  },
  scannerCloseText: {
    color: '#000',
    fontSize: 16,
  },
  quantityContainer: {
    gap: 8,
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#000',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#B4BED4',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Open Sans',
    color: '#000',
    backgroundColor: '#FFF',
  },
});
