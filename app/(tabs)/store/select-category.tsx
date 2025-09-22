import { router, useLocalSearchParams } from 'expo-router';
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
import {
    ArrowBackButtonSVG,
    ArrowBackSVG,
    NotificationSVG,
    SupportSVG
} from '../../../components/icons';
import { Category, Store } from '../../../types';

const MOCK_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Snacks',
    icon: 'https://api.builder.io/api/v1/image/assets/TEMP/760df9d3a95446e3dc74875216ae45aebd47d4d9?width=86',
  },
  {
    id: '2',
    name: 'Bakery',
    icon: 'https://api.builder.io/api/v1/image/assets/TEMP/71dd5c4442219f7aa38482d06dbcd17c5b6edeb4?width=84',
  },
  {
    id: '3',
    name: 'Meat & Seafood',
    icon: 'https://api.builder.io/api/v1/image/assets/TEMP/3b32b74605ed0c5b366f89d69c100cc9b800b8a9?width=62',
  },
  {
    id: '4',
    name: 'Frozen Food',
    icon: 'https://api.builder.io/api/v1/image/assets/TEMP/7df09b52f95f61461b7a1120d68a3c4b787b75e0?width=74',
  },
  {
    id: '5',
    name: 'Diary & Egg',
    icon: 'https://api.builder.io/api/v1/image/assets/TEMP/540acbd6d0d0c67fc16eae4077d28be533648c6e?width=80',
  },
  {
    id: '6',
    name: 'Beverages',
    icon: 'https://api.builder.io/api/v1/image/assets/TEMP/f1446e8c06d18a37bc76099eb2ddde8a2bbf1b86?width=80',
  },
  {
    id: '7',
    name: 'Pantry Staples',
    icon: 'https://api.builder.io/api/v1/image/assets/TEMP/762fedf190718928d8369a6c8e20736398a679f4?width=86',
  },
  {
    id: '8',
    name: 'Personal Care',
    icon: 'https://api.builder.io/api/v1/image/assets/TEMP/2b4a79a2ac2219c17db4355ca35213cb475e9d87?width=72',
  },
  {
    id: '9',
    name: 'Household Materials',
    icon: 'https://api.builder.io/api/v1/image/assets/TEMP/5c9c507441802ccfe4f1ef186f371448df28bc5c?width=76',
  },
  {
    id: '10',
    name: 'Fresh Produce',
    icon: 'https://api.builder.io/api/v1/image/assets/TEMP/3e7759e8997e37fe13fd195070623ac0977bcd76?width=78',
  },
];

export default function SelectCategoryScreen() {
  const params = useLocalSearchParams();
  const storeId = params.storeId as string;

  // Mock store data mapping - in a real app, you'd fetch this based on storeId
  const storeDataMap: Record<string, Store> = {
    '1': {
      id: '1',
      name: 'Jewel Osco',
      address: 'wallgreaan lane 1234 Wesbromich, New York, 06675',
      logo: 'https://api.builder.io/api/v1/image/assets/TEMP/9d36f317a6f8107bd18c045ccb4b42f2bad7ba6f?width=120',
    },
    '2': {
      id: '2',
      name: 'Jewel Osco',
      address: 'lane 1234 Wesbromich, Southside',
      logo: 'https://api.builder.io/api/v1/image/assets/TEMP/9d36f317a6f8107bd18c045ccb4b42f2bad7ba6f?width=120',
    },
    '3': {
      id: '3',
      name: 'Jewel Osco',
      address: 'Wesbromich, New York, 06675\n454miles',
      logo: 'https://api.builder.io/api/v1/image/assets/TEMP/9d36f317a6f8107bd18c045ccb4b42f2bad7ba6f?width=120',
    },
    '4': {
      id: '4',
      name: 'Jewel Osco',
      address: 'southsid3e wlassgreenn newyork 6654',
      logo: 'https://api.builder.io/api/v1/image/assets/TEMP/9d36f317a6f8107bd18c045ccb4b42f2bad7ba6f?width=120',
    },
  };

  const selectedStore: Store = storeDataMap[storeId] || storeDataMap['1'];

  const handleGoBack = () => {
    router.back();
  };

  const handleNotifications = () => {
    console.log('Open notifications');
  };

  const handleSupport = () => {
    console.log('Open support');
  };

  const handleCategorySelect = (categoryId: string) => {
    console.log('Selected category:', categoryId);
    // Navigate to unpublished store page
    router.push('/(tabs)/store/unpublished-store');
  };

  const CategoryItem = ({ category }: { category: Category }) => (
    <TouchableOpacity 
      style={styles.categoryItem} 
      onPress={() => handleCategorySelect(category.id)}
    >
      <View style={styles.categoryIconContainer}>
        <Image source={{ uri: category.icon }} style={styles.categoryIcon} />
      </View>
      <Text style={[
        styles.categoryLabel,
        category.name === 'Household Materials' ? styles.householdLabel : null
      ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#06888C" />
      
      {/* Header with Store Info */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <ArrowBackSVG width={30} height={30} color="white" />
          </TouchableOpacity>
          
          <View style={styles.storeInfo}>
            <View style={styles.storeLogoContainer}>
              <Image source={{ uri: selectedStore.logo }} style={styles.storeLogo} />
            </View>
            <View style={styles.storeDetails}>
              <Text style={styles.storeName}>{selectedStore.name}</Text>
              <Text style={styles.storeAddress}>{selectedStore.address}</Text>
            </View>
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
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Select Category Section */}
        <View style={styles.mainContent}>
          <Text style={styles.sectionTitle}>Select Category</Text>
          
          {/* Categories Grid */}
          <View style={styles.categoriesGrid}>
            <View style={styles.categoryRow}>
              {MOCK_CATEGORIES.slice(0, 5).map((category) => (
                <CategoryItem key={category.id} category={category} />
              ))}
            </View>
            <View style={styles.categoryRow}>
              {MOCK_CATEGORIES.slice(5, 10).map((category) => (
                <CategoryItem key={category.id} category={category} />
              ))}
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
    backgroundColor: '#06888C',
    minHeight: 204,
    justifyContent: 'flex-end',
    paddingBottom: 19,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 21,
    marginTop: 19,
  },
  backButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeInfo: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginHorizontal: 73,
  },
  storeLogoContainer: {
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
  storeDetails: {
    alignItems: 'center',
    gap: 8,
  },
  storeName: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 16,
  },
  storeAddress: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 14,
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
  },
  mainContent: {
    paddingHorizontal: 25,
    paddingTop: 33,
    marginBottom: 200,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#000',
    lineHeight: 19,
    marginBottom: 33,
  },
  categoriesGrid: {
    gap: 30,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  categoryItem: {
    alignItems: 'center',
    gap: 7,
    width: 60,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#B4BED4',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  categoryIcon: {
    width: 43,
    height: 43,
    resizeMode: 'contain',
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#000',
    textAlign: 'center',
    lineHeight: 14,
  },
  householdLabel: {
    fontSize: 11,
    lineHeight: 12,
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
    marginHorizontal: 21,
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
