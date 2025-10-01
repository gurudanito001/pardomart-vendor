import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

interface PaymentCardProps {
  cardNumber: string;
  additionalNumber: string;
  isSelected: boolean;
  onSelect: () => void;
}

const PaymentCard: React.FC<PaymentCardProps> = ({
  cardNumber,
  additionalNumber,
  isSelected,
  onSelect,
}) => (
  <Pressable style={styles.paymentCard} onPress={onSelect}>
    <View style={styles.cardContent}>
      {/* Card Icon */}
      <View style={styles.cardIconContainer}>
        <Svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <Circle cx="18" cy="18" r="18" fill="#4FBEAA"/>
          <Svg x="6" y="8" width="24" height="20" viewBox="0 0 24 20" fill="none">
            <Path d="M2 4C2 2.89543 2.89543 2 4 2H20C21.1046 2 22 2.89543 22 4V16C22 17.1046 21.1046 18 20 18H4C2.89543 18 2 17.1046 2 16V4Z" fill="#FDD835"/>
            <Path d="M2 8H22V10H2V8Z" fill="#F57C00"/>
            <Path d="M15 13H19" stroke="#F57C00" strokeWidth="1" strokeLinecap="round"/>
          </Svg>
        </Svg>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardNumber}>{cardNumber}</Text>
        <Text style={styles.additionalNumber}>{additionalNumber}</Text>
      </View>
    </View>
    <View style={styles.cardAction}>
      {isSelected && (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <Path d="M12 2C10.0222 2 8.08879 2.58649 6.4443 3.6853C4.79981 4.78412 3.51809 6.3459 2.76121 8.17317C2.00433 10.0004 1.8063 12.0111 2.19215 13.9509C2.578 15.8907 3.53041 17.6725 4.92894 19.0711C6.32746 20.4696 8.10929 21.422 10.0491 21.8079C11.9889 22.1937 13.9996 21.9957 15.8268 21.2388C17.6541 20.4819 19.2159 19.2002 20.3147 17.5557C21.4135 15.9112 22 13.9778 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7363 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2ZM12 20C10.4178 20 8.87104 19.5308 7.55544 18.6518C6.23985 17.7727 5.21447 16.5233 4.60897 15.0615C4.00347 13.5997 3.84504 11.9911 4.15372 10.4393C4.4624 8.88743 5.22433 7.46197 6.34315 6.34315C7.46197 5.22433 8.88743 4.4624 10.4393 4.15372C11.9911 3.84504 13.5997 4.00346 15.0615 4.60896C16.5233 5.21447 17.7727 6.23984 18.6518 7.55544C19.5308 8.87103 20 10.4177 20 12C20 14.1217 19.1572 16.1566 17.6569 17.6569C16.1566 19.1571 14.1217 20 12 20Z" fill="#100A37"/>
          <Path d="M12 7C11.0111 7 10.0444 7.29324 9.22215 7.84265C8.39991 8.39206 7.75904 9.17295 7.3806 10.0866C7.00217 11.0002 6.90315 12.0055 7.09608 12.9755C7.289 13.9454 7.76521 14.8363 8.46447 15.5355C9.16373 16.2348 10.0546 16.711 11.0246 16.9039C11.9945 17.0969 12.9998 16.9978 13.9134 16.6194C14.827 16.241 15.6079 15.6001 16.1574 14.7779C16.7068 13.9556 17 12.9889 17 12C17 10.6739 16.4732 9.40215 15.5355 8.46447C14.5979 7.52678 13.3261 7 12 7Z" fill="#100A37"/>
        </Svg>
      )}
      <Svg width="7" height="12" viewBox="0 0 7 12" fill="none">
        <Path d="M0.866949 11.9985C0.66474 11.9988 0.468777 11.9292 0.313076 11.8017C0.225444 11.7299 0.153007 11.6418 0.0999113 11.5423C0.0468157 11.4428 0.0141058 11.3339 0.00365506 11.2219C-0.0067957 11.1098 0.00521815 10.9969 0.0390082 10.8895C0.0727983 10.7821 0.1277 10.6823 0.200571 10.5958L4.07768 6.01173L0.339039 1.41906C0.267152 1.33158 0.213468 1.23092 0.181074 1.12286C0.148679 1.01481 0.138213 0.901501 0.150276 0.789439C0.16234 0.677378 0.196694 0.568777 0.251367 0.469879C0.306039 0.370982 0.379951 0.283737 0.468853 0.213159C0.558395 0.135301 0.663255 0.0765731 0.776853 0.0406621C0.89045 0.00475112 1.01033 -0.00756759 1.12898 0.00447846C1.24762 0.0165245 1.36246 0.0526755 1.4663 0.110663C1.57014 0.16865 1.66072 0.247221 1.73237 0.341446L5.91238 5.47292C6.03967 5.62596 6.10925 5.81791 6.10925 6.01601C6.10925 6.2141 6.03967 6.40606 5.91238 6.55909L1.58525 11.6906C1.49843 11.7941 1.38815 11.8759 1.26335 11.9294C1.13854 11.9829 1.00274 12.0065 0.866949 11.9985Z" fill="#333333"/>
      </Svg>
    </View>
  </Pressable>
);

const MyPayments = () => {
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState(0);

  const paymentCards = [
    {
      cardNumber: 'EBT SNAP **** 6342',
      additionalNumber: '+ **** 4532',
    },
    {
      cardNumber: 'EBT SNAP **** 6342',
      additionalNumber: '+ **** 4532',
    },
    {
      cardNumber: 'EBT SNAP **** 6342',
      additionalNumber: '+ **** 4532',
    },
  ];

  const handleGoBack = () => {
    router.back();
  };

  const handleNotifications = () => {
    console.log('Notifications');
  };

  const handleCardSelect = (index: number) => {
    setSelectedCard(index);
  };

  const handleAddPaymentMethod = () => {
    console.log('Add Payment Method');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top','left','right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.backButton} onPress={handleGoBack}>
            <Svg width="11" height="18" viewBox="0 0 11 18" fill="none">
              <Path d="M10.6278 15.993C10.8661 16.2135 11 16.5125 11 16.8243C11 17.1361 10.8661 17.4352 10.6278 17.6556C10.3895 17.8761 10.0662 18 9.72918 18C9.39214 18 9.0689 17.8761 8.83058 17.6556L0.373128 9.83133C0.254859 9.7223 0.161019 9.59274 0.0969895 9.45008C0.0329598 9.30742 0 9.15447 0 9C0 8.84553 0.0329598 8.69258 0.0969895 8.54992C0.161019 8.40726 0.254859 8.2777 0.373128 8.16866L8.83058 0.344349C9.0689 0.123866 9.39214 -4.64634e-09 9.72918 0C10.0662 4.64634e-09 10.3895 0.123866 10.6278 0.34435C10.8661 0.564833 11 0.863872 11 1.17568C11 1.48749 10.8661 1.78653 10.6278 2.00702L3.07 8.99902L10.6278 15.993Z" fill="#100A37"/>
            </Svg>
          </Pressable>
          <Text style={styles.headerTitle}>My Payments</Text>
        </View>
        <Pressable style={styles.notificationButton} onPress={handleNotifications}>
        <View style={styles.supportIconContainer}>
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <Path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M19.8 10.18C19.49 7.00002 17.61 2 11.8 2C5.99002 2 4.11001 7.00002 3.80002 10.18C2.71252 10.5927 1.9952 11.6368 2.00002 12.8V14.2C2.00002 15.7464 3.25365 17 4.80001 17C6.34642 17 7.60004 15.7464 7.60004 14.2V12.8C7.59498 11.6619 6.90404 10.6393 5.85001 10.21C6.05002 8.36998 7.03004 4.00002 11.8 4.00002C16.57 4.00002 17.54 8.36998 17.74 10.21C16.6882 10.6402 16.0007 11.6636 16 12.8V14.2C16.0022 14.7269 16.1524 15.2425 16.4335 15.6881C16.7147 16.1337 17.1154 16.4913 17.59 16.72C17.17 17.51 16.1 18.58 13.47 18.9C12.9443 18.1017 11.9272 17.787 11.0424 18.1489C10.1578 18.5108 9.65279 19.4481 9.83729 20.386C10.0218 21.3239 10.8442 22 11.8 22C12.1704 21.9979 12.5329 21.8931 12.8472 21.6971C13.1615 21.5011 13.4152 21.2217 13.58 20.89C17.87 20.4 19.24 18.19 19.67 16.89C20.8333 16.5132 21.6157 15.4227 21.6 14.2V12.8C21.6048 11.6368 20.8875 10.5927 19.8 10.18ZM5.60002 14.2C5.60002 14.6418 5.24185 15 4.80001 15C4.35816 15 4.00004 14.6419 4.00004 14.2V12.8C3.99923 12.6944 4.01933 12.5897 4.05917 12.492C4.09901 12.3942 4.15781 12.3053 4.23217 12.2304C4.30654 12.1554 4.395 12.0959 4.49247 12.0553C4.58993 12.0148 4.69446 11.9939 4.80003 11.9939C4.90561 11.9939 5.01014 12.0148 5.1076 12.0553C5.20506 12.0959 5.29352 12.1554 5.36789 12.2304C5.44226 12.3053 5.50105 12.3942 5.5409 12.492C5.58074 12.5897 5.60083 12.6944 5.60002 12.8V14.2ZM18 12.8C18 12.3582 18.3582 12 18.8 12C19.2419 12 19.6 12.3582 19.6 12.8V14.2C19.6 14.6418 19.2419 15 18.8 15C18.3582 15 18 14.6419 18 14.2V12.8Z" 
            fill="black"
          />
        </Svg>
        </View>
        
        </Pressable>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Payment Cards List */}
        <View style={styles.paymentsList}>
          {paymentCards.map((card, index) => (
            <PaymentCard
              key={`${card.cardNumber}-${index}`}
              cardNumber={card.cardNumber}
              additionalNumber={card.additionalNumber}
              isSelected={selectedCard === index}
              onSelect={() => handleCardSelect(index)}
            />
          ))}
        </View>

        {/* Add New Payment Method Button */}
        <Pressable style={styles.addButton} onPress={handleAddPaymentMethod}>
          <Svg width="24" height="24" viewBox="0 0 24 25" fill="none">
            <Path d="M15.75 15C15.5511 15 15.3603 15.079 15.2197 15.2197C15.079 15.3603 15 15.5511 15 15.75C15 15.9489 15.079 16.1397 15.2197 16.2803C15.3603 16.421 15.5511 16.5 15.75 16.5H18.25C18.4489 16.5 18.6397 16.421 18.7803 16.2803C18.921 16.1397 19 15.9489 19 15.75C19 15.5511 18.921 15.3603 18.7803 15.2197C18.6397 15.079 18.4489 15 18.25 15H15.75ZM2 8.75C2 7.88805 2.34241 7.0614 2.9519 6.4519C3.5614 5.84241 4.38805 5.5 5.25 5.5H18.75C19.1768 5.5 19.5994 5.58406 19.9937 5.74739C20.388 5.91072 20.7463 6.15011 21.0481 6.4519C21.3499 6.75369 21.5893 7.11197 21.7526 7.50628C21.9159 7.90059 22 8.3232 22 8.75V16.25C22 16.6768 21.9159 17.0994 21.7526 17.4937C21.5893 17.888 21.3499 18.2463 21.0481 18.5481C20.7463 18.8499 20.388 19.0893 19.9937 19.2526C19.5994 19.4159 19.1768 19.5 18.75 19.5H5.25C4.38805 19.5 3.5614 19.1576 2.9519 18.5481C2.34241 17.9386 2 17.112 2 16.25V8.75ZM20.5 10V8.75C20.5 8.28587 20.3156 7.84075 19.9874 7.51256C19.6592 7.18437 19.2141 7 18.75 7H5.25C4.78587 7 4.34075 7.18437 4.01256 7.51256C3.68437 7.84075 3.5 8.28587 3.5 8.75V10H20.5ZM3.5 11.5V16.25C3.5 17.216 4.284 18 5.25 18H18.75C19.2141 18 19.6592 17.8156 19.9874 17.4874C20.3156 17.1592 20.5 16.7141 20.5 16.25V11.5H3.5Z" fill="white"/>
          </Svg>
          <Text style={styles.addButtonText}>Add a new Payment Method</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 21,
    paddingTop: 14,
    paddingBottom: 17,
    backgroundColor: '#FFF',
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
    paddingLeft: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Raleway-SemiBold',
    color: '#000',
    lineHeight: 22,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#B4BED4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  supportIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  paymentsList: {
    paddingHorizontal: 20,
    paddingTop: 17,
    gap: 14,
  },
  paymentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 25,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#FFF',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    flex: 1,
  },
  cardIconContainer: {
    width: 36,
    height: 36,
  },
  cardInfo: {
    flex: 1,
    paddingBottom: 3,
    gap: 7,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'OpenSans-SemiBold',
    color: '#000',
    lineHeight: 16,
  },
  additionalNumber: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'NunitoSans-Regular',
    color: '#898A8D',
    lineHeight: 11,
  },
  cardAction: {
    flexDirection: 'row',
    gap: 29,
    justifyContent: 'center',
    alignItems: 'center',
    width: 53,
  },
  addButton: {
    flexDirection: 'row',
    marginHorizontal: 21,
    marginTop: 27,
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 16,
    backgroundColor: '#F48022',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 9,
    elevation: 2,
    height: 53,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway-Bold',
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 25,
  },
});

export default MyPayments;
