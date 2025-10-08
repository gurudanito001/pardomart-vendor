import { MaterialIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Path, Svg } from 'react-native-svg';
import { CustomersSVG } from '../../../components/icons';
import { SettingsSVG } from '../../../components/icons/SettingsSVG';
import { useVendor } from '../../../hooks/api/useVendors';

export default function SettingUpStoreScreen() {
  const { storeId } = useLocalSearchParams<{ storeId: string }>();
  const { getVendorById } = useVendor();

  const { data: vendor, isLoading, isError } = useQuery({
    queryKey: ['vendor', storeId],
    queryFn: () => getVendorById(storeId!),
    enabled: !!storeId,
  });

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

  const ActionItem = ({
    icon,
    title,
    onPress,
  }: {
    icon: React.ReactNode;
    title: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress}>
      <View style={styles.actionContent}>
        <View style={styles.actionIconContainer}>{icon}</View>
        <Text style={styles.actionTitle}>{title}</Text>
      </View>
      <View style={styles.actionArrow}>
        <Svg width="9" height="16" viewBox="0 0 9 16" fill="none">
          <Path
            d="M6.3247 7.99999L0 1.88297L0.973452 0.941483L8.2716 7.99999L0.973452 15.0585L0 14.117L6.3247 7.99999Z"
            fill="rgba(0,0,0,0.4)"
          />
        </Svg>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#06888C" />
        <Text style={styles.loadingText}>Loading Store...</Text>
      </SafeAreaView>
    );
  }

  const actions = [
    {
      key: 'store-profile',
      title: 'Store Profile',
      priority: 1,
      icon: (
        <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
          <Path
            d="M4.58359 3.66667H17.4169C17.6767 3.66667 17.8945 3.75467 18.0705 3.93067C18.2465 4.10667 18.3342 4.32423 18.3336 4.58334C18.333 4.84245 18.245 5.06031 18.0696 5.23692C17.8942 5.41353 17.6767 5.50123 17.4169 5.50001H4.58359C4.32387 5.50001 4.10632 5.412 3.93093 5.236C3.75554 5.06 3.66754 4.84245 3.66693 4.58334C3.66632 4.32423 3.75432 4.10667 3.93093 3.93067C4.10754 3.75467 4.32509 3.66667 4.58359 3.66667ZM4.58359 18.3333C4.32387 18.3333 4.10632 18.2453 3.93093 18.0693C3.75554 17.8933 3.66754 17.6758 3.66693 17.4167V12.8333H3.50651C3.21623 12.8333 2.97943 12.7224 2.79609 12.5006C2.61276 12.2788 2.55165 12.023 2.61276 11.7333L3.52943 7.15001C3.57526 6.93612 3.6822 6.76042 3.85026 6.62292C4.01832 6.48542 4.20929 6.41667 4.42318 6.41667H17.5773C17.7912 6.41667 17.9822 6.48542 18.1503 6.62292C18.3183 6.76042 18.4253 6.93612 18.4711 7.15001L19.3878 11.7333C19.4489 12.0236 19.3878 12.2794 19.2044 12.5006C19.0211 12.7218 18.7843 12.8327 18.494 12.8333H18.3336V17.4167C18.3336 17.6764 18.2456 17.8943 18.0696 18.0703C17.8936 18.2463 17.676 18.3339 17.4169 18.3333C17.1578 18.3327 16.9403 18.2447 16.7643 18.0693C16.5883 17.8939 16.5003 17.6764 16.5003 17.4167V12.8333H12.8336V17.4167C12.8336 17.6764 12.7456 17.8943 12.5696 18.0703C12.3936 18.2463 12.176 18.3339 11.9169 18.3333H4.58359ZM5.50026 16.5H11.0003V12.8333H5.50026V16.5Z"
            fill="black"
          />
        </Svg>
      ),
    },
    {
      key: 'store-documents',
      title: 'Store Documents',
      priority: 2,
      icon: (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" fill="black" />
        </Svg>
      ),
    },
    {
      key: 'store-products',
      title: 'Store Products',
      priority: 3,
      icon: (
        <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
          <Path d="M18.3333 5.5H3.66667V4.58333C3.66667 4.08667 4.08667 3.66667 4.58333 3.66667H17.4167C17.9133 3.66667 18.3333 4.08667 18.3333 4.58333V5.5ZM19.25 7.33333L18.3333 17.4167C18.3333 17.9133 17.9133 18.3333 17.4167 18.3333H4.58333C4.08667 18.3333 3.66667 17.9133 3.66667 17.4167L2.75 7.33333H19.25ZM11 10.0833C11 9.58667 10.58 9.16667 10.0833 9.16667C9.58667 9.16667 9.16667 9.58667 9.16667 10.0833V14.6667C9.16667 15.1633 9.58667 15.5833 10.0833 15.5833C10.58 15.5833 11 15.1633 11 14.6667V10.0833ZM14.6667 10.0833C14.6667 9.58667 14.2467 9.16667 13.75 9.16667C13.2533 9.16667 12.8333 9.58667 12.8333 10.0833V14.6667C12.8333 15.1633 13.2533 15.5833 13.75 15.5833C14.2467 15.5833 14.6667 15.1633 14.6667 14.6667V10.0833ZM7.33333 10.0833C7.33333 9.58667 6.91333 9.16667 6.41667 9.16667C5.92 9.16667 5.5 9.58667 5.5 10.0833V14.6667C5.5 15.1633 5.92 15.5833 6.41667 15.5833C6.91333 15.5833 7.33333 15.1633 7.33333 14.6667V10.0833Z" fill="black" />
        </Svg>
      ),
    },
    {
      key: 'store-shoppers',
      title: 'Store Shoppers',
      priority: 4,
      icon: <MaterialIcons name="shopping-cart" size={20} color="black" />,
    },
    {
      key: 'store-customers',
      title: 'Store Customers',
      priority: 5,
      icon: <CustomersSVG width={22} height={22} color="black" />,
    },
    {
      key: 'store-settings',
      title: 'Store Settings',
      priority: 6,
      icon: <SettingsSVG width={22} height={22} color="black" />,
    },
  ] as const;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#06888C" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.leftSection}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Svg width="31" height="30" viewBox="0 0 31 30" fill="none">
                <Path
                  d="M20.1278 21.993C20.3661 22.2135 20.5 22.5125 20.5 22.8243C20.5 23.1361 20.3661 23.4352 20.1278 23.6556C19.8895 23.8761 19.5662 24 19.2292 24C18.8921 24 18.5689 23.8761 18.3306 23.6556L9.87313 15.8313C9.75486 15.7223 9.66102 15.5927 9.59699 15.4501C9.53296 15.3074 9.5 15.1545 9.5 15C9.5 14.8455 9.53296 14.6926 9.59699 14.5499C9.66102 14.4073 9.75486 14.2777 9.87313 14.1687L18.3306 6.34435C18.5689 6.12387 18.8921 6 19.2292 6C19.5662 6 19.8895 6.12387 20.1278 6.34435C20.3661 6.56483 20.5 6.86387 20.5 7.17568C20.5 7.48749 20.3661 7.78653 20.1278 8.00702L12.57 14.999L20.1278 21.993Z"
                  fill="white"
                />
              </Svg>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{vendor?.name || 'My Store'}</Text>
          </View>
          <View style={styles.rightSection}>
            <TouchableOpacity style={styles.iconButton}>
              <Svg width="25" height="24" viewBox="0 0 25 24" fill="none">
                <Path
                  d="M9.145 20.5C9.36103 21.2219 9.80417 21.8549 10.4086 22.3049C11.013 22.755 11.7464 22.998 12.5 22.998C13.2536 22.998 13.987 22.755 14.5914 22.3049C15.1958 21.8549 15.639 21.2219 15.855 20.5H9.145ZM3.5 19.5H21.5V16.5L19.5 13.5V8.5C19.5 7.58075 19.3189 6.6705 18.9672 5.82122C18.6154 4.97194 18.0998 4.20026 17.4497 3.55025C16.7997 2.90024 16.0281 2.38463 15.1788 2.03284C14.3295 1.68106 13.4193 1.5 12.5 1.5C11.5807 1.5 10.6705 1.68106 9.82122 2.03284C8.97194 2.38463 8.20026 2.90024 7.55025 3.55025C6.90024 4.20026 6.38463 4.97194 6.03284 5.82122C5.68106 6.6705 5.5 7.58075 5.5 8.5V13.5L3.5 16.5V19.5Z"
                  fill="white"
                />
              </Svg>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Svg width="25" height="24" viewBox="0 0 25 24" fill="none">
                <Path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20.3 10.18C19.99 7.00003 18.11 2.00002 12.3 2.00002C6.49002 2.00002 4.61001 7.00003 4.30002 10.18C3.21252 10.5928 2.4952 11.6369 2.50002 12.8V14.2C2.50002 15.7464 3.75365 17 5.30001 17C6.84642 17 8.10004 15.7464 8.10004 14.2V12.8C8.09498 11.6619 7.40404 10.6393 6.35001 10.21C6.55002 8.37 7.53004 4.00003 12.3 4.00003C17.07 4.00003 18.04 8.37 18.24 10.21C17.1882 10.6403 16.5007 11.6636 16.5 12.8V14.2C16.5022 14.7269 16.6524 15.2425 16.9335 15.6881C17.2147 16.1337 17.6154 16.4913 18.09 16.72C17.67 17.51 16.6 18.58 13.97 18.9C13.4443 18.1017 12.4272 17.787 11.5424 18.1489C10.6578 18.5108 10.1528 19.4482 10.3373 20.386C10.5218 21.3239 11.3442 22 12.3 22C12.6704 21.998 13.0329 21.8931 13.3472 21.6971C13.6615 21.5011 13.9152 21.2217 14.08 20.89C18.37 20.4 19.74 18.19 20.17 16.89C21.3333 16.5132 22.1157 15.4228 22.1 14.2V12.8C22.1048 11.6369 21.3875 10.5928 20.3 10.18Z"
                  fill="white"
                />
              </Svg>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Page Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Set up your store</Text>
          <Text style={styles.subtitle}>Provide all the information of your stores here</Text>
        </View>

        {/* Store Profile Picture Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {vendor?.image ? (
              <Image source={{ uri: vendor.image }} style={styles.profileImage} />
            ) : (
              <Svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                <Path d="M45.8333 8.33333H4.16667C3.24583 8.33333 2.5 9.07917 2.5 10V40C2.5 40.9208 3.24583 41.6667 4.16667 41.6667H45.8333C46.7542 41.6667 47.5 40.9208 47.5 40V10C47.5 9.07917 46.7542 8.33333 45.8333 8.33333ZM18.75 27.0833L14.5833 32.2917H35.4167L29.1667 23.9583L25 29.1667L18.75 27.0833Z" fill="#06888C" />
              </Svg>
            )}
          </View>
          <Text style={styles.profileImageText}>Store Profile picture</Text>
        </View>

        {/* Action Items */}
        <View style={styles.actionsContainer}>
          {actions
            .slice()
            .sort((a, b) => a.priority - b.priority)
            .map((item) => (
              <ActionItem key={item.key} icon={item.icon} title={item.title} onPress={() => handleAction(item.key)} />
            ))}
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
    backgroundColor: '#06888C',
    paddingTop: 19,
    paddingBottom: 19,
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
    gap: 12,
  },
  backButton: {
    padding: 4,
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
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  titleSection: {
    paddingHorizontal: 30,
    paddingTop: 19,
    paddingBottom: 30,
    gap: 7,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#000',
    lineHeight: 16,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#484C52',
    lineHeight: 12,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 30,
    gap: 14,
  },
  profileImageContainer: {
    width: 85,
    height: 85,
    borderRadius: 16,
    backgroundColor: '#FFEBF0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  profileImageText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#000',
    textAlign: 'center',
  },
  actionsContainer: {
    paddingHorizontal: 21,
    paddingBottom: 30,
    gap: 14,
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#AAD7D8',
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 13,
    height: 56,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  actionIconContainer: {
    width: 35,
    height: 34,
    backgroundColor: '#FFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#000',
  },
  actionArrow: {
    width: 8.272,
    height: 14.117,
  },
});
