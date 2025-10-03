import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
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
import { categoryApi, vendorApi } from '../../../api/client';
import type { Category, Vendor } from '../../../api/models';
import {
  ArrowBackButtonSVG,
  ArrowBackSVG,
  NotificationSVG,
  SupportSVG
} from '../../../components/icons';

export default function SelectCategoryScreen() {
  const params = useLocalSearchParams();
  const storeId = params.storeId as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [vendor, setVendor] = useState<Vendor | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadVendor = async () => {
      if (!storeId) return;
      try {
        const api = vendorApi();
        const res = await api.vendorsIdGet(String(storeId));
        if (mounted) setVendor(res?.data ?? null);
      } catch {
        if (mounted) setVendor(null);
      }
    };
    loadVendor();
    return () => { mounted = false; };
  }, [storeId]);

  useEffect(() => {
    let mounted = true;
    const loadCategories = async () => {
      try {
        setLoading(true);
        const api = categoryApi();
        const res = await api.categoryGet(undefined, undefined, undefined);
        if (mounted) setCategories(res?.data ?? []);
      } catch {
        if (mounted) setCategories([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadCategories();
    return () => { mounted = false; };
  }, []);

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
    const query = `/(private)/store/add-product?storeId=${encodeURIComponent(String(storeId || ''))}&categoryId=${encodeURIComponent(String(categoryId))}`;
    router.push(query as any);
  };

  const rows = useMemo(() => {
    const out: Category[][] = [];
    for (let i = 0; i < categories.length; i += 5) {
      out.push(categories.slice(i, i + 5));
    }
    return out;
  }, [categories]);

  const CategoryItem = ({ category }: { category: Category }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => handleCategorySelect(String(category.id))}
    >
      <View style={styles.categoryIconContainer}>
        {category?.imageUrl ? (
          <Image source={{ uri: category.imageUrl }} style={styles.categoryIcon} />
        ) : (
          <View style={[styles.categoryIcon, { backgroundColor: '#EEE', borderRadius: 8 }]} />
        )}
      </View>
      <Text style={[
        styles.categoryLabel,
        category.name === 'Household Materials' ? styles.householdLabel : null
      ]} numberOfLines={2}>
        {category?.name || ''}
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
              {vendor?.image ? (
                <Image source={{ uri: vendor.image }} style={styles.storeLogo} />
              ) : (
                <View style={[styles.storeLogo, { backgroundColor: '#FFF', borderRadius: 8 }]} />
              )}
            </View>
            <View style={styles.storeDetails}>
              <Text style={styles.storeName}>{vendor?.name || ''}</Text>
              <Text style={styles.storeAddress} numberOfLines={2}>{vendor?.address || ''}</Text>
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
          {loading ? (
            <Text style={{ textAlign: 'center' }}>Loading...</Text>
          ) : categories.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <Text style={{ fontWeight: '700' }}>No categories found</Text>
              <Text style={{ opacity: 0.7 }}>Please add categories to continue.</Text>
            </View>
          ) : (
            <View style={styles.categoriesGrid}>
              {rows.map((row, idx) => (
                <View key={idx} style={styles.categoryRow}>
                  {row.map((category) => (
                    <CategoryItem key={category.id} category={category} />
                  ))}
                </View>
              ))}
            </View>
          )}
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
