import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Path, Rect, Svg } from 'react-native-svg';
import { ArrowBackButtonSVG, NotificationSVG, PhoneOutlineSVG, SupportSVG } from '../../components/icons';

interface ShoppingItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description: string;
  size: string;
  upc: string;
  isPerishable: boolean;
}

const MOCK_ITEMS: ShoppingItem[] = [
  {
    id: '1',
    name: 'Chicken Item',
    price: 31.21,
    quantity: 2,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/bffa3d330bb5259b8db85d1d8667ade35b3bd9ee?width=330',
    description: 'Valbet fully cooked chicken nuggets - frozen, 9g protein per4 nugget serving, 24 oz (1.5lb) Bag',
    size: '24 oz',
    upc: '76335342',
    isPerishable: true,
  },
  {
    id: '2',
    name: 'Chicken Item',
    price: 31.21,
    quantity: 2,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/6b68a047fc4c8322cdc7628a005b839185f29a09?width=370',
    description: 'Valbet fully cooked chicken nuggets - frozen, 9g protein per4 nugget serving, 24 oz (1.5lb) Bag',
    size: '24 oz',
    upc: '76335342',
    isPerishable: true,
  },
];

const TimeIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <Path d="M6 1C3.243 1 1 3.243 1 6C1 8.757 3.243 11 6 11C8.757 11 11 8.757 11 6C11 3.243 8.757 1 6 1ZM6 10C3.7945 10 2 8.2055 2 6C2 3.7945 3.7945 2 6 2C8.2055 2 10 3.7945 10 6C10 8.2055 8.2055 10 6 10Z" fill="#7C7B7B"/>
    <Path d="M6.5 3.5H5.5V6.5H8.5V5.5H6.5V3.5Z" fill="#7C7B7B"/>
  </Svg>
);

const DateIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <Path d="M4.25 7C4.41576 7 4.57473 6.93415 4.69194 6.81694C4.80915 6.69973 4.875 6.54076 4.875 6.375C4.875 6.20924 4.80915 6.05027 4.69194 5.93306C4.57473 5.81585 4.41576 5.75 4.25 5.75C4.08424 5.75 3.92527 5.81585 3.80806 5.93306C3.69085 6.05027 3.625 6.20924 3.625 6.375C3.625 6.54076 3.69085 6.69973 3.80806 6.81694C3.92527 6.93415 4.08424 7 4.25 7ZM4.25 8.75C4.41576 8.75 4.57473 8.68415 4.69194 8.56694C4.80915 8.44973 4.875 8.29076 4.875 8.125C4.875 7.95924 4.80915 7.80027 4.69194 7.68306C4.57473 7.56585 4.41576 7.5 4.25 7.5C4.08424 7.5 3.92527 7.56585 3.80806 7.68306C3.69085 7.80027 3.625 7.95924 3.625 8.125C3.625 8.29076 3.69085 8.44973 3.80806 8.56694C3.92527 8.68415 4.08424 8.75 4.25 8.75ZM6.625 6.375C6.625 6.54076 6.55915 6.69973 6.44194 6.81694C6.32473 6.93415 6.16576 7 6 7C5.83424 7 5.67527 6.93415 5.55806 6.81694C5.44085 6.69973 5.375 6.54076 5.375 6.375C5.375 6.20924 5.44085 6.05027 5.55806 5.93306C5.67527 5.81585 5.83424 5.75 6 5.75C6.16576 5.75 6.32473 5.81585 6.44194 5.93306C6.55915 6.05027 6.625 6.20924 6.625 6.375ZM6 8.75C6.16576 8.75 6.32473 8.68415 6.44194 8.56694C6.55915 8.44973 6.625 8.29076 6.625 8.125C6.625 7.95924 6.55915 7.80027 6.44194 7.68306C6.32473 7.56585 6.16576 7.5 6 7.5C5.83424 7.5 5.67527 7.56585 5.55806 7.68306C5.44085 7.80027 5.375 7.95924 5.375 8.125C5.375 8.29076 5.44085 8.44973 5.55806 8.56694C5.67527 8.68415 5.83424 8.75 6 8.75ZM8.375 6.375C8.375 6.54076 8.30915 6.69973 8.19194 6.81694C8.07473 6.93415 7.91576 7 7.75 7C7.58424 7 7.42527 6.93415 7.30806 6.81694C7.19085 6.69973 7.125 6.54076 7.125 6.375C7.125 6.20924 7.19085 6.05027 7.30806 5.93306C7.42527 5.81585 7.58424 5.75 7.75 5.75C7.91576 5.75 8.07473 5.81585 8.19194 5.93306C8.30915 6.05027 8.375 6.20924 8.375 6.375Z" fill="#7C7B7B"/>
    <Path fillRule="evenodd" clipRule="evenodd" d="M4 1.625C4.09946 1.625 4.19484 1.66451 4.26516 1.73483C4.33549 1.80516 4.375 1.90054 4.375 2V2.375H7.625V2C7.625 1.90054 7.66451 1.80516 7.73484 1.73483C7.80516 1.66451 7.90054 1.625 8 1.625C8.09946 1.625 8.19484 1.66451 8.26517 1.73483C8.33549 1.80516 8.375 1.90054 8.375 2V2.379C8.451 2.381 8.52183 2.38467 8.5875 2.39C8.7775 2.405 8.9555 2.439 9.124 2.525C9.38278 2.65684 9.59316 2.86722 9.725 3.126C9.811 3.2945 9.845 3.4725 9.86 3.6625C9.875 3.845 9.875 4.0675 9.875 4.335V8.165C9.875 8.4325 9.875 8.655 9.86 8.8375C9.845 9.0275 9.811 9.2055 9.725 9.374C9.5933 9.6327 9.38309 9.84308 9.1245 9.975C8.9555 10.061 8.7775 10.095 8.5875 10.11C8.405 10.125 8.1825 10.125 7.9155 10.125H4.085C3.8175 10.125 3.595 10.125 3.4125 10.11C3.2225 10.095 3.0445 10.061 2.876 9.975C2.61738 9.84343 2.40701 9.6334 2.275 9.375C2.189 9.206 2.155 9.028 2.14 8.838C2.125 8.6555 2.125 8.433 2.125 8.166V4.335C2.125 4.0675 2.125 3.845 2.14 3.6625C2.155 3.4725 2.189 3.2945 2.275 3.126C2.40684 2.86722 2.61722 2.65684 2.876 2.525C3.0445 2.439 3.2225 2.405 3.4125 2.39C3.47817 2.38467 3.549 2.381 3.625 2.379V2C3.625 1.95075 3.6347 1.90199 3.65355 1.85649C3.67239 1.811 3.70001 1.76966 3.73483 1.73483C3.76966 1.70001 3.811 1.67239 3.85649 1.65355C3.90199 1.6347 3.95075 1.625 4 1.625ZM3.625 3.25V3.129C3.57444 3.13056 3.52392 3.13339 3.4735 3.1375C3.33 3.149 3.2615 3.17 3.2165 3.193C3.09871 3.25295 3.00295 3.34871 2.943 3.4665C2.92 3.5115 2.899 3.58 2.8875 3.7235C2.8755 3.8715 2.875 4.0635 2.875 4.35V4.625H9.125V4.35C9.125 4.064 9.125 3.8715 9.1125 3.7235C9.101 3.58 9.08 3.5115 9.057 3.4665C8.99705 3.34871 8.90129 3.25295 8.7835 3.193C8.7385 3.17 8.67 3.149 8.526 3.1375C8.47575 3.1334 8.4254 3.13056 8.375 3.129V3.25C8.375 3.34946 8.33549 3.44484 8.26517 3.51517C8.19484 3.58549 8.09946 3.625 8 3.625C7.90054 3.625 7.80516 3.58549 7.73484 3.51517C7.66451 3.44484 7.625 3.34946 7.625 3.25V3.125H4.375V3.25C4.375 3.34946 4.33549 3.44484 4.26516 3.51517C4.19484 3.58549 4.09946 3.625 4 3.625C3.90054 3.625 3.80516 3.58549 3.73483 3.51517C3.66451 3.44484 3.625 3.34946 3.625 3.25ZM9.125 5.125H2.875V8.15C2.875 8.436 2.875 8.6285 2.8875 8.776C2.899 8.92 2.92 8.9885 2.943 9.0335C3.003 9.1515 3.0985 9.247 3.2165 9.307C3.2615 9.33 3.33 9.351 3.4735 9.3625C3.6215 9.3745 3.8135 9.375 4.1 9.375H7.9C8.186 9.375 8.3785 9.375 8.526 9.3625C8.67 9.351 8.7385 9.33 8.7835 9.307C8.90129 9.24705 8.99705 9.15129 9.057 9.0335C9.08 8.9885 9.101 8.92 9.1125 8.776C9.1245 8.6285 9.125 8.436 9.125 8.15V5.125Z" fill="#7C7B7B"/>
    <Path fillRule="evenodd" clipRule="evenodd" d="M4.875 3.875C4.875 3.77554 4.91451 3.68016 4.98484 3.60983C5.05516 3.53951 5.15054 3.5 5.25 3.5H6.75C6.84946 3.5 6.94484 3.53951 7.01516 3.60983C7.08549 3.68016 7.125 3.77554 7.125 3.875C7.125 3.97446 7.08549 4.06984 7.01516 4.14016C6.94484 4.21049 6.84946 4.25 6.75 4.25H5.25C5.15054 4.25 5.05516 4.21049 4.98484 4.14016C4.91451 4.06984 4.875 3.97446 4.875 3.875Z" fill="#7C7B7B"/>
  </Svg>
);

const OrderIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M17 4H7C5.89543 4 5 4.89543 5 6V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V6C19 4.89543 18.1046 4 17 4Z" stroke="white" strokeWidth="2"/>
    <Path d="M9 9H15M9 13H15M9 17H13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </Svg>
);

const ScanIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M4 8V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8M4 16V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H8M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V8M16 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V16M7 12H17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const CloseIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <Path d="M2.25 17.5L0.5 15.75L7.5 8.75L0.5 1.75L2.25 0L9.25 7L16.25 0L18 1.75L11 8.75L18 15.75L16.25 17.5L9.25 10.5L2.25 17.5Z" fill="black"/>
  </Svg>
);

export default function FindingItemsScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleGoBack = () => {
    router.back();
  };

  const handleNotifications = () => {
    console.log('Open notifications');
  };

  const handleSupport = () => {
    console.log('Open support');
  };

  const handleMessageCustomer = () => {
    console.log('Message customer');
  };

  const handleCallCustomer = () => {
    console.log('Call customer');
  };

  const handleCantFindItem = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleSubstituteItem = () => {
    console.log('Substitute item');
    setIsModalVisible(false);
  };

  const handleOutOfStock = () => {
    console.log('Out of stock');
    setIsModalVisible(false);
  };

  const handleScanItem = () => {
    console.log('Scan item');
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <SafeAreaView style={styles.safeArea}>

          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                <ArrowBackButtonSVG width={30} height={30} color="white" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Finding Items</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={handleNotifications}>
                <NotificationSVG width={24} height={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSupport}>
                <SupportSVG width={24} height={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Items Left Indicator */}
          <View style={styles.itemsLeftContainer}>
            <View style={styles.itemsLeftCard}>
              <OrderIcon />
              <Text style={styles.itemsLeftText}>35 Items left</Text>
            </View>
          </View>
          
        </SafeAreaView>
      </View>

          <View style={[styles.customerCard, styles.customerCardOnHeader]}>
            <View style={styles.customerInfo}>
              <Image
                source={{ uri: 'https://api.builder.io/api/v1/image/assets/TEMP/c91bce15e2114688cb19d13e673d86c47c9917ca?width=60' }}
                style={styles.customerAvatar}
              />

              <View style={styles.customerDetails}>
                <View style={styles.customerNameRow}>
                  <Text style={styles.customerName}>Mr Damilare Adebanjo</Text>
                </View>

                <View style={styles.timeDetails}>
                  <View style={styles.timeItem}>
                    <TimeIcon />
                    <Text style={styles.timeText}>12:00pm</Text>
                  </View>
                  <View style={styles.timeItem}>
                    <DateIcon />
                    <Text style={styles.timeText}>03/2025</Text>
                  </View>
                </View>
              </View>

              <View style={styles.customerActions}>
                <TouchableOpacity style={styles.actionButton} onPress={handleMessageCustomer}>
                  <Svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                    <Rect width="30" height="30" rx="15" fill="#2CAF0B"/>
                    <Path d="M15 9.425C18.7125 9.425 21.75 11.8415 21.75 14.825C21.75 17.8085 18.7125 20.225 15 20.225C14.163 20.225 13.3598 20.1035 12.6173 19.8875C10.6463 21.575 8.25 21.575 8.25 21.575C9.82275 20.0023 10.0725 18.9425 10.1063 18.5375C8.95875 17.5723 8.25 16.2628 8.25 14.825C8.25 11.8415 11.2875 9.425 15 9.425Z" fill="white"/>
                  </Svg>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleCallCustomer}>
                  <PhoneOutlineSVG width={30} height={30} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.addressSection}>
              <Text style={styles.address}>47 North Union Avenue, Chicago, Illinious{"\n"}606102, United states</Text>
              <Text style={styles.distance}>4.5 Miles</Text>
            </View>
          </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Shopping Items Card */}
        <View style={styles.shoppingItemsCard}>
          <View style={styles.shoppingItemsHeader}>
            <Text style={styles.shoppingItemsLabel}>SHOPPING ITEMS</Text>
          </View>

          <Text style={styles.itemCategoryTitle}>Chicken Item</Text>

          {MOCK_ITEMS.map((item, index) => (
            <View key={item.id}>
              <View style={styles.itemContainer}>
                <View style={styles.itemImageWrapper}>
                  <View style={styles.itemImageContainer}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.itemImage}
                    />
                    {item.isPerishable && (
                      <View style={styles.perishableBadge}>
                        <Text style={styles.perishableText}>Perishable</Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.itemDetails}>
                  <View style={styles.itemPriceRow}>
                    <Text style={styles.priceLabel}>Price <Text style={styles.priceValue}>${item.price}</Text></Text>
                    <Text style={styles.quantityText}>{item.quantity} qty</Text>
                  </View>

                  <Text style={styles.itemDescription}>{item.description}</Text>

                  <View style={styles.itemMetaRow}>
                    <Text style={styles.itemSize}>Size - {item.size}</Text>
                    <Text style={styles.itemUPC}>UPC <Text style={styles.upcValue}>{item.upc}</Text></Text>
                  </View>
                </View>
              </View>
              {index < MOCK_ITEMS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <TouchableOpacity onPress={handleCantFindItem}>
            <Text style={styles.cantFindText}>Can&apos;t find an item?</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.scanButton} onPress={handleScanItem}>
            <ScanIcon />
            <Text style={styles.scanButtonText}>Scan an Item</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
              <CloseIcon />
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>Can&apos;t find an Item?</Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.substituteButton} onPress={handleSubstituteItem}>
                <Text style={styles.substituteButtonText}>Substitute Item</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.outOfStockButton} onPress={handleOutOfStock}>
                <Text style={styles.outOfStockButtonText}>Out of Stock</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  headerSection: {
    backgroundColor: '#06888C',
    paddingBottom: 85,
  },
  safeArea: {
    paddingTop: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
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
    color: '#FFF',
    lineHeight: 22,
  },
  scrollContainer: {
    flex: 1,
  },
  customerCard: {
    marginHorizontal: 21,
    marginTop: 19,
    padding: 19,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#FBFBFB',
  },
  customerCardOnHeader: {
    marginTop: -54,
    marginBottom: 12,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  customerAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  customerDetails: {
    flex: 1,
  },
  customerNameRow: {
    marginBottom: 6,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#000',
  },
  timeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  timeText: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#7C7B7B',
  },
  customerActions: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 13,
  },
  actionButton: {
    width: 30,
    height: 30,
  },
  addressSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 14,
  },
  address: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#484C52',
    lineHeight: 14,
    flex: 1,
  },
  distance: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#484C52',
    marginLeft: 10,
  },
  shoppingItemsCard: {
    marginHorizontal: 21,
    marginTop: 19,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#FAFAFB',
  },
  shoppingItemsHeader: {
    marginBottom: 15,
  },
  shoppingItemsLabel: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#484C52',
  },
  itemCategoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#000',
    marginBottom: 22,
  },
  itemContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 22,
  },
  itemImageWrapper: {
    alignItems: 'center',
  },
  itemImageContainer: {
    width: 252,
    height: 199,
    borderRadius: 16,
    backgroundColor: '#FAFAFB',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  itemImage: {
    width: 165,
    height: 185,
    resizeMode: 'contain',
  },
  perishableBadge: {
    position: 'absolute',
    top: 12,
    right: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(191, 227, 198, 0.50)',
  },
  perishableText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#01891C',
    lineHeight: 18,
  },
  itemDetails: {
    width: '100%',
    gap: 6,
  },
  itemPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#898A8D',
  },
  priceValue: {
    color: '#000',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Raleway',
    color: '#000',
  },
  itemDescription: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#484C52',
    lineHeight: 18,
  },
  itemMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemSize: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#898A8D',
  },
  itemUPC: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#898A8D',
  },
  upcValue: {
    color: '#484C52',
  },
  divider: {
    height: 1,
    backgroundColor: '#D9D9D9',
    marginVertical: 22,
    alignSelf: 'stretch',
  },
  bottomSection: {
    alignItems: 'center',
    paddingHorizontal: 21,
    paddingVertical: 30,
    gap: 16,
  },
  cantFindText: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Raleway',
    color: '#C43D28',
    lineHeight: 25,
    textAlign: 'center',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 16,
    backgroundColor: '#06888C',
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 9,
    elevation: 3,
    alignSelf: 'stretch',
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
    lineHeight: 25,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 398,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 21,
    paddingHorizontal: 41,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#000',
    textAlign: 'center',
    marginBottom: 29,
  },
  modalActions: {
    gap: 22,
  },
  substituteButton: {
    paddingVertical: 14,
    paddingHorizontal: 70,
    borderRadius: 16,
    backgroundColor: '#06888C',
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 9,
    elevation: 3,
  },
  substituteButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
    lineHeight: 25,
    textAlign: 'center',
  },
  outOfStockButton: {
    paddingVertical: 14,
    paddingHorizontal: 70,
    borderRadius: 16,
    backgroundColor: '#BBB',
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 9,
    elevation: 3,
  },
  outOfStockButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
    lineHeight: 25,
    textAlign: 'center',
  },
});
