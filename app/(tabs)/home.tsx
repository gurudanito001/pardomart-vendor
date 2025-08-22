import { AntDesign } from '@expo/vector-icons';
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

export default function HomeScreen() {
  const handleSetupStore = () => {
    // Navigate to store setup
    console.log('Setup store navigation');
  };

  const handleCardPress = (cardType: string) => {
    console.log(`Navigate to ${cardType}`);
    // Add navigation logic for each card type
  };

  const DashboardCard = ({ 
    title, 
    subtitle, 
    iconComponent, 
    onPress 
  }: {
    title: string;
    subtitle: string;
    iconComponent: React.ReactNode;
    onPress: () => void;
  }) => (
    <TouchableOpacity style={styles.dashboardCard} onPress={onPress}>
      <View style={styles.cardContent}>
        <View style={styles.cardIconContainer}>
          {iconComponent}
        </View>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{title}</Text>
          <View style={styles.cardSubtitleContainer}>
            <Text style={styles.cardSubtitle}>{subtitle}</Text>
            <View style={styles.arrowIcon}>
              <svg width="12" height="24" viewBox="0 0 12 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M10.1569 12.711L4.49994 18.368L3.08594 16.954L8.03594 12.004L3.08594 7.054L4.49994 5.64L10.1569 11.297C10.3444 11.4845 10.4497 11.7388 10.4497 12.004C10.4497 12.2692 10.3444 12.5235 10.1569 12.711Z" fill="#484C52"/>
              </svg>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const StoreIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M5.0002 4H19.0002C19.2835 4 19.5212 4.096 19.7132 4.288C19.9052 4.48 20.0009 4.71733 20.0002 5C19.9995 5.28267 19.9035 5.52033 19.7122 5.713C19.5209 5.90567 19.2835 6.00133 19.0002 6H5.0002C4.71686 6 4.47953 5.904 4.2882 5.712C4.09686 5.52 4.00086 5.28267 4.0002 5C3.99953 4.71733 4.09553 4.48 4.2882 4.288C4.48086 4.096 4.7182 4 5.0002 4ZM5.0002 20C4.71686 20 4.47953 19.904 4.2882 19.712C4.09686 19.52 4.00086 19.2827 4.0002 19V14H3.8252C3.50853 14 3.2502 13.879 3.0502 13.637C2.8502 13.395 2.78353 13.116 2.8502 12.8L3.8502 7.8C3.9002 7.56667 4.01686 7.375 4.2002 7.225C4.38353 7.075 4.59186 7 4.8252 7H19.1752C19.4085 7 19.6169 7.075 19.8002 7.225C19.9835 7.375 20.1002 7.56667 20.1502 7.8L21.1502 12.8C21.2169 13.1167 21.1502 13.3957 20.9502 13.637C20.7502 13.8783 20.4919 13.9993 20.1752 14H20.0002V19C20.0002 19.2833 19.9042 19.521 19.7122 19.713C19.5202 19.905 19.2829 20.0007 19.0002 20C18.7175 19.9993 18.4802 19.9033 18.2882 19.712C18.0962 19.5207 18.0002 19.2833 18.0002 19V14H14.0002V19C14.0002 19.2833 13.9042 19.521 13.7122 19.713C13.5202 19.905 13.2829 20.0007 13.0002 20H5.0002ZM6.0002 18H12.0002V14H6.0002V18Z" fill="black"/>
    </svg>
  );

  const OrdersIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <mask id="mask0_754_1114" style={{maskType: "luminance"}} maskUnits="userSpaceOnUse" x="2" y="2" width="20" height="20">
        <path fillRule="evenodd" clipRule="evenodd" d="M3 7.5H21L20 21H4L3 7.5Z" fill="white" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M8 9.5V3H16V9.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 17H16" stroke="black" strokeWidth="2" strokeLinecap="round"/>
      </mask>
      <g mask="url(#mask0_754_1114)">
        <path d="M0 0H24V24H0V0Z" fill="black"/>
      </g>
    </svg>
  );

  const TransactionsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <mask id="mask0_754_1130" style={{maskType: "luminance"}} maskUnits="userSpaceOnUse" x="2" y="2" width="20" height="20">
        <path d="M19.5 3H4.5C4.10218 3 3.72064 3.15804 3.43934 3.43934C3.15804 3.72064 3 4.10218 3 4.5V19.5C3 19.8978 3.15804 20.2794 3.43934 20.5607C3.72064 20.842 4.10218 21 4.5 21H19.5C19.8978 21 20.2794 20.842 20.5607 20.5607C20.842 20.2794 21 19.8978 21 19.5V4.5C21 4.10218 20.842 3.72064 20.5607 3.43934C20.2794 3.15804 19.8978 3 19.5 3Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10.5 15.5L13 17.5L17 12.5M7 7.5H17M7 11.5H11" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </mask>
      <g mask="url(#mask0_754_1130)">
        <path d="M0 0H24V24H0V0Z" fill="black"/>
      </g>
    </svg>
  );

  const ShoppersIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M11 12.5H8.25C8.1837 12.5 8.12011 12.5263 8.07322 12.5732C8.02634 12.6201 8 12.6837 8 12.75V16.5C8 16.5929 7.97414 16.6839 7.92533 16.7629C7.87651 16.8419 7.80666 16.9057 7.72361 16.9472C7.64055 16.9887 7.54758 17.0063 7.4551 16.998C7.36262 16.9896 7.27428 16.9557 7.2 16.9L6.2 16.11C6.1556 16.0803 6.1034 16.0645 6.05 16.0645C5.9966 16.0645 5.9444 16.0803 5.9 16.11L4.9 16.9C4.82572 16.9557 4.73738 16.9896 4.6449 16.998C4.55242 17.0063 4.45945 16.9887 4.37639 16.9472C4.29334 16.9057 4.22349 16.8419 4.17467 16.7629C4.12586 16.6839 4.1 16.5929 4.1 16.5V12.75C4.1 12.6837 4.07366 12.6201 4.02678 12.5732C3.97989 12.5263 3.9163 12.5 3.85 12.5H1C0.734784 12.5 0.48043 12.6054 0.292893 12.7929C0.105357 12.9804 0 13.2348 0 13.5L0 23C0 23.2652 0.105357 23.5196 0.292893 23.7071C0.48043 23.8946 0.734784 24 1 24H11C11.2652 24 11.5196 23.8946 11.7071 23.7071C11.8946 23.5196 12 23.2652 12 23V13.5C12 13.2348 11.8946 12.9804 11.7071 12.7929C11.5196 12.6054 11.2652 12.5 11 12.5Z" fill="black"/>
    </svg>
  );

  const CustomersIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M16 17V19H2V17C2 17 2 13 9 13C16 13 16 17 16 17ZM12.5 7.50001C12.5 6.80777 12.2947 6.13108 11.9101 5.55551C11.5256 4.97994 10.9789 4.53133 10.3394 4.26643C9.69985 4.00152 8.99612 3.93221 8.31718 4.06726C7.63825 4.20231 7.01461 4.53565 6.52513 5.02513C6.03564 5.51462 5.7023 6.13826 5.56725 6.81719C5.4322 7.49612 5.50152 8.19986 5.76642 8.8394C6.03133 9.47894 6.47993 10.0256 7.0555 10.4102C7.63108 10.7947 8.30777 11 9 11C9.92826 11 10.8185 10.6313 11.4749 9.97488C12.1313 9.3185 12.5 8.42826 12.5 7.50001Z" fill="black"/>
    </svg>
  );

  const WalletIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M21.0996 8.00401C21.043 8.00068 20.9826 7.99935 20.9186 8.00001H18.3936C16.3256 8.00001 14.5566 9.62801 14.5566 11.75C14.5566 13.872 16.3266 15.5 18.3936 15.5H20.9186C20.9826 15.5007 21.0433 15.4993 21.1006 15.496C21.5257 15.4704 21.9269 15.2911 22.2295 14.9916C22.5322 14.6921 22.7156 14.2928 22.7456 13.868C22.7496 13.808 22.7496 13.743 22.7496 13.683V9.81701C22.7496 9.75701 22.7496 9.69201 22.7456 9.63201C22.7156 9.20728 22.5322 8.80795 22.2295 8.50843C21.9269 8.20891 21.5247 8.02964 21.0996 8.00401Z" fill="black"/>
    </svg>
  );

  const ResourcesIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M16.5 10.25L21 12.5L12 17L3 12.5L7.5 10.25M16.5 15.25L21 17.5L12 22L3 17.5L7.5 15.25M12 3L21 7.5L12 12L3 7.5L12 3Z" stroke="black" strokeWidth="2"/>
    </svg>
  );

  const SettingsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M14.6473 4.08101C14.6741 4.19174 14.7267 4.29457 14.8007 4.38115C14.8748 4.46773 14.9682 4.53561 15.0735 4.57926C15.1787 4.62292 15.2928 4.64112 15.4064 4.63239C15.52 4.62365 15.6299 4.58823 15.7273 4.52901C18.1663 3.04401 20.9573 5.83401 19.4722 8.27301C19.413 8.37027 19.3776 8.48014 19.3688 8.59368C19.36 8.70722 19.3781 8.82123 19.4216 8.92646C19.4652 9.03168 19.533 9.12515 19.6194 9.19926C19.7059 9.27338 19.8086 9.32605 19.9193 9.35301C22.6943 10.026 22.6943 13.973 19.9193 14.647C19.8085 14.6738 19.7057 14.7264 19.6191 14.8005C19.5325 14.8745 19.4646 14.968 19.421 15.0732C19.3773 15.1785 19.3591 15.2925 19.3679 15.4061C19.3766 15.5197 19.412 15.6297 19.4713 15.727C20.9563 18.166 18.1663 20.957 15.7273 19.472C15.63 19.4128 15.5201 19.3773 15.4066 19.3685C15.293 19.3597 15.179 19.3778 15.0738 19.4214C14.9686 19.465 14.8751 19.5327 14.801 19.6192C14.7269 19.7056 14.6742 19.8084 14.6473 19.919C13.9742 22.694 10.0273 22.694 9.35325 19.919C9.32642 19.8083 9.27384 19.7054 9.19977 19.6189C9.12571 19.5323 9.03226 19.4644 8.92702 19.4207C8.82178 19.3771 8.70772 19.3589 8.59412 19.3676C8.48052 19.3764 8.37058 19.4118 8.27325 19.471C5.83425 20.956 3.04325 18.166 4.52825 15.727C4.58748 15.6297 4.62294 15.5199 4.63173 15.4063C4.64052 15.2928 4.62241 15.1788 4.57886 15.0736C4.5353 14.9683 4.46755 14.8749 4.38108 14.8007C4.29462 14.7266 4.1919 14.674 4.08125 14.647C1.30625 13.974 1.30625 10.027 4.08125 9.35301C4.19198 9.32618 4.29482 9.27359 4.3814 9.19953C4.46798 9.12546 4.53585 9.03201 4.57951 8.92677C4.62316 8.82153 4.64136 8.70747 4.63263 8.59387C4.6239 8.48027 4.58848 8.37034 4.52925 8.27301C3.04425 5.83401 5.83425 3.04301 8.27325 4.52801C8.37042 4.58769 8.48033 4.6235 8.59401 4.63252C8.70768 4.64154 8.82187 4.62351 8.92723 4.5799C9.03259 4.53629 9.12613 4.46835 9.20018 4.38163C9.27423 4.29492 9.32668 4.1919 9.35325 4.08101C10.0262 1.30601 13.9733 1.30601 14.6473 4.08101Z" fill="black"/>
    </svg>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#06888C" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.leftSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <View style={styles.avatarIcon}>
                  <svg width="40" height="41" viewBox="0 0 40 41" fill="none">
                    <circle cx="20" cy="20.9581" r="20" fill="#BFE3C6"/>
                    <path d="M30 20.9657C35.5228 20.9657 40 16.2723 40 10.4828C40 4.69332 35.5228 0 30 0C24.4772 0 20 4.69332 20 10.4828C20 16.2723 24.4772 20.9657 30 20.9657Z" fill="white"/>
                    <path d="M33.542 14.85H26.458C26.182 14.8497 25.9174 14.7346 25.7222 14.53C25.527 14.3255 25.4173 14.0481 25.417 13.7587V8.5173C25.417 8.22778 25.5266 7.95011 25.7218 7.74529C25.917 7.54047 26.1818 7.42527 26.458 7.42499H27.868L28.378 6.35574C28.4123 6.28292 28.4655 6.22169 28.5315 6.17905C28.5974 6.13642 28.6735 6.11409 28.751 6.11463H31.251C31.3284 6.11446 31.4043 6.13693 31.4702 6.17953C31.5361 6.22212 31.5894 6.28315 31.624 6.35574L32.133 7.42499H33.542C33.8182 7.42499 34.0831 7.53993 34.2784 7.74455C34.4738 7.94917 34.5837 8.22673 34.584 8.51625V13.7577C34.584 14.0474 34.4742 14.3252 34.2788 14.53C34.0834 14.7349 33.8183 14.85 33.542 14.85Z" fill="#06888C"/>
                  </svg>
                </View>
              </View>
            </View>
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>Good morning</Text>
              <View style={styles.storeInfoContainer}>
                <Text style={styles.storeInfo}>Set up Store info</Text>
                <View style={styles.dropdownIcon}>
                  <svg width="18" height="13" viewBox="0 0 18 13" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M8.28935 11.1361L2.63235 5.47906L4.04635 4.06506L8.99635 9.01506L13.9464 4.06506L15.3604 5.47906L9.70335 11.1361C9.51582 11.3235 9.26152 11.4288 8.99635 11.4288C8.73119 11.4288 8.47688 11.3235 8.28935 11.1361Z" fill="white"/>
                  </svg>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.rightSection}>
            <TouchableOpacity style={styles.iconButton}>
              <svg width="24" height="25" viewBox="0 0 24 25" fill="none">
                <path d="M8.645 20.9791C8.86103 21.701 9.30417 22.334 9.90858 22.784C10.513 23.234 11.2464 23.4771 12 23.4771C12.7536 23.4771 13.487 23.234 14.0914 22.784C14.6958 22.334 15.139 21.701 15.355 20.9791H8.645ZM3 19.9791H21V16.9791L19 13.9791V8.97906C19 8.05981 18.8189 7.14956 18.4672 6.30028C18.1154 5.451 17.5998 4.67933 16.9497 4.02932C16.2997 3.37931 15.5281 2.86369 14.6788 2.51191C13.8295 2.16013 12.9193 1.97906 12 1.97906C11.0807 1.97906 10.1705 2.16013 9.32122 2.51191C8.47194 2.86369 7.70026 3.37931 7.05025 4.02932C6.40024 4.67933 5.88463 5.451 5.53284 6.30028C5.18106 7.14956 5 8.05981 5 8.97906V13.9791L3 16.9791V19.9791Z" fill="white"/>
              </svg>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <svg width="24" height="25" viewBox="0 0 24 25" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M19.8 10.6591C19.49 7.4791 17.61 2.47908 11.8 2.47908C5.99002 2.47908 4.11001 7.4791 3.80002 10.6591C2.71252 11.0718 1.9952 12.1159 2.00002 13.2791V14.6791C2.00002 16.2255 3.25365 17.4791 4.80001 17.4791C6.34642 17.4791 7.60004 16.2255 7.60004 14.6791V13.2791C7.59498 12.141 6.90404 11.1184 5.85001 10.6891C6.05002 8.84906 7.03004 4.4791 11.8 4.4791C16.57 4.4791 17.54 8.84906 17.74 10.6891C16.6882 11.1193 16.0007 12.1426 16 13.2791V14.6791C16.0022 15.206 16.1524 15.7216 16.4335 16.1672C16.7147 16.6128 17.1154 16.9703 17.59 17.1991C17.17 17.9891 16.1 19.0591 13.47 19.3791C12.9443 18.5808 11.9272 18.2661 11.0424 18.628C10.1578 18.9899 9.65279 19.9272 9.83729 20.8651C10.0218 21.803 10.8442 22.4791 11.8 22.4791C12.1704 22.477 12.5329 22.3722 12.8472 22.1762C13.1615 21.9802 13.4152 21.7008 13.58 21.3691C17.87 20.8791 19.24 18.6691 19.67 17.3691C20.8333 16.9922 21.6157 15.9018 21.6 14.6791V13.2791C21.6048 12.1159 20.8875 11.0718 19.8 10.6591Z" fill="white"/>
              </svg>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Setup Banner */}
        <View style={styles.setupBanner}>
          <View style={styles.setupContent}>
            <View style={styles.setupIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 6V4H20V6H4ZM4 20V14H3V12L4 7H20L21 12V14H20V20H18V14H14V20H4ZM6 18H12V14H6V18ZM5.05 12H18.95L18.35 9H5.65L5.05 12Z" fill="black"/>
              </svg>
            </View>
            <Text style={styles.setupText}>Finish setting up your store</Text>
          </View>
          <TouchableOpacity onPress={handleSetupStore}>
            <AntDesign name="right" size={24} color="rgba(0,0,0,0.4)" />
          </TouchableOpacity>
        </View>

        {/* Dashboard Grid */}
        <View style={styles.dashboardGrid}>
          <View style={styles.gridRow}>
            <DashboardCard
              title="My Store"
              subtitle="Checkout your store informations now"
              iconComponent={<StoreIcon />}
              onPress={() => handleCardPress('store')}
            />
            <DashboardCard
              title="My Orders"
              subtitle="Checkout your store informations now"
              iconComponent={<OrdersIcon />}
              onPress={() => handleCardPress('orders')}
            />
          </View>
          
          <View style={styles.gridRow}>
            <DashboardCard
              title="Transactions"
              subtitle="Checkout your store informations now"
              iconComponent={<TransactionsIcon />}
              onPress={() => handleCardPress('transactions')}
            />
            <DashboardCard
              title="My Shoppers"
              subtitle="Checkout your store informations now"
              iconComponent={<ShoppersIcon />}
              onPress={() => handleCardPress('shoppers')}
            />
          </View>
          
          <View style={styles.gridRow}>
            <DashboardCard
              title="Customers"
              subtitle="Checkout your store informations now"
              iconComponent={<CustomersIcon />}
              onPress={() => handleCardPress('customers')}
            />
            <DashboardCard
              title="Earnings & Wallet"
              subtitle="Checkout your store informations now"
              iconComponent={<WalletIcon />}
              onPress={() => handleCardPress('wallet')}
            />
          </View>
          
          <View style={styles.gridRow}>
            <DashboardCard
              title="Resources"
              subtitle="Checkout your store informations now"
              iconComponent={<ResourcesIcon />}
              onPress={() => handleCardPress('resources')}
            />
            <DashboardCard
              title="My Settings"
              subtitle="Checkout your store informations now"
              iconComponent={<SettingsIcon />}
              onPress={() => handleCardPress('settings')}
            />
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
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#BFE3C6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarIcon: {
    position: 'absolute',
  },
  greetingContainer: {
    gap: 1,
  },
  greeting: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#FFF',
  },
  storeInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  storeInfo: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
  },
  dropdownIcon: {
    transform: [{ rotate: '90deg' }],
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  setupBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 24,
    marginTop: 21,
    marginBottom: 17,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DA5742',
    backgroundColor: '#FFF',
  },
  setupContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  setupIcon: {
    width: 36,
    height: 36,
    borderRadius: 32,
    backgroundColor: '#B4DBDD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  setupText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#000',
  },
  dashboardGrid: {
    paddingHorizontal: 23,
    gap: 17,
    paddingBottom: 20,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  dashboardCard: {
    flex: 1,
    height: 158,
    borderRadius: 16,
    backgroundColor: '#F0F8F8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardContent: {
    padding: 16,
    paddingBottom: 18,
    flex: 1,
    gap: 15,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(6, 136, 140, 0.30)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTextContainer: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#000',
    lineHeight: 22,
  },
  cardSubtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  cardSubtitle: {
    flex: 1,
    fontSize: 8,
    fontWeight: '400',
    fontFamily: 'Raleway',
    color: '#444',
    lineHeight: 12,
  },
  arrowIcon: {
    width: 12,
    height: 24,
  },
});
