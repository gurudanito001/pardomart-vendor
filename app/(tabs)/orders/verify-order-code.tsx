import { router } from 'expo-router';
import React, { useState } from 'react';
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
import { Ellipse, Path, Rect, Svg } from 'react-native-svg';
import { ArrowBackButtonSVG, NotificationSVG, SupportSVG } from '../../../components/icons';
import { Button } from '../../../components/ui/Button';

interface OTPInputProps {
  length: number;
  value: string[];
  onChange: (otp: string[]) => void;
}

const OrderOTPInput: React.FC<OTPInputProps> = ({ length, value, onChange }) => {
  const filledValues = ['2', '3', '5', '']; // From the design

  return (
    <View style={styles.otpContainer}>
      {Array.from({ length }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.otpInput,
            filledValues[index] ? styles.otpInputFilled : styles.otpInputEmpty,
          ]}
        >
          <Text style={styles.otpText}>{filledValues[index]}</Text>
        </View>
      ))}
    </View>
  );
};

const CopyIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 16 17" fill="none">
    <Path
      d="M13 1.0249H4.625C4.55625 1.0249 4.5 1.08115 4.5 1.1499V2.0249C4.5 2.09365 4.55625 2.1499 4.625 2.1499H12.375V12.8999C12.375 12.9687 12.4312 13.0249 12.5 13.0249H13.375C13.4438 13.0249 13.5 12.9687 13.5 12.8999V1.5249C13.5 1.24834 13.2766 1.0249 13 1.0249ZM11 3.0249H3C2.72344 3.0249 2.5 3.24834 2.5 3.5249V11.8171C2.5 11.9499 2.55312 12.0765 2.64687 12.1702L5.35469 14.878C5.38906 14.9124 5.42813 14.9405 5.47031 14.964V14.9937H5.53594C5.59062 15.014 5.64844 15.0249 5.70781 15.0249H11C11.2766 15.0249 11.5 14.8015 11.5 14.5249V3.5249C11.5 3.24834 11.2766 3.0249 11 3.0249ZM5.46875 13.403L4.12344 12.0562H5.46875V13.403ZM10.375 13.8999H6.46875V11.6812C6.46875 11.3358 6.18906 11.0562 5.84375 11.0562H3.625V4.1499H10.375V13.8999Z"
      fill="black"
    />
  </Svg>
);

const TimeIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 13 13" fill="none">
    <Path
      d="M6.5 1.0249C3.743 1.0249 1.5 3.2679 1.5 6.0249C1.5 8.7819 3.743 11.0249 6.5 11.0249C9.257 11.0249 11.5 8.7819 11.5 6.0249C11.5 3.2679 9.257 1.0249 6.5 1.0249ZM6.5 10.0249C4.2945 10.0249 2.5 8.2304 2.5 6.0249C2.5 3.8194 4.2945 2.0249 6.5 2.0249C8.7055 2.0249 10.5 3.8194 10.5 6.0249C10.5 8.2304 8.7055 10.0249 6.5 10.0249Z"
      fill="#7C7B7B"
    />
    <Path d="M7 3.5249H6V6.5249H9V5.5249H7V3.5249Z" fill="#7C7B7B" />
  </Svg>
);

const CalendarIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 13 13" fill="none">
    <Path
      d="M4.75 7.0249C4.91576 7.0249 5.07473 6.95905 5.19194 6.84184C5.30915 6.72463 5.375 6.56566 5.375 6.3999C5.375 6.23414 5.30915 6.07517 5.19194 5.95796C5.07473 5.84075 4.91576 5.7749 4.75 5.7749C4.58424 5.7749 4.42527 5.84075 4.30806 5.95796C4.19085 6.07517 4.125 6.23414 4.125 6.3999C4.125 6.56566 4.19085 6.72463 4.30806 6.84184C4.42527 6.95905 4.58424 7.0249 4.75 7.0249ZM4.75 8.7749C4.91576 8.7749 5.07473 8.70905 5.19194 8.59184C5.30915 8.47463 5.375 8.31566 5.375 8.1499C5.375 7.98414 5.30915 7.82517 5.19194 7.70796C5.07473 7.59075 4.91576 7.5249 4.75 7.5249C4.58424 7.5249 4.42527 7.59075 4.30806 7.70796C4.19085 7.82517 4.125 7.98414 4.125 8.1499C4.125 8.31566 4.19085 8.47463 4.30806 8.59184C4.42527 8.70905 4.58424 8.7749 4.75 8.7749ZM7.125 6.3999C7.125 6.56566 7.05915 6.72463 6.94194 6.84184C6.82473 6.95905 6.66576 7.0249 6.5 7.0249C6.33424 7.0249 6.17527 6.95905 6.05806 6.84184C5.94085 6.72463 5.875 6.56566 5.875 6.3999C5.875 6.23414 5.94085 6.07517 6.05806 5.95796C6.17527 5.84075 6.33424 5.7749 6.5 5.7749C6.66576 5.7749 6.82473 5.84075 6.94194 5.95796C7.05915 6.07517 7.125 6.23414 7.125 6.3999ZM6.5 8.7749C6.66576 8.7749 6.82473 8.70905 6.94194 8.59184C7.05915 8.47463 7.125 8.31566 7.125 8.1499C7.125 7.98414 7.05915 7.82517 6.94194 7.70796C6.82473 7.59075 6.66576 7.5249 6.5 7.5249C6.33424 7.5249 6.17527 7.59075 6.05806 7.70796C5.94085 7.82517 5.875 7.98414 5.875 8.1499C5.875 8.31566 5.94085 8.47463 6.05806 8.59184C6.17527 8.70905 6.33424 8.7749 6.5 8.7749ZM8.875 6.3999C8.875 6.56566 8.80915 6.72463 8.69194 6.84184C8.57473 6.95905 8.41576 7.0249 8.25 7.0249C8.08424 7.0249 7.92527 6.95905 7.80806 6.84184C7.69085 6.72463 7.625 6.56566 7.625 6.3999C7.625 6.23414 7.69085 6.07517 7.80806 5.95796C7.92527 5.84075 8.08424 5.7749 8.25 5.7749C8.41576 5.7749 8.57473 5.84075 8.69194 5.95796C8.80915 6.07517 8.875 6.23414 8.875 6.3999Z"
      fill="#7C7B7B"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.5 1.6499C4.59946 1.6499 4.69484 1.68941 4.76516 1.75974C4.83549 1.83006 4.875 1.92545 4.875 2.0249V2.3999H8.125V2.0249C8.125 1.92545 8.16451 1.83006 8.23484 1.75974C8.30516 1.68941 8.40054 1.6499 8.5 1.6499C8.59946 1.6499 8.69484 1.68941 8.76517 1.75974C8.83549 1.83006 8.875 1.92545 8.875 2.0249V2.4039C8.951 2.4059 9.02183 2.40957 9.0875 2.4149C9.2775 2.4299 9.4555 2.4639 9.624 2.5499C9.88278 2.68174 10.0932 2.89213 10.225 3.1509C10.311 3.3194 10.345 3.4974 10.36 3.6874C10.375 3.8699 10.375 4.0924 10.375 4.3599V8.1899C10.375 8.4574 10.375 8.6799 10.36 8.8624C10.345 9.0524 10.311 9.2304 10.225 9.3989C10.0933 9.6576 9.88309 9.86798 9.6245 9.9999C9.4555 10.0859 9.2775 10.1199 9.0875 10.1349C8.905 10.1499 8.6825 10.1499 8.4155 10.1499H4.585C4.3175 10.1499 4.095 10.1499 3.9125 10.1349C3.7225 10.1199 3.5445 10.0859 3.376 9.9999C3.11738 9.86833 2.90701 9.65831 2.775 9.3999C2.689 9.2309 2.655 9.0529 2.64 8.8629C2.625 8.6804 2.625 8.4579 2.625 8.1909V4.3599C2.625 4.0924 2.625 3.8699 2.64 3.6874C2.655 3.4974 2.689 3.3194 2.775 3.1509C2.90684 2.89213 3.11722 2.68174 3.376 2.5499C3.5445 2.4639 3.7225 2.4299 3.9125 2.4149C3.97817 2.40957 4.049 2.4059 4.125 2.4039V2.0249C4.125 1.97566 4.1347 1.92689 4.15355 1.8814C4.17239 1.8359 4.20001 1.79456 4.23483 1.75974C4.26966 1.72492 4.311 1.69729 4.35649 1.67845C4.40199 1.6596 4.45075 1.6499 4.5 1.6499ZM4.125 3.2749V3.1539C4.07444 3.15546 4.02392 3.15829 3.9735 3.1624C3.83 3.1739 3.7615 3.1949 3.7165 3.2179C3.59871 3.27786 3.50295 3.37361 3.443 3.4914C3.42 3.5364 3.399 3.6049 3.3875 3.7484C3.3755 3.8964 3.375 4.0884 3.375 4.3749V4.6499H9.625V4.3749C9.625 4.0889 9.625 3.8964 9.6125 3.7484C9.601 3.6049 9.58 3.5364 9.557 3.4914C9.49705 3.37361 9.40129 3.27786 9.2835 3.2179C9.2385 3.1949 9.17 3.1739 9.026 3.1624C8.97575 3.1583 8.9254 3.15547 8.875 3.1539V3.2749C8.875 3.37436 8.83549 3.46974 8.76517 3.54007C8.69484 3.61039 8.59946 3.6499 8.5 3.6499C8.40054 3.6499 8.30516 3.61039 8.23484 3.54007C8.16451 3.46974 8.125 3.37436 8.125 3.2749V3.1499H4.875V3.2749C4.875 3.37436 4.83549 3.46974 4.76516 3.54007C4.69484 3.61039 4.59946 3.6499 4.5 3.6499C4.40054 3.6499 4.30516 3.61039 4.23483 3.54007C4.16451 3.46974 4.125 3.37436 4.125 3.2749ZM9.625 5.1499H3.375V8.1749C3.375 8.4609 3.375 8.6534 3.3875 8.8009C3.399 8.9449 3.42 9.0134 3.443 9.0584C3.503 9.1764 3.5985 9.2719 3.7165 9.3319C3.7615 9.3549 3.83 9.3759 3.9735 9.3874C4.1215 9.3994 4.3135 9.3999 4.6 9.3999H8.4C8.686 9.3999 8.8785 9.3999 9.026 9.3874C9.17 9.3759 9.2385 9.3549 9.2835 9.3319C9.40129 9.27195 9.49705 9.17619 9.557 9.0584C9.58 9.0134 9.601 8.9449 9.6125 8.8009C9.6245 8.6534 9.625 8.4609 9.625 8.1749V5.1499Z"
      fill="#7C7B7B"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.375 3.8999C5.375 3.80045 5.41451 3.70506 5.48484 3.63474C5.55516 3.56441 5.65054 3.5249 5.75 3.5249H7.25C7.34946 3.5249 7.44484 3.56441 7.51516 3.63474C7.58549 3.70506 7.625 3.80045 7.625 3.8999C7.625 3.99936 7.58549 4.09474 7.51516 4.16507C7.44484 4.23539 7.34946 4.2749 7.25 4.2749H5.75C5.65054 4.2749 5.55516 4.23539 5.48484 4.16507C5.41451 4.09474 5.375 3.99936 5.375 3.8999Z"
      fill="#7C7B7B"
    />
  </Svg>
);

const ChatIcon = () => (
  <Svg width="30" height="30" viewBox="0 0 30 30" fill="none">
    <Rect width="30" height="30" rx="15" fill="#2CAF0B" />
    <Path
      d="M15 8.92505C18.7125 8.92505 21.75 11.3415 21.75 14.325C21.75 17.3085 18.7125 19.725 15 19.725C14.163 19.725 13.3598 19.6035 12.6173 19.3875C10.6463 21.075 8.25 21.075 8.25 21.075C9.82275 19.5023 10.0725 18.4425 10.1063 18.0375C8.95875 17.0723 8.25 15.7628 8.25 14.325C8.25 11.3415 11.2875 8.92505 15 8.92505Z"
      fill="white"
    />
  </Svg>
);

const PhoneIcon = () => (
  <Svg width="30" height="30" viewBox="0 0 30 30" fill="none">
    <Rect x="0.5" y="0.5" width="29" height="29" rx="14.5" stroke="#2CAF0B" />
    <Path
      d="M18.1618 20.2498C17.7043 20.2498 17.0616 20.0843 16.0993 19.5467C14.929 18.8904 14.0239 18.2845 12.86 17.1237C11.7378 16.0022 11.1917 15.2761 10.4274 13.8853C9.56395 12.315 9.71114 11.4919 9.87567 11.1401C10.0716 10.7196 10.3608 10.4681 10.7347 10.2185C10.947 10.0794 11.1717 9.96016 11.4059 9.86228C11.4293 9.8522 11.4511 9.8426 11.4706 9.83392C11.5866 9.78166 11.7624 9.70267 11.985 9.78705C12.1336 9.84283 12.2663 9.95697 12.4739 10.162C12.8998 10.582 13.4818 11.5174 13.6964 11.9768C13.8406 12.2864 13.936 12.4908 13.9362 12.72C13.9362 12.9884 13.8012 13.1953 13.6374 13.4187C13.6067 13.4606 13.5762 13.5007 13.5467 13.5396C13.3683 13.774 13.3292 13.8417 13.355 13.9627C13.4072 14.2057 13.797 14.9292 14.4375 15.5684C15.0781 16.2075 15.7807 16.5727 16.0247 16.6247C16.1508 16.6517 16.22 16.6109 16.4618 16.4262C16.4965 16.3997 16.5322 16.3723 16.5694 16.3449C16.8193 16.159 17.0166 16.0275 17.2786 16.0275H17.28C17.5081 16.0275 17.7033 16.1264 18.0268 16.2895C18.4486 16.5024 19.4122 17.0768 19.8347 17.5031C20.0403 17.7103 20.1549 17.8425 20.2109 17.9909C20.2953 18.2142 20.2158 18.3893 20.164 18.5065C20.1554 18.526 20.1457 18.5473 20.1357 18.571C20.037 18.8048 19.9171 19.029 19.7773 19.2408C19.5282 19.6135 19.2757 19.902 18.8543 20.0981C18.638 20.2005 18.4011 20.2524 18.1618 20.2498Z"
      fill="black"
    />
  </Svg>
);

const ProgressIndicator = () => (
  <Svg width="244" height="17" viewBox="0 0 244 17" fill="none">
    <Ellipse
      cx="8.1669"
      cy="8.00003"
      rx="8.1669"
      ry="8.00003"
      transform="matrix(0.999999 -0.00151211 -0.00120656 0.999999 0.140625 0.0247803)"
      fill="#2CAF0B"
    />
    <Rect width="211" height="2" transform="translate(16.5 7.01245)" fill="#D9D9D9" />
    <Ellipse
      cx="8.1669"
      cy="8.00003"
      rx="8.1669"
      ry="8.00003"
      transform="matrix(0.999999 -0.00151211 -0.00120656 0.999999 227.543 0.0249023)"
      fill="#B4BED4"
    />
  </Svg>
);

export default function VerifyOrderCode() {
  const [otpValues, setOtpValues] = useState(['', '', '', '']);

  const handleBackPress = () => {
    router.back();
  };

  const handleVerifyOrder = () => {
    // Handle order verification logic here
    // After successful verification, navigate to order verified page
    router.push('/(tabs)/orders/order-verified');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#06888C" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <ArrowBackButtonSVG width={30} height={30} color="white" />
        </TouchableOpacity>
        
        <View style={styles.headerTitle}>
          <Text style={styles.headerTitleText}>Order Verification</Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerAction}>
            <NotificationSVG width={24} height={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerAction}>
            <SupportSVG width={24} height={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary Card */}
        <View style={styles.orderCard}>
          <View style={styles.orderSummary}>
            <View style={styles.totalRow}>
              <Text style={styles.estimatedTotalLabel}>Estimated Total</Text>
              <Text style={styles.totalAmount}>$120.60</Text>
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

          {/* Progress and Route Info */}
          <View style={styles.routeSection}>
            <Text style={styles.routeDistance}>4.5 Miles - 20 Items</Text>
            <View style={styles.progressContainer}>
              <ProgressIndicator />
            </View>
            
            <View style={styles.routeDetails}>
              <View style={styles.fromLocation}>
                <Text style={styles.locationName}>Mr Damilare Adebanjo</Text>
                <View style={styles.timeInfo}>
                  <TimeIcon />
                  <Text style={styles.timeText}>12:00pm</Text>
                  <CalendarIcon />
                  <Text style={styles.timeText}>03/2025</Text>
                </View>
              </View>
              
              <View style={styles.toLocation}>
                <Text style={styles.locationName}>47 North Union Avenue</Text>
                <Text style={styles.locationAddress}>Chicago Illiniou, 60612, US</Text>
              </View>
            </View>
          </View>

          {/* Order Code */}
          <View style={styles.orderCodeSection}>
            <Text style={styles.orderCodeText}>Order code - 987BNTT43</Text>
            <TouchableOpacity>
              <CopyIcon />
            </TouchableOpacity>
          </View>

          {/* View Shopping Items Button */}
          <TouchableOpacity style={styles.viewItemsButton}>
            <Text style={styles.viewItemsButtonText}>View Shopping Items</Text>
          </TouchableOpacity>
        </View>

        {/* Customer Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer</Text>
          <View style={styles.personCard}>
            <View style={styles.personInfo}>
              <Image
                source={{ uri: 'https://api.builder.io/api/v1/image/assets/TEMP/c91bce15e2114688cb19d13e673d86c47c9917ca?width=60' }}
                style={styles.avatar}
              />
              <Text style={styles.personName}>Mr Damilare Adebanjo</Text>
            </View>
            <View style={styles.contactActions}>
              <TouchableOpacity>
                <ChatIcon />
              </TouchableOpacity>
              <TouchableOpacity>
                <PhoneIcon />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Shopper Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shopper</Text>
          <View style={styles.personCard}>
            <View style={styles.personInfo}>
              <Image
                source={{ uri: 'https://api.builder.io/api/v1/image/assets/TEMP/08cfd7893574997b1ad5b87c73f1e8643779a8cd?width=60' }}
                style={styles.avatar}
              />
              <Text style={styles.personName}>Mr Kelvin Goodswil</Text>
            </View>
            <View style={styles.contactActions}>
              <TouchableOpacity>
                <ChatIcon />
              </TouchableOpacity>
              <TouchableOpacity>
                <PhoneIcon />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* OTP Verification Section */}
        <View style={styles.verificationSection}>
          <Text style={styles.verificationTitle}>Kindly verify Order</Text>
          <Text style={styles.verificationSubtitle}>
            Enter the OTP code for this Order to verify
          </Text>
          
          <OrderOTPInput 
            length={4} 
            value={otpValues} 
            onChange={setOtpValues} 
          />
        </View>

        {/* Verify Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Verify Order"
            onPress={handleVerifyOrder}
            variant="primary"
            size="large"
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  header: {
    backgroundColor: '#06888C',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 16,
    height: 80,
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
  },
  
  headerTitleText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Raleway',
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
    paddingHorizontal: 21,
    paddingTop: 20,
  },
  
  orderCard: {
    backgroundColor: '#FBFBFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#B4BED4',
    padding: 17,
    marginBottom: 20,
  },
  
  orderSummary: {
    marginBottom: 16,
  },
  
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  
  estimatedTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#484C52',
  },
  
  totalAmount: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#100A37',
  },
  
  costBreakdown: {
    marginTop: 14,
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
    marginVertical: 18,
  },
  
  routeSection: {
    alignItems: 'center',
    gap: 10,
  },
  
  routeDistance: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#484C52',
    textAlign: 'center',
  },
  
  progressContainer: {
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  
  routeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    gap: 90,
  },
  
  fromLocation: {
    alignItems: 'flex-start',
    gap: 4,
  },
  
  toLocation: {
    alignItems: 'flex-end',
    gap: 4,
  },
  
  locationName: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#484C52',
  },
  
  locationAddress: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#484C52',
  },
  
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  
  timeText: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#7C7B7B',
    marginRight: 3,
  },
  
  orderCodeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 37,
    marginBottom: 18,
  },
  
  orderCodeText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#000000',
  },
  
  viewItemsButton: {
    backgroundColor: '#06888C',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  
  viewItemsButtonText: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Raleway',
    color: '#FFFFFF',
  },
  
  section: {
    marginBottom: 19,
  },
  
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#000000',
    marginBottom: 10,
  },
  
  personCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    paddingVertical: 11,
    paddingHorizontal: 19,
  },
  
  personInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  
  personName: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#000000',
  },
  
  contactActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  
  verificationSection: {
    gap: 30,
    marginTop: 20,
    marginBottom: 40,
  },
  
  verificationTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#2B2829',
  },
  
  verificationSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#2B2829',
    letterSpacing: 0.7,
    marginTop: -22,
  },
  
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  
  otpInput: {
    width: 49,
    height: 49,
    borderRadius: 6.5,
    borderWidth: 1.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  otpInputFilled: {
    borderColor: '#0085FF',
    backgroundColor: '#FFFFFF',
  },
  
  otpInputEmpty: {
    borderColor: '#CFD7EC',
    backgroundColor: 'rgba(230, 102, 26, 0.02)',
  },
  
  otpText: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#1C2035',
    letterSpacing: 0.653,
  },
  
  buttonContainer: {
    paddingHorizontal: 1,
    paddingBottom: 30,
  },
});
