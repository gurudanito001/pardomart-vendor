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
import { borderRadius, colors, shadows, spacing, typography } from '../../../styles/theme';

interface PreviewItem {
  id: string;
  name: string;
  price: number;
  image: string;
  foundQuantity: number;
  totalQuantity: number;
  isPerishable?: boolean;
}

// Mock data based on Figma design
const PREVIEW_ITEMS: PreviewItem[] = [
  {
    id: '1',
    name: 'Valbest fully cooked chicken Nugget- frozen, 9g protein per 4 nugget serving, 24 0z (1.5lb)',
    price: 3.88,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/b15e90ad66573202e16cb0681e9db93877e30680?width=114',
    foundQuantity: 2,
    totalQuantity: 2,
  },
  {
    id: '2',
    name: 'Valbest fully cooked chicken Nugget- frozen, 9g protein per 4 nugget serving, 24 0z (1.5lb)',
    price: 3.88,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/b15e90ad66573202e16cb0681e9db93877e30680?width=114',
    foundQuantity: 2,
    totalQuantity: 2,
  },
  {
    id: '3',
    name: 'Valbest fully cooked chicken Nugget- frozen, 9g protein per 4 nugget serving, 24 0z (1.5lb)',
    price: 3.88,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/f01bb60245c119c55bf9106107aa831fc02d8d93?width=128',
    foundQuantity: 3,
    totalQuantity: 3,
    isPerishable: true,
  },
  {
    id: '4',
    name: 'Valbest fully cooked chicken Nugget- frozen, 9g protein per 4 nugget serving, 24 0z (1.5lb)',
    price: 3.88,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/f01bb60245c119c55bf9106107aa831fc02d8d93?width=128',
    foundQuantity: 3,
    totalQuantity: 3,
    isPerishable: true,
  },
];

export default function PreviewPage() {
  const handleGoBack = () => {
    router.back();
  };

  const handleNotifications = () => {
    console.log('Open notifications');
  };

  const handleSupport = () => {
    console.log('Open support');
  };

  const handleProceedToBagging = () => {
    console.log('Proceed to bagging');
    // Navigate to bagging page
  };

  const handleNext = () => {
    console.log('Load next items');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <svg width="30" height="30" viewBox="0 0 31 30" fill="none">
            <path 
              d="M20.1278 21.993C20.3661 22.2135 20.5 22.5125 20.5 22.8243C20.5 23.1361 20.3661 23.4352 20.1278 23.6556C19.8895 23.8761 19.5662 24 19.2292 24C18.8921 24 18.5689 23.8761 18.3306 23.6556L9.87313 15.8313C9.75486 15.7223 9.66102 15.5927 9.59699 15.4501C9.53296 15.3074 9.5 15.1545 9.5 15C9.5 14.8455 9.53296 14.6926 9.59699 14.5499C9.66102 14.4073 9.75486 14.2777 9.87313 14.1687L18.3306 6.34435C18.5689 6.12387 18.8921 6 19.2292 6C19.5662 6 19.8895 6.12387 20.1278 6.34435C20.3661 6.56483 20.5 6.86387 20.5 7.17568C20.5 7.48749 20.3661 7.78653 20.1278 8.00702L12.57 14.999L20.1278 21.993Z" 
              fill="white"
            />
          </svg>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Preview</Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleNotifications} style={styles.headerAction}>
            <svg width="24" height="24" viewBox="0 0 25 24" fill="none">
              <path 
                d="M9.145 20.5C9.36103 21.2219 9.80417 21.8549 10.4086 22.3049C11.013 22.755 11.7464 22.998 12.5 22.998C13.2536 22.998 13.987 22.755 14.5914 22.3049C15.1958 21.8549 15.639 21.2219 15.855 20.5H9.145ZM3.5 19.5H21.5V16.5L19.5 13.5V8.5C19.5 7.58075 19.3189 6.6705 18.9672 5.82122C18.6154 4.97194 18.0998 4.20026 17.4497 3.55025C16.7997 2.90024 16.0281 2.38463 15.1788 2.03284C14.3295 1.68106 13.4193 1.5 12.5 1.5C11.5807 1.5 10.6705 1.68106 9.82122 2.03284C8.97194 2.38463 8.20026 2.90024 7.55025 3.55025C6.90024 4.20026 6.38463 4.97194 6.03284 5.82122C5.68106 6.6705 5.5 7.58075 5.5 8.5V13.5L3.5 16.5V19.5Z" 
                fill="white"
              />
            </svg>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleSupport} style={styles.headerAction}>
            <svg width="24" height="24" viewBox="0 0 25 24" fill="none">
              <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M20.3 10.18C19.99 7.00002 18.11 2 12.3 2C6.49002 2 4.61001 7.00002 4.30002 10.18C3.21252 10.5927 2.4952 11.6368 2.50002 12.8V14.2C2.50002 15.7464 3.75365 17 5.30001 17C6.84642 17 8.10004 15.7464 8.10004 14.2V12.8C8.09498 11.6619 7.40404 10.6393 6.35001 10.21C6.55002 8.36998 7.53004 4.00002 12.3 4.00002C17.07 4.00002 18.04 8.36998 18.24 10.21C17.1882 10.6402 16.5007 11.6636 16.5 12.8V14.2C16.5022 14.7269 16.6524 15.2425 16.9335 15.6881C17.2147 16.1337 17.6154 16.4913 18.09 16.72C17.67 17.51 16.6 18.58 13.97 18.9C13.4443 18.1017 12.4272 17.787 11.5424 18.1489C10.6578 18.5108 10.1528 19.4481 10.3373 20.386C10.5218 21.3239 11.3442 22 12.3 22C12.6704 21.9979 13.0329 21.8931 13.3472 21.6971C13.6615 21.5011 13.9152 21.2217 14.08 20.89C18.37 20.4 19.74 18.19 20.17 16.89C21.3333 16.5132 22.1157 15.4227 22.1 14.2V12.8C22.1048 11.6368 21.3875 10.5927 20.3 10.18Z" 
                fill="white"
              />
            </svg>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Tip Card */}
          <View style={styles.tipCard}>
            <View style={styles.tipContent}>
              <View style={styles.tipIconContainer}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path 
                    d="M7 20H11C11 21.1 10.1 22 9 22C7.9 22 7 21.1 7 20ZM5 19H13V17H5V19ZM16.5 9.5C16.5 13.32 13.84 15.36 12.73 16H5.27C4.16 15.36 1.5 13.32 1.5 9.5C1.5 5.36 4.86 2 9 2C13.14 2 16.5 5.36 16.5 9.5ZM14.5 9.5C14.5 6.47 12.03 4 9 4C5.97 4 3.5 6.47 3.5 9.5C3.5 11.97 4.99 13.39 5.85 14H12.15C13.01 13.39 14.5 11.97 14.5 9.5ZM21.37 7.37L20 8L21.37 8.63L22 10L22.63 8.63L24 8L22.63 7.37L22 6L21.37 7.37ZM19 6L19.94 3.94L22 3L19.94 2.06L19 0L18.06 2.06L16 3L18.06 3.94L19 6Z" 
                    fill="#FFAC06"
                  />
                </svg>
              </View>
              <Text style={styles.tipText}>
                Cross check all shopping items and make sure the list is complete
              </Text>
            </View>
          </View>

          {/* Items List */}
          <View style={styles.itemsList}>
            {PREVIEW_ITEMS.map((item) => (
              <PreviewItemCard key={item.id} item={item} />
            ))}
          </View>

          {/* Pagination */}
          <View style={styles.pagination}>
            <Text style={styles.paginationText}>Showing 1-10 of 20</Text>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextText}>Next</Text>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M12.8333 16.375L17 12M17 12L12.8333 7.625M17 12H7" 
                  stroke="black" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Proceed to Bagging Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.proceedButton} onPress={handleProceedToBagging}>
          <svg width="24" height="24" viewBox="0 0 25 25" fill="none">
            <path 
              d="M7.5 22.5C6.95 22.5 6.47934 22.3043 6.088 21.913C5.69667 21.5217 5.50067 21.0507 5.5 20.5C5.49934 19.9493 5.69534 19.4787 6.088 19.088C6.48067 18.6973 6.95134 18.5013 7.5 18.5C8.04867 18.4987 8.51967 18.6947 8.913 19.088C9.30634 19.4813 9.502 19.952 9.5 20.5C9.498 21.048 9.30234 21.519 8.913 21.913C8.52367 22.307 8.05267 22.5027 7.5 22.5ZM17.5 22.5C16.95 22.5 16.4793 22.3043 16.088 21.913C15.6967 21.5217 15.5007 21.0507 15.5 20.5C15.4993 19.9493 15.6953 19.4787 16.088 19.088C16.4807 18.6973 16.9513 18.5013 17.5 18.5C18.0487 18.4987 18.5197 18.6947 18.913 19.088C19.3063 19.4813 19.502 19.952 19.5 20.5C19.498 21.048 19.3023 21.519 18.913 21.913C18.5237 22.307 18.0527 22.5027 17.5 22.5ZM3.5 4.5H2.5C2.21667 4.5 1.97934 4.404 1.788 4.212C1.59667 4.02 1.50067 3.78267 1.5 3.5C1.49934 3.21733 1.59534 2.98 1.788 2.788C1.98067 2.596 2.218 2.5 2.5 2.5H4.15C4.33334 2.5 4.50834 2.55 4.675 2.65C4.84167 2.75 4.96667 2.89167 5.05 3.075L9.025 11.5H16.025L19.65 5C19.7333 4.83333 19.85 4.70833 20 4.625C20.15 4.54167 20.3167 4.5 20.5 4.5C20.8833 4.5 21.171 4.66267 21.363 4.988C21.555 5.31333 21.559 5.64233 21.375 5.975L17.8 12.45C17.6167 12.7833 17.371 13.0417 17.063 13.225C16.755 13.4083 16.4173 13.5 16.05 13.5H8.6L7.5 15.5H18.5C18.7833 15.5 19.021 15.596 19.213 15.788C19.405 15.98 19.5007 16.2173 19.5 16.5C19.4993 16.7827 19.4033 17.0203 19.212 17.213C19.0207 17.4057 18.7833 17.5013 18.5 17.5H7.5C6.75 17.5 6.179 17.175 5.787 16.525C5.395 15.875 5.38267 15.2167 5.75 14.55L7.1 12.1L3.5 4.5ZM12.675 7.5H9.5C9.21667 7.5 8.97934 7.404 8.788 7.212C8.59667 7.02 8.50067 6.78267 8.5 6.5C8.49934 6.21733 8.59534 5.98 8.788 5.788C8.98067 5.596 9.218 5.5 9.5 5.5H12.675L11.775 4.6C11.575 4.4 11.479 4.16667 11.487 3.9C11.495 3.63333 11.5993 3.4 11.8 3.2C12 3.01667 12.2333 2.92067 12.5 2.912C12.7667 2.90333 13 2.99933 13.2 3.2L15.8 5.8C16 6 16.1 6.23333 16.1 6.5C16.1 6.76667 16 7 15.8 7.2L13.2 9.8C13.0167 9.98333 12.7877 10.0793 12.513 10.088C12.2383 10.0967 12.0007 10.0007 11.8 9.8C11.6167 9.61667 11.525 9.38333 11.525 9.1C11.525 8.81667 11.6167 8.58333 11.8 8.4L12.675 7.5Z" 
              fill="white"
            />
          </svg>
          <Text style={styles.proceedButtonText}>Proceed to Bagging</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

interface PreviewItemCardProps {
  item: PreviewItem;
}

const PreviewItemCard = ({ item }: PreviewItemCardProps) => {
  return (
    <View style={styles.itemCard}>
      <View style={styles.itemContent}>
        <View style={styles.itemImageContainer}>
          <Image source={{ uri: item.image }} style={styles.itemImage} />
        </View>
        
        <View style={styles.itemDetails}>
          <View style={styles.itemHeader}>
            <View style={styles.confirmedBadge}>
              <svg width="12" height="12" viewBox="0 0 13 12" fill="none">
                <path 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M6.01626 12C6.80633 12 7.58866 11.8448 8.31858 11.5433C9.04851 11.2417 9.71174 10.7998 10.2704 10.2426C10.8291 9.68549 11.2722 9.02405 11.5746 8.2961C11.8769 7.56815 12.0325 6.78793 12.0325 6C12.0325 5.21207 11.8769 4.43185 11.5746 3.7039C11.2722 2.97595 10.8291 2.31451 10.2704 1.75736C9.71174 1.20021 9.04851 0.758251 8.31858 0.456723C7.58866 0.155195 6.80633 -1.17411e-08 6.01626 0C4.42065 2.37122e-08 2.89039 0.632141 1.76212 1.75736C0.633854 2.88258 0 4.4087 0 6C0 7.5913 0.633854 9.11742 1.76212 10.2426C2.89039 11.3679 4.42065 12 6.01626 12ZM5.86117 8.42667L9.20354 4.42667L8.17677 3.57333L5.30233 7.01267L3.81498 5.52867L2.86976 6.47133L4.87518 8.47133L5.39257 8.98733L5.86117 8.42667Z" 
                  fill="#01891C"
                />
              </svg>
              <Text style={styles.confirmedText}>Confirmed</Text>
            </View>
            
            <Text style={styles.foundText}>
              {item.foundQuantity} of {item.totalQuantity} found
            </Text>
          </View>
          
          <Text style={styles.itemName}>{item.name}</Text>
          
          <View style={styles.itemFooter}>
            <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            {item.isPerishable && (
              <View style={styles.perishableBadge}>
                <Text style={styles.perishableText}>Perishable</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: 19,
    paddingBottom: 16,
    backgroundColor: colors.primary,
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
    color: colors.background,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    fontFamily: typography.families.accent,
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
  scrollContainer: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 27,
    paddingTop: spacing.lg + spacing.sm,
    gap: spacing.lg + spacing.sm,
    paddingBottom: spacing.xl,
  },
  tipCard: {
    padding: spacing.md,
    paddingHorizontal: 22,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#B4BED4',
    ...shadows.md,
  },
  tipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 32,
    backgroundColor: colors.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    fontFamily: typography.families.secondary,
    fontWeight: typography.weights.normal,
    color: '#898A8D',
    lineHeight: 16,
  },
  itemsList: {
    gap: 14,
  },
  itemCard: {
    padding: spacing.md,
    paddingHorizontal: 18,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: colors.background,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemImageContainer: {
    width: 81,
    height: 76,
    padding: 10,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImage: {
    width: 57,
    height: 57,
    resizeMode: 'contain',
  },
  itemDetails: {
    flex: 1,
    gap: 6,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confirmedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  confirmedText: {
    fontSize: 12,
    fontFamily: typography.families.secondary,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    lineHeight: 16,
  },
  foundText: {
    fontSize: 12,
    fontFamily: typography.families.secondary,
    fontWeight: typography.weights.bold,
    color: '#7C7B7B',
    lineHeight: 16,
  },
  itemName: {
    fontSize: 12,
    fontFamily: typography.families.secondary,
    fontWeight: typography.weights.normal,
    color: '#484C52',
    lineHeight: 16,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: typography.families.secondary,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    lineHeight: 19,
  },
  perishableBadge: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(33, 196, 93, 0.10)',
  },
  perishableText: {
    fontSize: 10,
    fontFamily: typography.families.secondary,
    fontWeight: typography.weights.normal,
    color: '#21C45D',
    lineHeight: 20,
    textAlign: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  paginationText: {
    fontSize: 14,
    fontFamily: typography.families.secondary,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    opacity: 0.8,
    lineHeight: 19,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    opacity: 0.8,
  },
  nextText: {
    fontSize: 15,
    fontFamily: 'Nunito Sans',
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  buttonContainer: {
    padding: spacing.lg,
    paddingHorizontal: 22,
    backgroundColor: colors.background,
  },
  proceedButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    paddingHorizontal: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    ...shadows.md,
  },
  proceedButtonText: {
    fontSize: typography.sizes.base,
    fontFamily: typography.families.accent,
    fontWeight: typography.weights.bold,
    color: colors.background,
    lineHeight: 25,
    textAlign: 'center',
  },
});
