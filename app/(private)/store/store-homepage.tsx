import { MaterialIcons } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Path, Svg } from 'react-native-svg';
import { CustomersSVG } from '../../../components/icons';
import { useVendor } from '../../../hooks/api/useVendors'; // Assuming SettingsSVG is here

export default function StoreHomepageScreen() {
  const { storeId } = useLocalSearchParams<{ storeId: string }>();
  const { getVendorById } = useVendor();

  const { data: vendor, isLoading, isError } = useQuery({
    queryKey: ['vendor', storeId],
    queryFn: () => getVendorById(storeId!),
    enabled: !!storeId,
  });

  const [isScrolled, setIsScrolled] = React.useState(false);
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const handleScroll = (event: any) => {
    const y = event?.nativeEvent?.contentOffset?.y;
    setIsScrolled(typeof y === 'number' && y > 130);
  };

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['vendor', storeId] });
  };

  const handleBack = () => {
    router.back();
  };
  const handleAction = (actionType: string) => {
    switch (actionType) {
      case 'store-profile':
        router.push(`/(private)/store/edit-store?storeId=${storeId}`);
        break;
      case 'store-products':
        router.push(`/(private)/store/store-products?storeId=${storeId}` as any);
        break;
      case 'store-documents':
        router.push(`/(private)/store/upload-documents?storeId=${storeId}` as any);
        break;
      case 'store-settings':
        // Navigate to settings screen
        break;
      case 'store-shoppers':
        router.push(`/(private)/shared/my-shoppers?storeId=${storeId}` as any);
        break;
      case 'store-customers':
        router.push(`/(private)/shared/customers?storeId=${storeId}` as any);
        break;
      default:
        break;
    }
  };

  const MenuItem = ({
    icon,
    title,
    onPress,
  }: {
    icon: React.ReactNode;
    title: string;
    onPress: () => void;
  }) => (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        {icon}
        <Text style={styles.menuItemText}>{title}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#000" />
    </Pressable>
  );

  const MenuSection = ({
    children,
    style,
  }: {
    children: React.ReactNode;
    style?: any;
  }) => (
    <View style={[styles.menuSection, style]}>{children}</View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#06888C" />
        <Text style={styles.loadingText}>Loading Store...</Text>
      </SafeAreaView>
    );
  }

  const managementActions = [
    {
      key: 'store-profile',
      title: 'Store Profile',
      onPress: () => handleAction('store-profile'),
      icon: <MaterialIcons name="storefront" size={24} color="black" />,
    },
    {
      key: 'store-documents',
      title: 'Store Documents',
      onPress: () => handleAction('store-documents'),
      icon: <MaterialIcons name="description" size={24} color="black" />,
    },
    {
      key: 'store-products',
      title: 'Store Products',
      onPress: () => handleAction('store-products'),
      icon: <MaterialIcons name="inventory-2" size={24} color="black" />,
    },
  ] as const;

  const financeActions = [
    {
      key: 'store-earnings',
      title: 'Store Earnings',
      onPress: () => handleAction('store-earnings'),
      icon: <MaterialIcons name="account-balance-wallet" size={24} color="black" />,
    },
    {
      key: 'store-transactions',
      title: 'Store Transactions',
      onPress: () => handleAction('store-transactions'),
      icon: <MaterialIcons name="paid" size={24} color="black" />,
    },
  ] as const;

  const communityActions = [
    {
      key: 'store-orders',
      title: 'Store Orders',
      onPress: () => handleAction('store-orders'),
      icon: <MaterialIcons name="receipt-long" size={24} color="black" />,
    },
    {
      key: 'store-shoppers',
      title: 'Store Shoppers',
      onPress: () => handleAction('store-shoppers'),
      icon: <MaterialIcons name="shopping-cart" size={24} color="black" />,
    },
    {
      key: 'store-customers',
      title: 'Store Customers',
      onPress: () => handleAction('store-customers'),
      icon: <CustomersSVG width={24} height={24} color="black" />,
    },
  ] as const;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View
        style={[styles.header, isScrolled && styles.scrolledHeader, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerContent}>
          <View style={styles.leftSection}>
            <Pressable style={styles.backButton} onPress={handleBack}>
              <MaterialIcons name="chevron-left" size={24} color="#100A37" />
            </Pressable>
            <Text style={styles.headerTitle}>Store Dashboard</Text>
          </View>
          <View style={styles.rightSection}>
            <TouchableOpacity style={styles.iconButton}>
              <Svg width="25" height="24" viewBox="0 0 25 24" fill="none">
                <Path
                  d="M9.145 20.5C9.36103 21.2219 9.80417 21.8549 10.4086 22.3049C11.013 22.755 11.7464 22.998 12.5 22.998C13.2536 22.998 13.987 22.755 14.5914 22.3049C15.1958 21.8549 15.639 21.2219 15.855 20.5H9.145ZM3.5 19.5H21.5V16.5L19.5 13.5V8.5C19.5 7.58075 19.3189 6.6705 18.9672 5.82122C18.6154 4.97194 18.0998 4.20026 17.4497 3.55025C16.7997 2.90024 16.0281 2.38463 15.1788 2.03284C14.3295 1.68106 13.4193 1.5 12.5 1.5C11.5807 1.5 10.6705 1.68106 9.82122 2.03284C8.97194 2.38463 8.20026 2.90024 7.55025 3.55025C6.90024 4.20026 6.38463 4.97194 6.03284 5.82122C5.68106 6.6705 5.5 7.58075 5.5 8.5V13.5L3.5 16.5V19.5Z"
                  fill={isScrolled ? '#000' : '#FFF'}
                />
              </Svg>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Svg width="25" height="24" viewBox="0 0 25 24" fill="none">
                <Path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20.3 10.18C19.99 7.00003 18.11 2.00002 12.3 2.00002C6.49002 2.00002 4.61001 7.00003 4.30002 10.18C3.21252 10.5928 2.4952 11.6369 2.50002 12.8V14.2C2.50002 15.7464 3.75365 17 5.30001 17C6.84642 17 8.10004 15.7464 8.10004 14.2V12.8C8.09498 11.6619 7.40404 10.6393 6.35001 10.21C6.55002 8.37 7.53004 4.00003 12.3 4.00003C17.07 4.00003 18.04 8.37 18.24 10.21C17.1882 10.6403 16.5007 11.6636 16.5 12.8V14.2C16.5022 14.7269 16.6524 15.2425 16.9335 15.6881C17.2147 16.1337 17.6154 16.4913 18.09 16.72C17.67 17.51 16.6 18.58 13.97 18.9C13.4443 18.1017 12.4272 17.787 11.5424 18.1489C10.6578 18.5108 10.1528 19.4482 10.3373 20.386C10.5218 21.3239 11.3442 22 12.3 22C12.6704 21.998 13.0329 21.8931 13.3472 21.6971C13.6615 21.5011 13.9152 21.2217 14.08 20.89C18.37 20.4 19.74 18.19 20.17 16.89C21.3333 16.5132 22.1157 15.4228 22.1 14.2V12.8C22.1048 11.6369 21.3875 10.5928 20.3 10.18Z"
                  fill={isScrolled ? '#000' : '#FFF'}
                />
              </Svg>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} tintColor="#06888C" />}>
        {/* Store Profile Picture Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileBackground} />
          <View style={styles.profileContent}>
            <View style={styles.profileImageContainer}>
              {vendor?.image ? (
                <Image source={{ uri: vendor.image }} style={styles.profileImage} />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                    <Path
                      d="M45.8333 8.33333H4.16667C3.24583 8.33333 2.5 9.07917 2.5 10V40C2.5 40.9208 3.24583 41.6667 4.16667 41.6667H45.8333C46.7542 41.6667 47.5 40.9208 47.5 40V10C47.5 9.07917 46.7542 8.33333 45.8333 8.33333ZM18.75 27.0833L14.5833 32.2917H35.4167L29.1667 23.9583L25 29.1667L18.75 27.0833Z"
                      fill="#06888C"
                    />
                  </Svg>
                </View>
              )}
            </View>
            <Text style={styles.profileName}>{vendor?.name}</Text>
          </View>
        </View>

        {/* Action Items */}
        <MenuSection>
          {managementActions.map((item) => (
            <MenuItem key={item.key} icon={item.icon} title={item.title} onPress={item.onPress} />
          ))}
        </MenuSection>

        <MenuSection>
          {financeActions.map((item) => (
            <MenuItem key={item.key} icon={item.icon} title={item.title} onPress={item.onPress} />
          ))}
        </MenuSection>

        <MenuSection>
          {communityActions.map((item) => (
            <MenuItem key={item.key} icon={item.icon} title={item.title} onPress={item.onPress} />
          ))}
        </MenuSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Raleway',
    color: '#484C52',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 21,
    width: '100%',
    backgroundColor: 'transparent',
    paddingBottom: 5,
    position: 'absolute',
    top: 0,
    zIndex: 10,
  },
  scrolledHeader: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
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
    fontFamily: 'Raleway-Bold',
    color: '#000',
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
  scrollContent: {
    paddingBottom: 100,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileBackground: {
    backgroundColor: '#06888C',
    width: '100%',
    height: 160,
    position: 'absolute',
    top: 0,
  },
  profileContent: {
    alignItems: 'center',
    paddingTop: 104,
    width: '100%',
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 16,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFEBF0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'Raleway-Bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 4,
  },
  menuSection: {
    marginHorizontal: 21,
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: '#F0F8F8',
    padding: 10,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 10,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Raleway-SemiBold',
    color: '#000',
  },
});
