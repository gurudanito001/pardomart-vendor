import { router } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ArrowBackSVG, NotificationSVG, SupportSVG } from '../../../components/icons';

interface Order {
  id: string;
  type: 'shop-deliver' | 'delivery-person';
  total: number;
  customerName: string;
  time: string;
  date: string;
  orderDate: string;
  units: number;
}

const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    type: 'shop-deliver',
    total: 30.22,
    customerName: 'Mr Damilare Adebanjo',
    time: '12:00pm',
    date: '03/2025',
    orderDate: '03/2025',
    units: 20,
  },
  {
    id: '2',
    type: 'shop-deliver',
    total: 30.22,
    customerName: 'Mr Damilare Adebanjo',
    time: '12:00pm',
    date: '03/2025',
    orderDate: '03/2025',
    units: 20,
  },
  {
    id: '3',
    type: 'delivery-person',
    total: 30.22,
    customerName: 'Mr Damilare Adebanjo',
    time: '12:00pm',
    date: '03/2025',
    orderDate: '03/2025',
    units: 20,
  },
];

export default function OrdersScreen() {
  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/home');
    }
  };

  const handleNotifications = () => {
    console.log('Open notifications');
  };

  const handleSupport = () => {
    console.log('Open support');
  };

  const handlePreviewOrder = (orderId: string) => {
    console.log('Preview order:', orderId);
    // Navigate to order details
    router.push('/(tabs)/orders/order-details');
  };

  const renderOrderCard = (order: Order) => (
    <View key={order.id} style={styles.orderCard}>
      {/* Order Type Header */}
      <View style={styles.orderHeader}>
        <View style={styles.orderTypeContainer}>
          {order.type === 'shop-deliver' ? (
            <Svg width="25" height="25" viewBox="0 0 25 25" fill="none">
              <Path fillRule="evenodd" clipRule="evenodd" d="M8.08443 4.6875H16.9157C17.4907 4.68754 18.0457 4.89898 18.475 5.28158C18.9042 5.66419 19.1779 6.19126 19.2438 6.7625L20.5063 17.7C20.5442 18.0283 20.5122 18.3608 20.4125 18.6759C20.3128 18.9909 20.1476 19.2814 19.9278 19.5281C19.7079 19.7748 19.4384 19.9722 19.1369 20.1074C18.8353 20.2426 18.5086 20.3125 18.1782 20.3125H6.82193C6.49148 20.3125 6.16477 20.2426 5.86324 20.1074C5.56171 19.9722 5.29218 19.7748 5.07232 19.5281C4.85247 19.2814 4.68728 18.9909 4.58757 18.6759C4.48787 18.3608 4.45592 18.0283 4.49381 17.7L5.75631 6.7625C5.82225 6.19126 6.09589 5.66419 6.52517 5.28158C6.95444 4.89898 7.5094 4.68754 8.08443 4.6875ZM3.42818 6.49375C3.56006 5.35126 4.10734 4.29713 4.9659 3.53192C5.82445 2.76671 6.93436 2.34383 8.08443 2.34375H16.9157C18.0658 2.34383 19.1757 2.76671 20.0342 3.53192C20.8928 4.29713 21.4401 5.35126 21.5719 6.49375L22.8344 17.4313C22.9102 18.0878 22.8463 18.7529 22.6469 19.383C22.4475 20.0131 22.1171 20.594 21.6774 21.0874C21.2377 21.5808 20.6986 21.9756 20.0956 22.246C19.4925 22.5164 18.8391 22.6562 18.1782 22.6562H6.82193C6.16103 22.6562 5.50761 22.5164 4.90455 22.246C4.30149 21.9756 3.76242 21.5808 3.32271 21.0874C2.88301 20.594 2.55262 20.0131 2.35321 19.383C2.15381 18.7529 2.0899 18.0878 2.16568 17.4313L3.42818 6.49375ZM7.81256 8.20312C7.81256 7.89232 7.93602 7.59425 8.15579 7.37448C8.37556 7.15472 8.67363 7.03125 8.98443 7.03125C9.29523 7.03125 9.59331 7.15472 9.81308 7.37448C10.0328 7.59425 10.1563 7.89232 10.1563 8.20312V8.59375C10.1563 9.21535 10.4032 9.81149 10.8428 10.251C11.2823 10.6906 11.8785 10.9375 12.5001 10.9375C13.1217 10.9375 13.7178 10.6906 14.1573 10.251C14.5969 9.81149 14.8438 9.21535 14.8438 8.59375V8.20312C14.8438 7.89232 14.9673 7.59425 15.187 7.37448C15.4068 7.15472 15.7049 7.03125 16.0157 7.03125C16.3265 7.03125 16.6246 7.15472 16.8443 7.37448C17.0641 7.59425 17.1876 7.89232 17.1876 8.20312V8.59375C17.1876 9.83695 16.6937 11.0292 15.8146 11.9083C14.9355 12.7874 13.7433 13.2812 12.5001 13.2812C11.2569 13.2812 10.0646 12.7874 9.1855 11.9083C8.30642 11.0292 7.81256 9.83695 7.81256 8.59375V8.20312Z" fill="#06888C"/>
            </Svg>
          ) : (
            <Svg width="25" height="25" viewBox="0 0 25 25" fill="none">
              <Path d="M11.503 1.04001H1.955C1.70172 1.04001 1.45881 1.14062 1.27971 1.31972C1.10062 1.49882 1 1.74173 1 1.99501V11.065C1 11.593 1.427 12.02 1.955 12.02H11.503C11.7561 12.0197 11.9988 11.919 12.1776 11.7399C12.3565 11.5609 12.457 11.3181 12.457 11.065V1.99501C12.457 1.7419 12.3565 1.49914 12.1776 1.32007C11.9988 1.14101 11.7561 1.04027 11.503 1.04001Z" fill="#FFBC44"/>
              <Path d="M11.503 1.04001H1.955C1.70172 1.04001 1.45881 1.14062 1.27971 1.31972C1.10062 1.49882 1 1.74173 1 1.99501V4.38201C0.999869 4.25656 1.02448 4.13232 1.07243 4.01639C1.12037 3.90047 1.19071 3.79513 1.27942 3.70643C1.36813 3.61772 1.47346 3.54738 1.58938 3.49944C1.70531 3.45149 1.82955 3.42688 1.955 3.42701H11.503C11.6284 3.42701 11.7525 3.45172 11.8683 3.49972C11.9841 3.54773 12.0893 3.61809 12.1779 3.70678C12.2665 3.79548 12.3368 3.90076 12.3847 4.01662C12.4326 4.13248 12.4571 4.25664 12.457 4.38201V1.99501C12.457 1.7419 12.3565 1.49914 12.1776 1.32007C11.9988 1.14101 11.7561 1.04027 11.503 1.04001Z" fill="#FFDDA1"/>
              <Path d="M20.0961 23L20.5731 17.271H22.9601V13.93C22.9601 12.6639 22.4571 11.4496 21.5618 10.5543C20.6665 9.65898 19.4523 9.15601 18.1861 9.15601C16.92 9.15601 15.7057 9.65898 14.8104 10.5543C13.9151 11.4496 13.4121 12.6639 13.4121 13.93V17.271H15.7991L16.2771 23H20.0961Z" fill="#66E1FF"/>
              <Path d="M18.1861 9.15601C16.92 9.15601 15.7057 9.65898 14.8104 10.5543C13.9151 11.4496 13.4121 12.6639 13.4121 13.93V16.349C13.4121 15.0829 13.9151 13.8686 14.8104 12.9733C15.7057 12.078 16.92 11.575 18.1861 11.575C19.4523 11.575 20.6665 12.078 21.5618 12.9733C22.4571 13.8686 22.9601 15.0829 22.9601 16.349V13.929C22.9598 12.663 22.4568 11.449 21.5615 10.5539C20.6662 9.65884 19.4521 9.15601 18.1861 9.15601Z" fill="#C2F3FF"/>
              <Path d="M20.0961 23L20.5731 17.271H22.9601V13.93C22.9601 12.6639 22.4571 11.4496 21.5618 10.5543C20.6665 9.65898 19.4523 9.15601 18.1861 9.15601C16.92 9.15601 15.7057 9.65898 14.8104 10.5543C13.9151 11.4496 13.4121 12.6639 13.4121 13.93V17.271H15.7991L16.2771 23H20.0961Z" stroke="#191919" strokeLinecap="round" strokeLinejoin="round"/>
              <Path d="M21.4898 3.90399H14.8838C15.0047 3.1145 15.4043 2.3944 16.0103 1.87412C16.6163 1.35385 17.3886 1.06781 18.1873 1.06781C18.986 1.06781 19.7583 1.35385 20.3643 1.87412C20.9703 2.3944 21.3689 3.1145 21.4898 3.90399Z" fill="#66E1FF"/>
              <Path d="M21.5281 4.38199C21.5129 5.2582 21.1542 6.0934 20.5292 6.70769C19.9042 7.32197 19.0629 7.66618 18.1866 7.66618C17.3102 7.66618 16.469 7.32197 15.844 6.70769C15.2189 6.0934 14.8602 5.2582 14.8451 4.38199C14.8424 4.22199 14.8551 4.06266 14.8831 3.90399H21.4901C21.5167 4.06199 21.5294 4.22132 21.5281 4.38199Z" fill="#FFDDA1"/>
              <Path d="M14.8835 3.90201H12.9355" stroke="#191919" strokeLinecap="round" strokeLinejoin="round"/>
              <Path d="M4.82031 1V5.337C4.82045 5.4255 4.84521 5.51222 4.89181 5.58745C4.93842 5.66268 5.00504 5.72347 5.08421 5.763C5.16339 5.80254 5.25201 5.81927 5.34015 5.81132C5.42829 5.80338 5.51248 5.77106 5.58331 5.718L6.73031 4.86L7.87631 5.72C7.9473 5.77301 8.03163 5.80525 8.11988 5.81312C8.20813 5.82098 8.29683 5.80416 8.37608 5.76454C8.45533 5.72492 8.522 5.66405 8.56866 5.58873C8.61532 5.51341 8.64013 5.4266 8.64031 5.338V1H4.82031Z" fill="white"/>
              <Path d="M12.457 2.47201V1.99501C12.457 1.7419 12.3565 1.49914 12.1776 1.32007C11.9988 1.14101 11.7561 1.04027 11.503 1.04001H1.955C1.70172 1.04001 1.45881 1.14062 1.27971 1.31972C1.10062 1.49882 1 1.74173 1 1.99501V11.065C0.999869 11.1905 1.02448 11.3147 1.07243 11.4306C1.12037 11.5466 1.19071 11.6519 1.27942 11.7406C1.36813 11.8293 1.47346 11.8996 1.58938 11.9476C1.70531 11.9955 1.82955 12.0201 1.955 12.02H10.07M21.49 3.90401H14.884C15.0049 3.11451 15.4045 2.39441 16.0105 1.87414C16.6165 1.35387 17.3888 1.06783 18.1875 1.06783C18.9862 1.06783 19.7585 1.35387 20.3645 1.87414C20.9705 2.39441 21.3691 3.11451 21.49 3.90401ZM21.49 3.90401H14.883C14.855 4.06268 14.8423 4.22201 14.845 4.38201C14.8602 5.25822 15.2189 6.09342 15.8439 6.7077C16.4689 7.32199 17.3102 7.6662 18.1865 7.6662C19.0628 7.6662 19.9041 7.32199 20.5291 6.7077C21.1541 6.09342 21.5128 5.25822 21.528 4.38201C21.5293 4.22134 21.5167 4.06201 21.49 3.90401Z" stroke="#191919" strokeLinecap="round" strokeLinejoin="round"/>
              <Path d="M4.82031 1V5.337C4.82045 5.4255 4.84521 5.51222 4.89181 5.58745C4.93842 5.66268 5.00504 5.72347 5.08421 5.763C5.16339 5.80254 5.25201 5.81927 5.34015 5.81132C5.42829 5.80338 5.51248 5.77106 5.58331 5.718L6.73031 4.86L7.87631 5.72C7.9473 5.77301 8.03163 5.80525 8.11988 5.81312C8.20813 5.82098 8.29683 5.80416 8.37608 5.76454C8.45533 5.72491 8.522 5.66405 8.56866 5.58873C8.61532 5.51341 8.64013 5.4266 8.64031 5.338V1H4.82031Z" stroke="#191919" strokeLinecap="round" strokeLinejoin="round"/>
            </Svg>
          )}
          <Text style={styles.orderTypeText}>
            {order.type === 'shop-deliver' ? 'Shop and Deliver' : 'Delivery Person'}
          </Text>
        </View>
        <Svg width="7" height="12" viewBox="0 0 7 12" fill="none">
          <Path d="M0.866949 11.9985C0.66474 11.9988 0.468777 11.9292 0.313076 11.8017C0.225444 11.7299 0.153007 11.6418 0.0999113 11.5423C0.0468157 11.4428 0.0141058 11.3339 0.00365506 11.2219C-0.0067957 11.1098 0.00521815 10.9969 0.0390082 10.8895C0.0727983 10.7821 0.1277 10.6823 0.200571 10.5958L4.07768 6.01173L0.339039 1.41906C0.267152 1.33158 0.213468 1.23092 0.181074 1.12286C0.148679 1.01481 0.138213 0.901501 0.150276 0.789439C0.16234 0.677378 0.196694 0.568777 0.251367 0.469879C0.306039 0.370982 0.379951 0.283737 0.468853 0.213159C0.558395 0.135301 0.663255 0.0765731 0.776853 0.0406621C0.89045 0.00475112 1.01033 -0.00756759 1.12898 0.00447846C1.24762 0.0165245 1.36246 0.0526755 1.4663 0.110663C1.57014 0.16865 1.66072 0.247221 1.73237 0.341446L5.91238 5.47292C6.03967 5.62596 6.10925 5.81791 6.10925 6.01601C6.10925 6.2141 6.03967 6.40606 5.91238 6.55909L1.58525 11.6906C1.49843 11.7941 1.38815 11.8759 1.26335 11.9294C1.13854 11.9829 1.00274 12.0065 0.866949 11.9985Z" fill="#333333"/>
        </Svg>
      </View>

      <View style={styles.divider} />

      {/* Order Details */}
      <View style={styles.orderDetails}>
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${order.total}</Text>
        </View>
        <Text style={styles.customerName}>{order.customerName}</Text>
        
        {/* Order Info Row */}
        <View style={styles.orderInfoRow}>
          <View style={styles.infoItem}>
            <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <Path d="M6 1C3.243 1 1 3.243 1 6C1 8.757 3.243 11 6 11C8.757 11 11 8.757 11 6C11 3.243 8.757 1 6 1ZM6 10C3.7945 10 2 8.2055 2 6C2 3.7945 3.7945 2 6 2C8.2055 2 10 3.7945 10 6C10 8.2055 8.2055 10 6 10Z" fill="#7C7B7B"/>
              <Path d="M6.5 3.5H5.5V6.5H8.5V5.5H6.5V3.5Z" fill="#7C7B7B"/>
            </Svg>
            <Text style={styles.infoText}>{order.time}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <Path d="M4.25 7C4.41576 7 4.57473 6.93415 4.69194 6.81694C4.80915 6.69973 4.875 6.54076 4.875 6.375C4.875 6.20924 4.80915 6.05027 4.69194 5.93306C4.57473 5.81585 4.41576 5.75 4.25 5.75C4.08424 5.75 3.92527 5.81585 3.80806 5.93306C3.69085 6.05027 3.625 6.20924 3.625 6.375C3.625 6.54076 3.69085 6.69973 3.80806 6.81694C3.92527 6.93415 4.08424 7 4.25 7ZM4.25 8.75C4.41576 8.75 4.57473 8.68415 4.69194 8.56694C4.80915 8.44973 4.875 8.29076 4.875 8.125C4.875 7.95924 4.80915 7.80027 4.69194 7.68306C4.57473 7.56585 4.41576 7.5 4.25 7.5C4.08424 7.5 3.92527 7.56585 3.80806 7.68306C3.69085 7.80027 3.625 7.95924 3.625 8.125C3.625 8.29076 3.69085 8.44973 3.80806 8.56694C3.92527 8.68415 4.08424 8.75 4.25 8.75ZM6.625 6.375C6.625 6.54076 6.55915 6.69973 6.44194 6.81694C6.32473 6.93415 6.16576 7 6 7C5.83424 7 5.67527 6.93415 5.55806 6.81694C5.44085 6.69973 5.375 6.54076 5.375 6.375C5.375 6.20924 5.44085 6.05027 5.55806 5.93306C5.67527 5.81585 5.83424 5.75 6 5.75C6.16576 5.75 6.32473 5.81585 6.44194 5.93306C6.55915 6.05027 6.625 6.20924 6.625 6.375ZM6 8.75C6.16576 8.75 6.32473 8.68415 6.44194 8.56694C6.55915 8.44973 6.625 8.29076 6.625 8.125C6.625 7.95924 6.55915 7.80027 6.44194 7.68306C6.32473 7.56585 6.16576 7.5 6 7.5C5.83424 7.5 5.67527 7.56585 5.55806 7.68306C5.44085 7.80027 5.375 7.95924 5.375 8.125C5.375 8.29076 5.44085 8.44973 5.55806 8.56694C5.67527 8.68415 5.83424 8.75 6 8.75ZM8.375 6.375C8.375 6.54076 8.30915 6.69973 8.19194 6.81694C8.07473 6.93415 7.91576 7 7.75 7C7.58424 7 7.42527 6.93415 7.30806 6.81694C7.19085 6.69973 7.125 6.54076 7.125 6.375C7.125 6.20924 7.19085 6.05027 7.30806 5.93306C7.42527 5.81585 7.58424 5.75 7.75 5.75C7.91576 5.75 8.07473 5.81585 8.19194 5.93306C8.30915 6.05027 8.375 6.20924 8.375 6.375Z" fill="#7C7B7B"/>
              <Path fillRule="evenodd" clipRule="evenodd" d="M4 1.625C4.09946 1.625 4.19484 1.66451 4.26516 1.73483C4.33549 1.80516 4.375 1.90054 4.375 2V2.375H7.625V2C7.625 1.90054 7.66451 1.80516 7.73484 1.73483C7.80516 1.66451 7.90054 1.625 8 1.625C8.09946 1.625 8.19484 1.66451 8.26517 1.73483C8.33549 1.80516 8.375 1.90054 8.375 2V2.379C8.451 2.381 8.52183 2.38467 8.5875 2.39C8.7775 2.405 8.9555 2.439 9.124 2.525C9.38278 2.65684 9.59316 2.86722 9.725 3.126C9.811 3.2945 9.845 3.4725 9.86 3.6625C9.875 3.845 9.875 4.0675 9.875 4.335V8.165C9.875 8.4325 9.875 8.655 9.86 8.8375C9.845 9.0275 9.811 9.2055 9.725 9.374C9.5933 9.6327 9.38309 9.84308 9.1245 9.975C8.9555 10.061 8.7775 10.095 8.5875 10.11C8.405 10.125 8.1825 10.125 7.9155 10.125H4.085C3.8175 10.125 3.595 10.125 3.4125 10.11C3.2225 10.095 3.0445 10.061 2.876 9.975C2.61738 9.84343 2.40701 9.6334 2.275 9.375C2.189 9.206 2.155 9.028 2.14 8.838C2.125 8.6555 2.125 8.433 2.125 8.166V4.335C2.125 4.0675 2.125 3.845 2.14 3.6625C2.155 3.4725 2.189 3.2945 2.275 3.126C2.40684 2.86722 2.61722 2.65684 2.876 2.525C3.0445 2.439 3.2225 2.405 3.4125 2.39C3.47817 2.38467 3.549 2.381 3.625 2.379V2C3.625 1.95075 3.6347 1.90199 3.65355 1.85649C3.67239 1.811 3.70001 1.76966 3.73483 1.73483C3.76966 1.70001 3.811 1.67239 3.85649 1.65355C3.90199 1.6347 3.95075 1.625 4 1.625ZM3.625 3.25V3.129C3.57444 3.13056 3.52392 3.13339 3.4735 3.1375C3.33 3.149 3.2615 3.17 3.2165 3.193C3.09871 3.25295 3.00295 3.34871 2.943 3.4665C2.92 3.5115 2.899 3.58 2.8875 3.7235C2.8755 3.8715 2.875 4.0635 2.875 4.35V4.625H9.125V4.35C9.125 4.064 9.125 3.8715 9.1125 3.7235C9.101 3.58 9.08 3.5115 9.057 3.4665C8.99705 3.34871 8.90129 3.25295 8.7835 3.193C8.7385 3.17 8.67 3.149 8.526 3.1375C8.47575 3.1334 8.4254 3.13056 8.375 3.129V3.25C8.375 3.34946 8.33549 3.44484 8.26517 3.51517C8.19484 3.58549 8.09946 3.625 8 3.625C7.90054 3.625 7.80516 3.58549 7.73484 3.51517C7.66451 3.44484 7.625 3.34946 7.625 3.25V3.125H4.375V3.25C4.375 3.34946 4.33549 3.44484 4.26516 3.51517C4.19484 3.58549 4.09946 3.625 4 3.625C3.90054 3.625 3.80516 3.58549 3.73483 3.51517C3.66451 3.44484 3.625 3.34946 3.625 3.25ZM9.125 5.125H2.875V8.15C2.875 8.436 2.875 8.6285 2.8875 8.776C2.899 8.92 2.92 8.9885 2.943 9.0335C3.003 9.1515 3.0985 9.247 3.2165 9.307C3.2615 9.33 3.33 9.351 3.4735 9.3625C3.6215 9.3745 3.8135 9.375 4.1 9.375H7.9C8.186 9.375 8.3785 9.375 8.526 9.3625C8.67 9.351 8.7385 9.33 8.7835 9.307C8.90129 9.24705 8.99705 9.15129 9.057 9.0335C9.08 8.9885 9.101 8.92 9.1125 8.776C9.1245 8.6285 9.125 8.436 9.125 8.15V5.125Z" fill="#7C7B7B"/>
              <Path fillRule="evenodd" clipRule="evenodd" d="M4.875 3.875C4.875 3.77554 4.91451 3.68016 4.98484 3.60983C5.05516 3.53951 5.15054 3.5 5.25 3.5H6.75C6.84946 3.5 6.94484 3.53951 7.01516 3.60983C7.08549 3.68016 7.125 3.77554 7.125 3.875C7.125 3.97446 7.08549 4.06984 7.01516 4.14016C6.94484 4.21049 6.84946 4.25 6.75 4.25H5.25C5.15054 4.25 5.05516 4.21049 4.98484 4.14016C4.91451 4.06984 4.875 3.97446 4.875 3.875Z" fill="#7C7B7B"/>
            </Svg>
            <Text style={styles.infoText}>{order.date}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <Path d="M10.911 3.71551C10.865 3.64904 10.8036 3.59472 10.732 3.55719C10.6604 3.51965 10.5808 3.50003 10.5 3.50001H3.6665L3.0895 2.11501C3.01407 1.93246 2.88601 1.77649 2.72164 1.66697C2.55727 1.55745 2.36402 1.49933 2.1665 1.50001H1V2.50001H2.1665L4.5385 8.19251C4.57649 8.28358 4.64059 8.36138 4.72271 8.4161C4.80484 8.47082 4.90132 8.50001 5 8.50001H9C9.2085 8.50001 9.395 8.37051 9.4685 8.17601L10.9685 4.17601C10.9968 4.10032 11.0064 4.01888 10.9964 3.93868C10.9864 3.85848 10.9571 3.7819 10.911 3.71551ZM8.6535 7.50001H5.3335L4.0835 4.50001H9.7785L8.6535 7.50001Z" fill="#7C7B7B"/>
              <Path d="M5.25 10.5C5.66421 10.5 6 10.1642 6 9.75C6 9.33579 5.66421 9 5.25 9C4.83579 9 4.5 9.33579 4.5 9.75C4.5 10.1642 4.83579 10.5 5.25 10.5Z" fill="#7C7B7B"/>
              <Path d="M8.75 10.5C9.16421 10.5 9.5 10.1642 9.5 9.75C9.5 9.33579 9.16421 9 8.75 9C8.33579 9 8 9.33579 8 9.75C8 10.1642 8.33579 10.5 8.75 10.5Z" fill="#7C7B7B"/>
            </Svg>
            <Text style={styles.infoText}>{order.orderDate}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoText}>{order.units} units</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <Text style={styles.trackText}>Track your Order request here</Text>
        <TouchableOpacity 
          style={styles.previewButton} 
          onPress={() => handlePreviewOrder(order.id)}
        >
          <Text style={styles.previewText}>Preview Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#06888C" />
      
      {/* Extended Header */}
      <View style={styles.extendedHeader}>
        {/* Header Content */}
        <View style={styles.headerContent}>
          <View style={styles.leftSection}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <ArrowBackSVG width={30} height={30} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Orders</Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleNotifications} style={styles.headerAction}>
              <NotificationSVG width={24} height={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleSupport} style={styles.headerAction}>
              <SupportSVG width={24} height={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Requests Banner */}
        <View style={styles.orderBanner}>
          <View style={styles.bannerContent}>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path d="M17 4H7C5.89543 4 5 4.89543 5 6V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V6C19 4.89543 18.1046 4 17 4Z" stroke="white" strokeWidth="2"/>
              <Path d="M9 9H15M9 13H15M9 17H13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </Svg>
            <Text style={styles.bannerText}>You have 3 Order Requests</Text>
          </View>
        </View>
      </View>

      <View style={styles.scrollContainer}>
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {MOCK_ORDERS.map(renderOrderCard)}
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
  extendedHeader: {
    backgroundColor: '#06888C',
    paddingTop: 20,
    paddingBottom: 74,
    zIndex: 0, // Background layer
    position: 'relative',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    marginBottom: 19,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // Small gap between back arrow and title
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
  headerAction: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderBanner: {
    marginHorizontal: 23,
    paddingVertical: 9,
    paddingHorizontal: 22,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  bannerText: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#FFF',
    lineHeight: 22,
  },
  scrollContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: 21,
    paddingTop: 114,
    marginTop: 20,
    gap: 19,
    zIndex: 200,
    position: 'relative',
  },
  orderCard: {
    padding: 17,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    backgroundColor: '#FBFBFB',
    shadowColor: 'rgba(0, 0, 0, 0.20)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 10, // Much higher elevation for Android layering
    zIndex: 300,
    position: 'relative',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  orderTypeText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#000',
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#D9D9D9',
    marginVertical: 10,
  },
  orderDetails: {
    gap: 7,
  },
  totalSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#7C7B7B',
    lineHeight: 22,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#100A37',
    lineHeight: 22,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#484C52',
    lineHeight: 22,
  },
  orderInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  infoText: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#7C7B7B',
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trackText: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#7C7B7B',
    lineHeight: 22,
  },
  previewButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: '#06888C',
  },
  previewText: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Raleway',
    color: '#FFF',
  },
});
