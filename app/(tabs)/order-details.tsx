import { router } from 'expo-router';
import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ellipse, Line, Path, Rect, Svg } from 'react-native-svg';
import { ArrowBackButtonSVG, ChatFilledSVG, NotificationSVG, PhoneOutlineSVG, SupportSVG } from '../../components/icons';

interface OrderItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
  isPerishable: boolean;
}

const MOCK_ORDER_ITEMS: OrderItem[] = [
  {
    id: '1',
    name: 'Tyson All natural chicken freshwings, family pack, 4.25-3.5lb Tray',
    category: 'Meat',
    price: 3.34,
    quantity: 2,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/63f1ba43866c14d9b7ec4aeb2941bb00c04b7d4c?width=104',
    isPerishable: true,
  },
  {
    id: '2',
    name: 'Tyson All natural chicken freshwings, family pack, 4.25-3.5lb Tray',
    category: 'Meat',
    price: 3.34,
    quantity: 2,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/63f1ba43866c14d9b7ec4aeb2941bb00c04b7d4c?width=104',
    isPerishable: true,
  },
  {
    id: '3',
    name: 'Tyson All natural chicken freshwings, family pack, 4.25-3.5lb Tray',
    category: 'Wal Deli',
    price: 3.34,
    quantity: 2,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/d8e31a39f95ad8a07cdcfb9245798e545b674e5b?width=96',
    isPerishable: true,
  },
  {
    id: '4',
    name: 'Tyson All natural chicken freshwings, family pack, 4.25-3.5lb Tray',
    category: 'Wal Deli',
    price: 3.34,
    quantity: 2,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/9163f624e8c0af4229d79bbd17692fd7d6ea4de5?width=86',
    isPerishable: true,
  },
];

const MAP_HEIGHT = 257;
const OVERLAY_OVERLAP = 77;

const CopyIcon = () => (
  <Svg width="16" height="17" viewBox="0 0 16 17" fill="none">
    <Path d="M13 1.02487H4.625C4.55625 1.02487 4.5 1.08112 4.5 1.14987V2.02487C4.5 2.09362 4.55625 2.14987 4.625 2.14987H12.375V12.8999C12.375 12.9686 12.4312 13.0249 12.5 13.0249H13.375C13.4438 13.0249 13.5 12.9686 13.5 12.8999V1.52487C13.5 1.24831 13.2766 1.02487 13 1.02487ZM11 3.02487H3C2.72344 3.02487 2.5 3.24831 2.5 3.52487V11.8171C2.5 11.9499 2.55312 12.0764 2.64687 12.1702L5.35469 14.878C5.38906 14.9124 5.42813 14.9405 5.47031 14.9639V14.9936H5.53594C5.59062 15.0139 5.64844 15.0249 5.70781 15.0249H11C11.2766 15.0249 11.5 14.8014 11.5 14.5249V3.52487C11.5 3.24831 11.2766 3.02487 11 3.02487ZM5.46875 13.403L4.12344 12.0561H5.46875V13.403ZM10.375 13.8999H6.46875V11.6811C6.46875 11.3358 6.18906 11.0561 5.84375 11.0561H3.625V4.14987H10.375V13.8999Z" fill="black"/>
  </Svg>
);

const TimeIcon = () => (
  <Svg width="12" height="13" viewBox="0 0 12 13" fill="none">
    <Path d="M6 1.02487C3.243 1.02487 1 3.26787 1 6.02487C1 8.78187 3.243 11.0249 6 11.0249C8.757 11.0249 11 8.78187 11 6.02487C11 3.26787 8.757 1.02487 6 1.02487ZM6 10.0249C3.7945 10.0249 2 8.23037 2 6.02487C2 3.81937 3.7945 2.02487 6 2.02487C8.2055 2.02487 10 3.81937 10 6.02487C10 8.23037 8.2055 10.0249 6 10.0249Z" fill="#7C7B7B"/>
    <Path d="M6.5 3.52487H5.5V6.52487H8.5V5.52487H6.5V3.52487Z" fill="#7C7B7B"/>
  </Svg>
);

const DateIcon = () => (
  <Svg width="12" height="13" viewBox="0 0 12 13" fill="none">
    <Path d="M4.25 7.02487C4.41576 7.02487 4.57473 6.95902 4.69194 6.84181C4.80915 6.7246 4.875 6.56563 4.875 6.39987C4.875 6.23411 4.80915 6.07514 4.69194 5.95793C4.57473 5.84072 4.41576 5.77487 4.25 5.77487C4.08424 5.77487 3.92527 5.84072 3.80806 5.95793C3.69085 6.07514 3.625 6.23411 3.625 6.39987C3.625 6.56563 3.69085 6.7246 3.80806 6.84181C3.92527 6.95902 4.08424 7.02487 4.25 7.02487ZM4.25 8.77487C4.41576 8.77487 4.57473 8.70902 4.69194 8.59181C4.80915 8.4746 4.875 8.31563 4.875 8.14987C4.875 7.98411 4.80915 7.82514 4.69194 7.70793C4.57473 7.59072 4.41576 7.52487 4.25 7.52487C4.08424 7.52487 3.92527 7.59072 3.80806 7.70793C3.69085 7.82514 3.625 7.98411 3.625 8.14987C3.625 8.31563 3.69085 8.4746 3.80806 8.59181C3.92527 8.70902 4.08424 8.77487 4.25 8.77487ZM6.625 6.39987C6.625 6.56563 6.55915 6.7246 6.44194 6.84181C6.32473 6.95902 6.16576 7.02487 6 7.02487C5.83424 7.02487 5.67527 6.95902 5.55806 6.84181C5.44085 6.7246 5.375 6.56563 5.375 6.39987C5.375 6.23411 5.44085 6.07514 5.55806 5.95793C5.67527 5.84072 5.83424 5.77487 6 5.77487C6.16576 5.77487 6.32473 5.84072 6.44194 5.95793C6.55915 6.07514 6.625 6.23411 6.625 6.39987ZM6 8.77487C6.16576 8.77487 6.32473 8.70902 6.44194 8.59181C6.55915 8.4746 6.625 8.31563 6.625 8.14987C6.625 7.98411 6.55915 7.82514 6.44194 7.70793C6.32473 7.59072 6.16576 7.52487 6 7.52487C5.83424 7.52487 5.67527 7.59072 5.55806 7.70793C5.44085 7.82514 5.375 7.98411 5.375 8.14987C5.375 8.31563 5.44085 8.4746 5.55806 8.59181C5.67527 8.70902 5.83424 8.77487 6 8.77487ZM8.375 6.39987C8.375 6.56563 8.30915 6.7246 8.19194 6.84181C8.07473 6.95902 7.91576 7.02487 7.75 7.02487C7.58424 7.02487 7.42527 6.95902 7.30806 6.84181C7.19085 6.7246 7.125 6.56563 7.125 6.39987C7.125 6.23411 7.19085 6.07514 7.30806 5.95793C7.42527 5.84072 7.58424 5.77487 7.75 5.77487C7.91576 5.77487 8.07473 5.84072 8.19194 5.95793C8.30915 6.07514 8.375 6.23411 8.375 6.39987Z" fill="#7C7B7B"/>
    <Path fillRule="evenodd" clipRule="evenodd" d="M4 1.64987C4.09946 1.64987 4.19484 1.68938 4.26516 1.75971C4.33549 1.83003 4.375 1.92542 4.375 2.02487V2.39987H7.625V2.02487C7.625 1.92542 7.66451 1.83003 7.73484 1.75971C7.80516 1.68938 7.90054 1.64987 8 1.64987C8.09946 1.64987 8.19484 1.68938 8.26517 1.75971C8.33549 1.83003 8.375 1.92542 8.375 2.02487V2.40387C8.451 2.40587 8.52183 2.40954 8.5875 2.41487C8.7775 2.42987 8.9555 2.46387 9.124 2.54987C9.38278 2.68171 9.59316 2.89209 9.725 3.15087C9.811 3.31937 9.845 3.49737 9.86 3.68737C9.875 3.86987 9.875 4.09237 9.875 4.35987V8.18987C9.875 8.45737 9.875 8.67987 9.86 8.86237C9.845 9.05237 9.811 9.23037 9.725 9.39887C9.5933 9.65757 9.38309 9.86795 9.1245 9.99987C8.9555 10.0859 8.7775 10.1199 8.5875 10.1349C8.405 10.1499 8.1825 10.1499 7.9155 10.1499H4.085C3.8175 10.1499 3.595 10.1499 3.4125 10.1349C3.2225 10.1199 3.0445 10.0859 2.876 9.99987C2.61738 9.8683 2.40701 9.65828 2.275 9.39987C2.189 9.23087 2.155 9.05287 2.14 8.86287C2.125 8.68037 2.125 8.45787 2.125 8.19087V4.35987C2.125 4.09237 2.125 3.86987 2.14 3.68737C2.155 3.49737 2.189 3.31937 2.275 3.15087C2.40684 2.89209 2.61722 2.68171 2.876 2.54987C3.0445 2.46387 3.2225 2.42987 3.4125 2.41487C3.47817 2.40954 3.549 2.40587 3.625 2.40387V2.02487C3.625 1.97563 3.6347 1.92686 3.65355 1.88137C3.67239 1.83587 3.70001 1.79453 3.73483 1.75971C3.76966 1.72488 3.811 1.69726 3.85649 1.67842C3.90199 1.65957 3.95075 1.64987 4 1.64987ZM3.625 3.27487V3.15387C3.57444 3.15543 3.52392 3.15826 3.4735 3.16237C3.33 3.17387 3.2615 3.19487 3.2165 3.21787C3.09871 3.27783 3.00295 3.37358 2.943 3.49137C2.92 3.53637 2.899 3.60487 2.8875 3.74837C2.8755 3.89637 2.875 4.08837 2.875 4.37487V4.64987H9.125V4.37487C9.125 4.08887 9.125 3.89637 9.1125 3.74837C9.101 3.60487 9.08 3.53637 9.057 3.49137C8.99705 3.37358 8.90129 3.27783 8.7835 3.21787C8.7385 3.19487 8.67 3.17387 8.526 3.16237C8.47575 3.15827 8.4254 3.15544 8.375 3.15387V3.27487C8.375 3.37433 8.33549 3.46971 8.26517 3.54004C8.19484 3.61036 8.09946 3.64987 8 3.64987C7.90054 3.64987 7.80516 3.61036 7.73484 3.54004C7.66451 3.46971 7.625 3.37433 7.625 3.27487V3.14987H4.375V3.27487C4.375 3.37433 4.33549 3.46971 4.26516 3.54004C4.19484 3.61036 4.09946 3.64987 4 3.64987C3.90054 3.64987 3.80516 3.61036 3.73483 3.54004C3.66451 3.46971 3.625 3.37433 3.625 3.27487ZM9.125 5.14987H2.875V8.17487C2.875 8.46087 2.875 8.65337 2.8875 8.80087C2.899 8.94487 2.92 9.01337 2.943 9.05837C3.003 9.17637 3.0985 9.27187 3.2165 9.33187C3.2615 9.35487 3.33 9.37587 3.4735 9.38737C3.6215 9.39937 3.8135 9.39987 4.1 9.39987H7.9C8.186 9.39987 8.3785 9.39987 8.526 9.38737C8.67 9.37587 8.7385 9.35487 8.7835 9.33187C8.90129 9.27192 8.99705 9.17616 9.057 9.05837C9.08 9.01337 9.101 8.94487 9.1125 8.80087C9.1245 8.65337 9.125 8.46087 9.125 8.17487V5.14987Z" fill="#7C7B7B"/>
    <Path fillRule="evenodd" clipRule="evenodd" d="M4.875 3.89987C4.875 3.80042 4.91451 3.70503 4.98484 3.63471C5.05516 3.56438 5.15054 3.52487 5.25 3.52487H6.75C6.84946 3.52487 6.94484 3.56438 7.01516 3.63471C7.08549 3.70503 7.125 3.80042 7.125 3.89987C7.125 3.99933 7.08549 4.09471 7.01516 4.16504C6.94484 4.23536 6.84946 4.27487 6.75 4.27487H5.25C5.15054 4.27487 5.05516 4.23536 4.98484 4.16504C4.91451 4.09471 4.875 3.99933 4.875 3.89987Z" fill="#7C7B7B"/>
  </Svg>
);

export default function OrderDetailsScreen() {
  const handleGoBack = () => {
    router.back();
  };

  const handleNotifications = () => {
    console.log('Open notifications');
  };

  const handleSupport = () => {
    console.log('Open support');
  };

  const handleStartShopping = () => {
    console.log('Start shopping');
  };

  const handleGoBackToOrders = () => {
    router.back();
  };

  const handleCallCustomer = () => {
    console.log('Call customer');
  };

  const handleMessageCustomer = () => {
    console.log('Message customer');
  };

  const handleCopyOrderCode = () => {
    console.log('Copy order code');
  };

  const groupedItems = MOCK_ORDER_ITEMS.reduce((groups, item) => {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }
    groups[item.category].push(item);
    return groups;
  }, {} as Record<string, OrderItem[]>);

  const renderOrderItem = (item: OrderItem) => (
    <View key={item.id} style={styles.orderItem}>
      <View style={styles.itemImageContainer}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.itemFooter}>
          {item.isPerishable && (
            <View style={styles.perishableBadge}>
              <Text style={styles.perishableText}>Perishable</Text>
            </View>
          )}
          <View style={styles.itemPricing}>
            <Text style={styles.itemQuantity}>qty {item.quantity}</Text>
            <Text style={styles.itemPrice}>${item.price}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Static (non-scrolling) Map + Header */}
      <View style={styles.mapSection}>
        <Image 
          source={{ uri: 'https://api.builder.io/api/v1/image/assets/TEMP/1aec3e87a8b4b88db60323cecb75b8585664780e?width=858' }}
          style={styles.mapImage}
        />

        {/* Map overlay with delivery route */}
        <View style={styles.mapOverlay}>
          <Svg width="157" height="102" viewBox="0 0 157 102" fill="none">
            <Line x1="16.4915" y1="88.1389" x2="143.492" y2="13.1389" stroke="black" strokeWidth="2"/>
            <Path d="M9.75 87.25C9.28587 87.25 8.84075 87.4344 8.51256 87.7626C8.18437 88.0908 8 88.5359 8 89C8 89.4641 8.18437 89.9092 8.51256 90.2374C8.84075 90.5656 9.28587 90.75 9.75 90.75C10.2141 90.75 10.6592 90.5656 10.9874 90.2374C11.3156 89.9092 11.5 89.4641 11.5 89C11.5 88.5359 11.3156 88.0908 10.9874 87.7626C10.6592 87.4344 10.2141 87.25 9.75 87.25Z" fill="black"/>
            <Path d="M9.75 82C7.16414 82 4.68419 83.0272 2.85571 84.8557C1.02723 86.6842 1.89327e-06 89.1641 1.89327e-06 91.75C-0.000955082 93.285 0.360887 94.7984 1.05602 96.167C1.75116 97.5355 2.7599 98.7204 4 99.625L4.001 99.212C4.184 95.633 7.022 93.86 9.75 93.86C12.478 93.86 15.316 95.633 15.499 99.212L15.5 99.625C16.7401 98.7204 17.7488 97.5355 18.444 96.167C19.1391 94.7984 19.501 93.285 19.5 91.75C19.5 89.1641 18.4728 86.6842 16.6443 84.8557C14.8158 83.0272 12.3359 82 9.75 82ZM6.5 89C6.5 88.138 6.84241 87.3114 7.45191 86.7019C8.0614 86.0924 8.88805 85.75 9.75 85.75C10.612 85.75 11.4386 86.0924 12.0481 86.7019C12.6576 87.3114 13 88.138 13 89C13 89.862 12.6576 90.6886 12.0481 91.2981C11.4386 91.9076 10.612 92.25 9.75 92.25C8.88805 92.25 8.0614 91.9076 7.45191 91.2981C6.84241 90.6886 6.5 89.862 6.5 89Z" fill="black"/>
            <Path d="M14.0092 100.523C14.0052 99.743 14.0022 99.314 14.0012 99.288C13.8672 96.68 11.8642 95.36 9.75021 95.36C7.63621 95.36 5.63321 96.68 5.49921 99.288C5.49821 99.314 5.49521 99.742 5.49121 100.523C6.81809 101.168 8.27471 101.502 9.75021 101.5C11.2257 101.502 12.6823 101.168 14.0092 100.523Z" fill="black"/>
            <Path d="M148.593 21.258L148.582 21.26L148.511 21.295L148.491 21.299L148.477 21.295L148.406 21.26C148.396 21.2567 148.388 21.2583 148.382 21.265L148.378 21.275L148.361 21.703L148.366 21.723L148.376 21.736L148.48 21.81L148.495 21.814L148.507 21.81L148.611 21.736L148.623 21.72L148.627 21.703L148.61 21.276C148.608 21.2653 148.602 21.2593 148.593 21.258ZM148.858 21.145L148.845 21.147L148.66 21.24L148.65 21.25L148.647 21.261L148.665 21.691L148.67 21.703L148.678 21.71L148.879 21.803C148.892 21.8063 148.902 21.8037 148.908 21.795L148.912 21.781L148.878 21.167C148.875 21.155 148.868 21.1477 148.858 21.145ZM148.143 21.147C148.139 21.1443 148.133 21.1435 148.128 21.1446C148.123 21.1457 148.119 21.1487 148.116 21.153L148.11 21.167L148.076 21.781C148.077 21.793 148.083 21.801 148.093 21.805L148.108 21.803L148.309 21.71L148.319 21.702L148.323 21.691L148.34 21.261L148.337 21.249L148.327 21.239L148.143 21.147Z" fill="#01891C"/>
            <Path d="M148 0C150.387 0 152.676 0.948211 154.364 2.63604C156.052 4.32387 157 6.61305 157 9C157 12.074 155.324 14.59 153.558 16.395C152.676 17.2871 151.713 18.0958 150.682 18.811L150.256 19.101L150.056 19.234L149.679 19.474L149.343 19.679L148.927 19.921C148.645 20.0822 148.325 20.1669 148 20.1669C147.675 20.1669 147.355 20.0822 147.073 19.921L146.657 19.679L146.137 19.359L145.945 19.234L145.535 18.961C144.423 18.2085 143.387 17.3491 142.442 16.395C140.676 14.589 139 12.074 139 9C139 6.61305 139.948 4.32387 141.636 2.63604C143.324 0.948211 145.613 0 148 0ZM148 6C147.606 6 147.216 6.0776 146.852 6.22836C146.488 6.37913 146.157 6.6001 145.879 6.87868C145.6 7.15726 145.379 7.48797 145.228 7.85195C145.078 8.21593 145 8.60603 145 9C145 9.39397 145.078 9.78407 145.228 10.1481C145.379 10.512 145.6 10.8427 145.879 11.1213C146.157 11.3999 146.488 11.6209 146.852 11.7716C147.216 11.9224 147.606 12 148 12C148.796 12 149.559 11.6839 150.121 11.1213C150.684 10.5587 151 9.79565 151 9C151 8.20435 150.684 7.44129 150.121 6.87868C149.559 6.31607 148.796 6 148 6Z" fill="#01891C"/>
          </Svg>
        </View>

        {/* Header overlay */}
        <View style={styles.headerOverlay}>
          <SafeAreaView style={styles.headerSafeArea}>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                  <ArrowBackButtonSVG width={30} height={30} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order Details</Text>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity onPress={handleNotifications}>
                  <NotificationSVG width={24} height={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSupport}>
                  <SupportSVG width={24} height={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </View>

      {/* Scrollable content only */}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Order Summary Card using negative margin to overlay map */}
        <View style={[styles.orderSummaryCard, styles.orderSummaryCardInset]}>
          <View style={styles.summaryHeader}>
            <View style={styles.totalRow}>
              <Text style={styles.estimatedTotalLabel}>Estimated Total</Text>
              <Text style={styles.estimatedTotalAmount}>$120.60</Text>
            </View>
            <View style={styles.costBreakdown}>
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>Item Cost</Text>
                <Text style={styles.costAmount}>$100.00</Text>
              </View>
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>Shopping Fee</Text>
                <Text style={styles.costAmount}>$20.32</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Progress Section */}
          <View style={styles.progressSection}>
            <Text style={styles.progressDistance}>4.5 Miles - 20 Items</Text>
            <Svg width={245} height={17} viewBox="0 0 245 17" fill="none">
              <Ellipse cx={8.167} cy={8} rx={8.167} ry={8} fill="#2CAF0B" />
              <Rect x={17} y={7.0125} width={211} height={2} fill="#D9D9D9" />
              <Ellipse cx={236.21} cy={8} rx={8.167} ry={8} fill="#B4BED4" />
            </Svg>

            <View style={styles.progressDetails}>
              <View style={styles.progressLeft}>
                <Text style={styles.customerNameProgress}>Mr Damilare Adebanjo</Text>
                <View style={styles.timeDetails}>
                  <View style={styles.timeItem}>
                    <TimeIcon />
                    <Text style={styles.timeDetailText}>12:00pm</Text>
                  </View>
                  <View style={styles.timeItem}>
                    <DateIcon />
                    <Text style={styles.timeDetailText}>03/2025</Text>
                  </View>
                </View>
              </View>
              <View style={styles.progressRight}>
                <Text style={styles.deliveryAddress}>47 North Union Avenue</Text>
                <Text style={styles.deliveryLocation}>Chicago Illiniou, 60612, US</Text>
              </View>
            </View>
          </View>

          {/* Order Code */}
          <View style={styles.orderCodeSection}>
            <Text style={styles.orderCodeText}>Order code - 987BNTT43</Text>
            <TouchableOpacity onPress={handleCopyOrderCode}>
              <CopyIcon />
            </TouchableOpacity>
          </View>
        </View>

        {/* Customer Contact Card */}
        <View style={styles.customerCard}>
          <View style={styles.customerInfo}>
            <Image 
              source={{ uri: 'https://api.builder.io/api/v1/image/assets/TEMP/c91bce15e2114688cb19d13e673d86c47c9917ca?width=60' }}
              style={styles.customerAvatar}
            />
            <Text style={styles.customerName}>Mr Damilare Adebanjo</Text>
          </View>
          <View style={styles.customerActions}>
            <TouchableOpacity onPress={handleMessageCustomer}>
              <ChatFilledSVG width={30} height={30} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCallCustomer}>
              <PhoneOutlineSVG width={30} height={30} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Shopping Items */}
        <View style={styles.shoppingItemsCard}>
          <View style={styles.shoppingItemsHeader}>
            <Text style={styles.shoppingItemsTitle}>SHOPPING ITEMS</Text>
            <Text style={styles.itemCount}>20 ITEMS</Text>
          </View>

          {Object.entries(groupedItems).map(([category, items]) => (
            <View key={category} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{category}</Text>
              <View style={styles.categoryItems}>
                {items.map((item, index) => (
                  <View 
                    key={item.id} 
                    style={[
                      styles.orderItemContainer,
                      index === 0 && styles.firstItem,
                      index === items.length - 1 && styles.lastItem
                    ]}
                  >
                    {renderOrderItem(item)}
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.goBackButton} onPress={handleGoBackToOrders}>
            <Text style={styles.goBackText}>Go back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.startShoppingButton} onPress={handleStartShopping}>
            <Text style={styles.startShoppingText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  mapSection: {
    height: MAP_HEIGHT,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mapOverlay: {
    position: 'absolute',
    top: 88,
    left: 153,
    width: 157,
    height: 102,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerSafeArea: {
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
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
    color: '#000',
    lineHeight: 22,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  scroll: {
    flex: 1,
    marginTop: -OVERLAY_OVERLAP,
  },
  orderSummaryCard: {
    padding: 17,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#FBFBFB',
    marginHorizontal: 22,
    position: 'relative',
    zIndex: 6,
    elevation: 4,
  },
  orderSummaryCardInset: {
    marginTop: 0,
  },
  summaryHeader: {
    gap: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  estimatedTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#484C52',
    lineHeight: 22,
  },
  estimatedTotalAmount: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#100A37',
    lineHeight: 22,
  },
  costBreakdown: {
    gap: 4,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costLabel: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#707070',
  },
  costAmount: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#313131',
  },
  divider: {
    height: 1,
    backgroundColor: '#D9D9D9',
    marginVertical: 16,
  },
  progressSection: {
    alignItems: 'center',
    gap: 10,
  },
  progressDistance: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#484C52',
    textAlign: 'center',
  },
  progressDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    gap: 90,
  },
  progressLeft: {
    alignItems: 'center',
    gap: 4,
  },
  customerNameProgress: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#484C52',
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
  timeDetailText: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#7C7B7B',
  },
  progressRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  deliveryAddress: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#484C52',
    textAlign: 'right',
  },
  deliveryLocation: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#484C52',
    textAlign: 'right',
  },
  orderCodeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 16,
  },
  orderCodeText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#000',
  },
  customerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 11,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    marginHorizontal: 22,
    marginTop: 19,
    marginBottom: 19,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customerAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#000',
  },
  customerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  shoppingItemsCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#ECECEC',
    marginHorizontal: 22,
    marginBottom: 19,
    overflow: 'hidden',
  },
  shoppingItemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  shoppingItemsTitle: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#484C52',
  },
  itemCount: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#484C52',
  },
  categorySection: {
    marginBottom: 16,
    paddingHorizontal: 18,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#000',
    marginBottom: 16,
  },
  categoryItems: {
    gap: 0,
  },
  orderItemContainer: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
  },
  firstItem: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  lastItem: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomWidth: 0,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 11,
    gap: 9,
  },
  itemImageContainer: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImage: {
    width: 52,
    height: 61,
    resizeMode: 'contain',
  },
  itemDetails: {
    flex: 1,
    gap: 6,
  },
  itemName: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#484C52',
    lineHeight: 18,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  perishableBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(191, 227, 198, 0.50)',
  },
  perishableText: {
    fontSize: 6,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#01891C',
    lineHeight: 18,
  },
  itemPricing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemQuantity: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#7C7B7B',
    lineHeight: 18,
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#000',
    lineHeight: 18,
  },
  actionButtons: {
    gap: 16,
    marginHorizontal: 22,
    marginBottom: 30,
  },
  goBackButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#06888C',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 9,
    elevation: 3,
  },
  goBackText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#06888C',
    lineHeight: 25,
    textAlign: 'center',
  },
  startShoppingButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: '#06888C',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 9,
    elevation: 3,
  },
  startShoppingText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
    lineHeight: 25,
    textAlign: 'center',
  },
});
