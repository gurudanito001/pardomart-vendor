import { router } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowBackButtonSVG,
  ArrowBackSVG,
  NotificationSVG,
  SupportSVG
} from '../../../components/icons';
// Removed legacy types import

type StoreItem = { id: string; name: string; address: string; logo: string };

const MOCK_STORES: StoreItem[] = [
  {
    id: '1',
    name: 'Jewel Osco',
    address: 'wallgreaan lane 1234 Wesbromich, New York, 06675',
    logo: 'https://api.builder.io/api/v1/image/assets/TEMP/9d36f317a6f8107bd18c045ccb4b42f2bad7ba6f?width=120',
  },
  {
    id: '2', 
    name: 'Jewel Osco',
    address: 'lane 1234 Wesbromich, Southside',
    logo: 'https://api.builder.io/api/v1/image/assets/TEMP/9d36f317a6f8107bd18c045ccb4b42f2bad7ba6f?width=120',
  },
  {
    id: '3',
    name: 'Jewel Osco',
    address: 'Wesbromich, New York, 06675\n454miles',
    logo: 'https://api.builder.io/api/v1/image/assets/TEMP/9d36f317a6f8107bd18c045ccb4b42f2bad7ba6f?width=120',
  },
  {
    id: '4',
    name: 'Jewel Osco',
    address: 'southsid3e wlassgreenn newyork 6654',
    logo: 'https://api.builder.io/api/v1/image/assets/TEMP/9d36f317a6f8107bd18c045ccb4b42f2bad7ba6f?width=120',
  },
];

export default function MyStoresScreen() {
  const handleGoBack = () => {
    router.back();
  };

  const handleNotifications = () => {
    console.log('Open notifications');
  };

  const handleSupport = () => {
    console.log('Open support');
  };

  const handleStoreSelect = (storeId: string) => {
    router.push(`/(private)/store/select-category?storeId=${storeId}`);
  };

  const StoreCard = ({ store }: { store: StoreItem }) => (
    <TouchableOpacity 
      style={styles.storeCard} 
      onPress={() => handleStoreSelect(store.id)}
    >
      <View style={styles.storeContent}>
        <View style={styles.logoContainer}>
          <Image source={{ uri: store.logo }} style={styles.storeLogo} />
        </View>
        <View style={styles.storeInfo}>
          <Text style={styles.storeName}>{store.name}</Text>
          <Text style={styles.storeAddress}>{store.address}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#06888C" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowBackSVG width={30} height={30} color="white" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>My Stores</Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleNotifications} style={styles.headerAction}>
            <NotificationSVG width={24} height={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleSupport} style={styles.headerAction}>
            <SupportSVG width={24} height={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={styles.subtitle}>Select the store you wish to add product</Text>
          
          {/* Stores Grid */}
          <View style={styles.storesGrid}>
            <View style={styles.storeRow}>
              <StoreCard store={MOCK_STORES[0]} />
              <StoreCard store={MOCK_STORES[1]} />
            </View>
            <View style={styles.storeRow}>
              <StoreCard store={MOCK_STORES[2]} />
              <StoreCard store={MOCK_STORES[3]} />
            </View>
          </View>
        </View>

        {/* Go Back Button */}
        <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
          <ArrowBackButtonSVG width={24} height={24} color="white" />
          <Text style={styles.goBackText}>Go back</Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 21,
    paddingTop: 19,
    paddingBottom: 19,
    backgroundColor: '#06888C',
    minHeight: 130,
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
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Raleway',
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
  content: {
    flex: 1,
    paddingHorizontal: 21,
  },
  mainContent: {
    paddingTop: 20,
    marginBottom: 228,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#000',
    lineHeight: 19,
    marginBottom: 31,
  },
  storesGrid: {
    gap: 26,
  },
  storeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 19,
  },
  storeCard: {
    flex: 1,
    maxWidth: 185,
    padding: 25,
    paddingHorizontal: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#06888C',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.10,
    shadowRadius: 5,
    elevation: 3,
  },
  storeContent: {
    alignItems: 'center',
    gap: 19,
  },
  logoContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(6, 136, 140, 0.20)',
    backgroundColor: '#FFEBF0',
  },
  storeLogo: {
    width: 60,
    height: 60,
  },
  storeInfo: {
    alignItems: 'center',
    gap: 5,
    width: '100%',
  },
  storeName: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#000',
    textAlign: 'center',
    lineHeight: 16,
  },
  storeAddress: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#484C52',
    textAlign: 'center',
    lineHeight: 14,
  },
  goBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 120,
    borderRadius: 16,
    backgroundColor: '#06888C',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 9,
    elevation: 2,
  },
  goBackText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
    lineHeight: 25,
  },
});
