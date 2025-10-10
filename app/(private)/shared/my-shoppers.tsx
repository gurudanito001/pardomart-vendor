import { StaffApi, User } from '@/api';
import { apiConfig } from '@/api/config';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { NotificationSVG } from '../../../components/icons';

interface StaffMember extends User {
  image?: string | null;
  isAvailable?: boolean;
}

export default function MyShoppersScreen() {
  const params = useLocalSearchParams<{ storeId?: string | string[] }>();

  const staffApi = React.useMemo(() => new StaffApi(apiConfig), []);

  const storeIdFromParam = React.useMemo(() => {
    const value = params.storeId;
    const id = Array.isArray(value) ? value[0] : value;
    return id && id !== '' ? id : undefined;
  }, [params.storeId]);

  const { data: staffMembers, isLoading, error, isFetching } = useQuery({
    queryKey: ['staff', storeIdFromParam ?? 'all'],
    queryFn: async () => {
      if (storeIdFromParam) {
        const response = await staffApi.staffStoreVendorIdGet(storeIdFromParam);
        return (response.data as unknown as StaffMember[]) || [];
      }
      const response = await staffApi.staffGet();
      return (response.data as unknown as StaffMember[]) || [];
    },
    enabled: true,
    staleTime: 60 * 1000,
  });

  const handleGoBack = () => {
    router.back();
  };

  const handleNotifications = () => {
    router.push('/(private)/shared/notifications' as any);
  };


  const handleShopperPress = (shopperId?: string) => {
    if (!shopperId) return;
    router.push(`/(private)/shared/view-shopper?shopperId=${shopperId}` as any);
  };

  const handleAddShopper = () => {
    if (!storeIdFromParam) return;
    router.push({ pathname: '/(private)/store/add-shopper', params: { storeId: storeIdFromParam } } as any);
  };

  const BackArrowIcon = () => (
    <Svg width="30" height="30" viewBox="0 0 30 30" fill="none">
      <Path
        d="M19.6278 21.993C19.8661 22.2135 20 22.5125 20 22.8243C20 23.1361 19.8661 23.4352 19.6278 23.6556C19.3895 23.8761 19.0662 24 18.7292 24C18.3921 24 18.0689 23.8761 17.8306 23.6556L9.37313 15.8313C9.25486 15.7223 9.16102 15.5927 9.09699 15.4501C9.03296 15.3074 9 15.1545 9 15C9 14.8455 9.03296 14.6926 9.09699 14.5499C9.16102 14.4073 9.25486 14.2777 9.37313 14.1687L17.8306 6.34435C18.0689 6.12387 18.3921 6 18.7292 6C19.0662 6 19.3895 6.12387 19.6278 6.34435C19.8661 6.56483 20 6.86387 20 7.17568C20 7.48749 19.8661 7.78653 19.6278 8.00702L12.07 14.999L19.6278 21.993Z"
        fill="white"
      />
    </Svg>
  );

  const ChevronRightIcon = () => (
    <Svg width="7" height="13" viewBox="0 0 7 13" fill="none">
      <Path
        d="M0.866949 12.4985C0.66474 12.4988 0.468777 12.4292 0.313076 12.3017C0.225444 12.2299 0.153007 12.1418 0.0999113 12.0423C0.0468157 11.9428 0.0141058 11.8339 0.00365506 11.7219C-0.0067957 11.6098 0.00521815 11.4969 0.0390082 11.3895C0.0727983 11.2821 0.1277 11.1823 0.200571 11.0958L4.07768 6.51173L0.339039 1.91906C0.267152 1.83158 0.213468 1.73092 0.181074 1.62286C0.148679 1.51481 0.138213 1.4015 0.150276 1.28944C0.16234 1.17738 0.196694 1.06878 0.251367 0.969879C0.306039 0.870982 0.379951 0.783737 0.468853 0.713159C0.558395 0.635301 0.663255 0.576573 0.776853 0.540662C0.89045 0.504751 1.01033 0.492432 1.12898 0.504478C1.24762 0.516525 1.36246 0.552676 1.4663 0.610663C1.57014 0.66865 1.66072 0.747221 1.73237 0.841446L5.91238 5.97292C6.03967 6.12596 6.10925 6.31791 6.10925 6.51601C6.10925 6.7141 6.03967 6.90606 5.91238 7.05909L1.58525 12.1906C1.49843 12.2941 1.38815 12.3759 1.26335 12.4294C1.13854 12.4829 1.00274 12.5065 0.866949 12.4985Z"
        fill="#333333"
      />
    </Svg>
  );

  const ShopperCard = ({ shopper }: { shopper: StaffMember }) => {
    const isAvailable = shopper.isAvailable ?? shopper.active ?? false;
    
    return (
      <TouchableOpacity
        style={styles.shopperCard}
        onPress={() => handleShopperPress(shopper?.id)}
      >
        <View style={styles.shopperContent}>
          <Image
            source={
              shopper.image
                ? { uri: shopper.image }
                : require('../../../assets/images/user profile.png')
            }
            style={styles.shopperAvatar}
          />
          <View style={styles.shopperInfo}>
            <View style={styles.shopperDetails}>
              <Text style={styles.shopperName}>{shopper.name || 'Unknown'}</Text>
              <View
                style={[
                  styles.statusBadge,
                  isAvailable ? styles.availableBadge : styles.unavailableBadge,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    isAvailable ? styles.availableText : styles.unavailableText,
                  ]}
                >
                  {isAvailable ? 'Available' : 'Not available'}
                </Text>
              </View>
            </View>
            <ChevronRightIcon />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    if (isLoading || isFetching) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#06888C" />
          <Text style={styles.loadingText}>Loading shoppers...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Failed to load shoppers</Text>
          <Text style={styles.errorSubtext}>{(error as Error).message}</Text>
        </View>
      );
    }

    if (!staffMembers || staffMembers.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No shoppers yet</Text>
          <Text style={styles.emptySubtext}>Add your first shopper to get started</Text>
        </View>
      );
    }

    return (
      <>
        <Text style={styles.shoppersCount}>
          You have {staffMembers.length} shopper{staffMembers.length !== 1 ? 's' : ''}
        </Text>

        <View style={styles.shoppersList}>
          {staffMembers.map((shopper) => (
            <ShopperCard key={shopper.id} shopper={shopper} />
          ))}
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#06888C" />

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.leftSection}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <BackArrowIcon />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Shoppers</Text>
          </View>
          <View style={styles.rightSection}>
            <TouchableOpacity style={styles.iconButton} onPress={handleNotifications}>
              <NotificationSVG width={24} height={24} color="white" />
            </TouchableOpacity>
            {/* Support icon removed from header (kept only on Help page) */}
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {renderContent()}

          {storeIdFromParam ? (
            <TouchableOpacity style={styles.addShopperButton} onPress={handleAddShopper}>
              <Text style={styles.addShopperText}>Add Shopper</Text>
            </TouchableOpacity>
          ) : null}
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
    paddingHorizontal: 21,
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
    paddingHorizontal: 21,
    paddingTop: 17,
    paddingBottom: 30,
  },
  shoppersCount: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Raleway',
    color: '#000',
    marginBottom: 20,
  },
  shoppersList: {
    gap: 10,
    marginBottom: 48,
  },
  shopperCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  shopperContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  shopperAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  shopperInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shopperDetails: {
    flex: 1,
    gap: 3,
  },
  shopperName: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#000',
    lineHeight: 19,
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  availableBadge: {
    backgroundColor: 'rgba(44, 175, 11, 0.15)',
  },
  unavailableBadge: {
    backgroundColor: 'rgba(137, 138, 141, 0.15)',
  },
  statusText: {
    fontSize: 8,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  availableText: {
    color: '#2CAF0B',
  },
  unavailableText: {
    color: '#898A8D',
  },
  addShopperButton: {
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#06888C',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 9,
    elevation: 3,
  },
  addShopperText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
    lineHeight: 25,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Raleway',
    color: '#06888C',
    marginTop: 12,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#E94435',
  },
  errorSubtext: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#7C8BA0',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#000',
  },
  emptySubtext: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#7C8BA0',
    textAlign: 'center',
  },
});
