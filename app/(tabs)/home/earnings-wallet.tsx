import { router } from 'expo-router';
import React from 'react';
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
import { Path, Svg } from 'react-native-svg';

interface Transaction {
  id: string;
  type: 'earning' | 'withdrawal';
  name?: string;
  amount: number;
  date: string;
  avatar?: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'earning',
    name: 'Jeremiah Johns',
    amount: 342.66,
    date: 'Aug 12, 2025, 04:35am',
    avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/222214b9aa6ad996b4688828592130754b6d86ee?width=72',
  },
  {
    id: '2',
    type: 'withdrawal',
    amount: 342.66,
    date: 'Aug 12, 2025, 04:35am',
  },
  {
    id: '3',
    type: 'earning',
    name: 'Jeremiah Johns',
    amount: 342.66,
    date: 'Aug 12, 2025, 04:35am',
    avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/be49974607e92074195149dd07ce08c646eea48d?width=72',
  },
  {
    id: '4',
    type: 'withdrawal',
    amount: 342.66,
    date: 'Aug 12, 2025, 04:35am',
  },
  {
    id: '5',
    type: 'earning',
    name: 'Jeremiah Johns',
    amount: 342.66,
    date: 'Aug 12, 2025, 04:35am',
    avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/9d931bd96b4451ec550f55a0d925e05a02ac2c72?width=72',
  },
  {
    id: '6',
    type: 'withdrawal',
    amount: 342.66,
    date: 'Aug 12, 2025, 04:35am',
  },
  {
    id: '7',
    type: 'withdrawal',
    amount: 342.66,
    date: 'Aug 12, 2025, 04:35am',
  },
];

export default function EarningsWalletScreen() {
  const handleGoBack = () => {
    router.back();
  };

  const handleNotifications = () => {
    console.log('Open notifications');
  };

  const handleSupport = () => {
    console.log('Open support');
  };

  const handleWithdraw = () => {
    console.log('Process withdrawal');
    // Navigate to withdrawal screen
  };

  const handleViewAllTransactions = () => {
    console.log('View all transactions');
    // Navigate to all transactions screen
  };

  const TransactionCard = ({ transaction }: { transaction: Transaction }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionContent}>
        {transaction.type === 'earning' && transaction.avatar ? (
          <Image 
            source={{ uri: transaction.avatar }}
            style={styles.transactionAvatar}
          />
        ) : (
          <View style={styles.withdrawalIcon}>
            <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <Path d="M18.333 1.66675H1.66634C1.44533 1.66675 1.23337 1.75455 1.07709 1.91083C0.920805 2.06711 0.833008 2.27907 0.833008 2.50008V9.16675C0.833008 9.38776 0.920805 9.59972 1.07709 9.756C1.23337 9.91228 1.44533 10.0001 1.66634 10.0001H4.16634V17.5001C4.16634 17.7211 4.25414 17.9331 4.41042 18.0893C4.5667 18.2456 4.77866 18.3334 4.99967 18.3334H14.9997C15.2207 18.3334 15.4327 18.2456 15.5889 18.0893C15.7452 17.9331 15.833 17.7211 15.833 17.5001V10.0001H18.333C18.554 10.0001 18.766 9.91228 18.9223 9.756C19.0785 9.59972 19.1663 9.38776 19.1663 9.16675V2.50008C19.1663 2.27907 19.0785 2.06711 18.9223 1.91083C18.766 1.75455 18.554 1.66675 18.333 1.66675ZM5.83301 16.6667V15.0001C6.27504 15.0001 6.69896 15.1757 7.01152 15.4882C7.32408 15.8008 7.49967 16.2247 7.49967 16.6667H5.83301ZM14.1663 16.6667H12.4997C12.4997 16.2247 12.6753 15.8008 12.9878 15.4882C13.3004 15.1757 13.7243 15.0001 14.1663 15.0001V16.6667ZM14.1663 13.3334C13.2823 13.3334 12.4344 13.6846 11.8093 14.3097C11.1842 14.9348 10.833 15.7827 10.833 16.6667H9.16634C9.16634 15.7827 8.81515 14.9348 8.19003 14.3097C7.56491 13.6846 6.71706 13.3334 5.83301 13.3334V6.66675H14.1663V13.3334ZM17.4997 8.33341H15.833V5.83341C15.833 5.6124 15.7452 5.40044 15.5889 5.24416C15.4327 5.08788 15.2207 5.00008 14.9997 5.00008H4.99967C4.77866 5.00008 4.5667 5.08788 4.41042 5.24416C4.25414 5.40044 4.16634 5.6124 4.16634 5.83341V8.33341H2.49967V3.33341H17.4997V8.33341ZM9.99967 12.5001C10.4941 12.5001 10.9775 12.3535 11.3886 12.0788C11.7997 11.8041 12.1202 11.4136 12.3094 10.9568C12.4986 10.5 12.5481 9.99731 12.4516 9.51236C12.3552 9.0274 12.1171 8.58195 11.7674 8.23231C11.4178 7.88268 10.9724 7.64458 10.4874 7.54812C10.0024 7.45165 9.49978 7.50116 9.04297 7.69038C8.58615 7.8796 8.1957 8.20003 7.921 8.61116C7.6463 9.02228 7.49967 9.50563 7.49967 10.0001C7.49967 10.6631 7.76307 11.299 8.23191 11.7678C8.70075 12.2367 9.33663 12.5001 9.99967 12.5001ZM9.99967 9.16675C10.1645 9.16675 10.3256 9.21562 10.4627 9.30719C10.5997 9.39876 10.7065 9.52891 10.7696 9.68118C10.8326 9.83345 10.8492 10.001 10.817 10.1627C10.7848 10.3243 10.7055 10.4728 10.5889 10.5893C10.4724 10.7059 10.3239 10.7852 10.1623 10.8174C10.0006 10.8496 9.83304 10.8331 9.68077 10.77C9.5285 10.7069 9.39835 10.6001 9.30678 10.4631C9.21522 10.326 9.16634 10.1649 9.16634 10.0001C9.16634 9.77907 9.25414 9.56711 9.41042 9.41083C9.5667 9.25455 9.77866 9.16675 9.99967 9.16675Z" fill="black"/>
            </Svg>
          </View>
        )}
        
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionName}>
            {transaction.type === 'earning' ? transaction.name : 'Withdrawal'}
          </Text>
          <Text style={styles.transactionDate}>{transaction.date}</Text>
        </View>
        
        <Text style={[
          styles.transactionAmount,
          transaction.type === 'earning' ? styles.earningAmount : styles.withdrawalAmount
        ]}>
          {transaction.type === 'earning' ? '+' : '-'}${transaction.amount}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#06888C" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.leftSection}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <Svg width="30" height="30" viewBox="0 0 31 30" fill="none">
                <Path d="M20.1278 21.993C20.3661 22.2135 20.5 22.5125 20.5 22.8243C20.5 23.1361 20.3661 23.4352 20.1278 23.6556C19.8895 23.8761 19.5662 24 19.2292 24C18.8921 24 18.5689 23.8761 18.3306 23.6556L9.87313 15.8313C9.75486 15.7223 9.66102 15.5927 9.59699 15.4501C9.53296 15.3074 9.5 15.1545 9.5 15C9.5 14.8455 9.53296 14.6926 9.59699 14.5499C9.66102 14.4073 9.75486 14.2777 9.87313 14.1687L18.3306 6.34435C18.5689 6.12387 18.8921 6 19.2292 6C19.5662 6 19.8895 6.12387 20.1278 6.34435C20.3661 6.56483 20.5 6.86387 20.5 7.17568C20.5 7.48749 20.3661 7.78653 20.1278 8.00702L12.57 14.999L20.1278 21.993Z" fill="white"/>
              </Svg>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Earnings & Wallet</Text>
          </View>
          <View style={styles.rightSection}>
            <TouchableOpacity style={styles.iconButton} onPress={handleNotifications}>
              <Svg width="24" height="24" viewBox="0 0 25 24" fill="none">
                <Path d="M9.145 20.5C9.36103 21.2219 9.80417 21.8549 10.4086 22.3049C11.013 22.755 11.7464 22.998 12.5 22.998C13.2536 22.998 13.987 22.755 14.5914 22.3049C15.1958 21.8549 15.639 21.2219 15.855 20.5H9.145ZM3.5 19.5H21.5V16.5L19.5 13.5V8.5C19.5 7.58075 19.3189 6.6705 18.9672 5.82122C18.6154 4.97194 18.0998 4.20026 17.4497 3.55025C16.7997 2.90024 16.0281 2.38463 15.1788 2.03284C14.3295 1.68106 13.4193 1.5 12.5 1.5C11.5807 1.5 10.6705 1.68106 9.82122 2.03284C8.97194 2.38463 8.20026 2.90024 7.55025 3.55025C6.90024 4.20026 6.38463 4.97194 6.03284 5.82122C5.68106 6.6705 5.5 7.58075 5.5 8.5V13.5L3.5 16.5V19.5Z" fill="white"/>
              </Svg>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleSupport}>
              <Svg width="24" height="24" viewBox="0 0 25 24" fill="none">
                <Path fillRule="evenodd" clipRule="evenodd" d="M20.3 10.18C19.99 7.00002 18.11 2 12.3 2C6.49002 2 4.61001 7.00002 4.30002 10.18C3.21252 10.5927 2.4952 11.6368 2.50002 12.8V14.2C2.50002 15.7464 3.75365 17 5.30001 17C6.84642 17 8.10004 15.7464 8.10004 14.2V12.8C8.09498 11.6619 7.40404 10.6393 6.35001 10.21C6.55002 8.36998 7.53004 4.00002 12.3 4.00002C17.07 4.00002 18.04 8.36998 18.24 10.21C17.1882 10.6402 16.5007 11.6636 16.5 12.8V14.2C16.5022 14.7269 16.6524 15.2425 16.9335 15.6881C17.2147 16.1337 17.6154 16.4913 18.09 16.72C17.67 17.51 16.6 18.58 13.97 18.9C13.4443 18.1017 12.4272 17.787 11.5424 18.1489C10.6578 18.5108 10.1528 19.4481 10.3373 20.386C10.5218 21.3239 11.3442 22 12.3 22C12.6704 21.9979 13.0329 21.8931 13.3472 21.6971C13.6615 21.5011 13.9152 21.2217 14.08 20.89C18.37 20.4 19.74 18.19 20.17 16.89C21.3333 16.5132 22.1157 15.4227 22.1 14.2V12.8C22.1048 11.6368 21.3875 10.5927 20.3 10.18ZM6.10002 14.2C6.10002 14.6418 5.74185 15 5.30001 15C4.85816 15 4.50004 14.6419 4.50004 14.2V12.8C4.49923 12.6944 4.51933 12.5897 4.55917 12.492C4.59901 12.3942 4.65781 12.3053 4.73217 12.2304C4.80654 12.1554 4.895 12.0959 4.99247 12.0553C5.08993 12.0148 5.19446 11.9939 5.30003 11.9939C5.40561 11.9939 5.51014 12.0148 5.6076 12.0553C5.70506 12.0959 5.79352 12.1554 5.86789 12.2304C5.94226 12.3053 6.00105 12.3942 6.0409 12.492C6.08074 12.5897 6.10083 12.6944 6.10002 12.8V14.2ZM18.5 12.8C18.5 12.3582 18.8582 12 19.3 12C19.7419 12 20.1 12.3582 20.1 12.8V14.2C20.1 14.6418 19.7419 15 19.3 15C18.8582 15 18.5 14.6419 18.5 14.2V12.8Z" fill="white"/>
              </Svg>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Wallet Balance Card */}
          <View style={styles.walletCard}>
            <Text style={styles.walletTitle}>Your Wallet Balance</Text>
            
            <View style={styles.balanceSection}>
              <View style={styles.balanceContainer}>
                <Svg width="23" height="28" viewBox="0 0 23 28" fill="none">
                  <Path d="M11.5 13.3C17.852 13.3 23 10.6859 23 7.4648C23 4.2437 17.852 1.62964 11.5 1.62964C5.14805 1.62964 0 4.2437 0 7.4648C0 10.6859 5.14805 13.3 11.5 13.3ZM11.5 22.6296C7.11113 22.6296 3.22988 21.3445 0.781641 19.3593C0.283008 20.0156 0 20.721 0 21.4648C0 24.6859 5.14805 27.3 11.5 27.3C17.852 27.3 23 24.6859 23 21.4648C23 20.721 22.717 20.0156 22.2184 19.3648C19.7701 21.3445 15.8889 22.6296 11.5 22.6296ZM11.5 15.6296C7.11113 15.6296 3.22988 14.3445 0.781641 12.3593C0.283008 13.0156 0 13.721 0 14.4648C0 17.6859 5.14805 20.3 11.5 20.3C17.852 20.3 23 17.6859 23 14.4648C23 13.721 22.717 13.0156 22.2184 12.3648C19.7701 14.3445 15.8889 15.6296 11.5 15.6296Z" fill="black"/>
                </Svg>
                <Text style={styles.balanceAmount}>$7,210.55</Text>
              </View>
              
              <View style={styles.hideIcon}>
                <Svg width="11" height="10" viewBox="0 0 11 10" fill="none">
                  <Path d="M3.0365 5.09698L1.106 3.16648C0.346 3.99498 0.058 4.82499 0.053 4.84198L0 4.99998L0.0525 5.15798C0.0635 5.19148 1.2105 8.49999 5.027 8.49999C5.4915 8.49999 5.9145 8.44899 6.303 8.36349L4.93 6.99049C4.43564 6.96625 3.96798 6.75898 3.61799 6.40899C3.26801 6.05901 3.06073 5.59134 3.0365 5.09698ZM5.027 1.49998C4.0995 1.49998 3.3395 1.70198 2.706 1.99898L0.8535 0.146484L0.1465 0.853484L9.1465 9.85349L9.8535 9.14649L8.2045 7.49749C9.5235 6.52099 9.994 5.17898 10.001 5.15798L10.0535 4.99998L10.001 4.84198C9.99 4.80849 8.8435 1.49998 5.027 1.49998ZM5.98 5.27298C6.0735 4.93448 5.994 4.55348 5.734 4.29298C5.474 4.03249 5.0925 3.95348 4.754 4.04698L4 3.29298C4.30903 3.10309 4.66429 3.00174 5.027 2.99998C6.13 2.99998 7.027 3.89698 7.027 4.99998C7.02552 5.36264 6.92395 5.71786 6.7335 6.02648L5.98 5.27298Z" fill="#7E7E7E"/>
                </Svg>
              </View>
            </View>
            
            <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdraw}>
              <Svg width="24" height="24" viewBox="0 0 25 25" fill="none">
                <Path d="M22.5 2.5H2.5C2.23478 2.5 1.98043 2.60536 1.79289 2.79289C1.60536 2.98043 1.5 3.23478 1.5 3.5V11.5C1.5 11.7652 1.60536 12.0196 1.79289 12.2071C1.98043 12.3946 2.23478 12.5 2.5 12.5H5.5V21.5C5.5 21.7652 5.60536 22.0196 5.79289 22.2071C5.98043 22.3946 6.23478 22.5 6.5 22.5H18.5C18.7652 22.5 19.0196 22.3946 19.2071 22.2071C19.3946 22.0196 19.5 21.7652 19.5 21.5V12.5H22.5C22.7652 12.5 23.0196 12.3946 23.2071 12.2071C23.3946 12.0196 23.5 11.7652 23.5 11.5V3.5C23.5 3.23478 23.3946 2.98043 23.2071 2.79289C23.0196 2.60536 22.7652 2.5 22.5 2.5ZM7.5 20.5V18.5C8.03043 18.5 8.53914 18.7107 8.91421 19.0858C9.28929 19.4609 9.5 19.9696 9.5 20.5H7.5ZM17.5 20.5H15.5C15.5 19.9696 15.7107 19.4609 16.0858 19.0858C16.4609 18.7107 16.9696 18.5 17.5 18.5V20.5ZM17.5 16.5C16.4391 16.5 15.4217 16.9214 14.6716 17.6716C13.9214 18.4217 13.5 19.4391 13.5 20.5H11.5C11.5 19.4391 11.0786 18.4217 10.3284 17.6716C9.57828 16.9214 8.56087 16.5 7.5 16.5V8.5H17.5V16.5ZM21.5 10.5H19.5V7.5C19.5 7.23478 19.3946 6.98043 19.2071 6.79289C19.0196 6.60536 18.7652 6.5 18.5 6.5H6.5C6.23478 6.5 5.98043 6.60536 5.79289 6.79289C5.60536 6.98043 5.5 7.23478 5.5 7.5V10.5H3.5V4.5H21.5V10.5ZM12.5 15.5C13.0933 15.5 13.6734 15.3241 14.1667 14.9944C14.6601 14.6648 15.0446 14.1962 15.2716 13.6481C15.4987 13.0999 15.5581 12.4967 15.4424 11.9147C15.3266 11.3328 15.0409 10.7982 14.6213 10.3787C14.2018 9.95912 13.6672 9.6734 13.0853 9.55764C12.5033 9.44189 11.9001 9.5013 11.3519 9.72836C10.8038 9.95542 10.3352 10.3399 10.0056 10.8333C9.67595 11.3266 9.5 11.9067 9.5 12.5C9.5 13.2956 9.81607 14.0587 10.3787 14.6213C10.9413 15.1839 11.7044 15.5 12.5 15.5ZM12.5 11.5C12.6978 11.5 12.8911 11.5586 13.0556 11.6685C13.22 11.7784 13.3482 11.9346 13.4239 12.1173C13.4996 12.3 13.5194 12.5011 13.4808 12.6951C13.4422 12.8891 13.347 13.0673 13.2071 13.2071C13.0673 13.347 12.8891 13.4422 12.6951 13.4808C12.5011 13.5194 12.3 13.4996 12.1173 13.4239C11.9346 13.3482 11.7784 13.22 11.6685 13.0556C11.5586 12.8911 11.5 12.6978 11.5 12.5C11.5 12.2348 11.6054 11.9804 11.7929 11.7929C11.9804 11.6054 12.2348 11.5 12.5 11.5Z" fill="white"/>
              </Svg>
              <Text style={styles.withdrawText}>Withdraw</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Transactions */}
          <View style={styles.transactionsSection}>
            <View style={styles.transactionsHeader}>
              <Text style={styles.transactionsTitle}>Recent Transactions</Text>
              <TouchableOpacity onPress={handleViewAllTransactions}>
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.transactionsList}>
              {MOCK_TRANSACTIONS.map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    backgroundColor: '#06888C',
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  leftSection: {
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
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 30,
    gap: 37,
  },
  walletCard: {
    backgroundColor: 'rgba(191, 227, 198, 0.60)',
    borderRadius: 16,
    paddingVertical: 36,
    paddingHorizontal: 41,
    gap: 15,
  },
  walletTitle: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Raleway',
    color: '#707070',
  },
  balanceSection: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#000',
    lineHeight: 25,
  },
  hideIcon: {
    width: 11,
    height: 10,
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 120,
    borderRadius: 16,
    backgroundColor: '#06888C',
    gap: 6,
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 9,
    elevation: 3,
  },
  withdrawText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
    lineHeight: 25,
  },
  transactionsSection: {
    gap: 19,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#000',
    lineHeight: 25,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#06888C',
    lineHeight: 25,
  },
  transactionsList: {
    gap: 8,
  },
  transactionCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  transactionAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  withdrawalIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#BFE3C6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
    gap: 4,
  },
  transactionName: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#000',
  },
  transactionDate: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#707070',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    textAlign: 'right',
  },
  earningAmount: {
    color: '#2CAF0B',
  },
  withdrawalAmount: {
    color: '#C70000',
  },
});
