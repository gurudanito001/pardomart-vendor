import { router } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { borderRadius, colors, shadows, spacing, typography } from '../../styles/theme';

interface ShoppingListItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  originalQuantity?: number;
  image: string;
  category: string;
  status: 'confirmed';
  replacementItem?: ShoppingListItem;
}

interface ShoppingCategory {
  name: string;
  items: ShoppingListItem[];
}

// Mock data for completed items based on Figma design
const COMPLETED_ITEMS: ShoppingCategory[] = [
  {
    name: 'Dsd Groceries',
    items: [
      {
        id: 'c1',
        name: 'Valbest fully cooked chicken Nugget- frozen, 9g protein per 4 nugget serving, 24 0z (1.5lb)',
        price: 3.88,
        quantity: 5,
        image: 'https://api.builder.io/api/v1/image/assets/TEMP/8ca46a868ac10a74a0da8c30074c452c3ddf4ae8?width=114',
        category: 'Dsd Groceries',
        status: 'confirmed',
      },
    ],
  },
  {
    name: 'Grocery',
    items: [
      {
        id: 'c2',
        name: 'Valbest fully cooked chicken Nugget- frozen, 9g protein per 4 nugget serving, 24 0z (1.5lb)',
        price: 3.88,
        quantity: 2,
        originalQuantity: 5,
        image: 'https://api.builder.io/api/v1/image/assets/TEMP/a499a598d54a4cf8d3d1529a18284e4be924b977?width=132',
        category: 'Grocery',
        status: 'confirmed',
        replacementItem: {
          id: 'c2b',
          name: 'fully cooked chicken Nugget- frozen, 9g protein per 4 nugget serving, 24 0z (1.5lb)',
          price: 3.88,
          quantity: 5,
          image: 'https://api.builder.io/api/v1/image/assets/TEMP/956b78689861a4302e29d6a66aeec32819e9ff9e?width=112',
          category: 'Grocery',
          status: 'confirmed',
        },
      },
      {
        id: 'c3',
        name: 'Valbest fully cooked chicken Nugget- frozen, 9g protein per 4 nugget serving, 24 0z (1.5lb)',
        price: 3.88,
        quantity: 5,
        image: 'https://api.builder.io/api/v1/image/assets/TEMP/a499a598d54a4cf8d3d1529a18284e4be924b977?width=132',
        category: 'Grocery',
        status: 'confirmed',
      },
      {
        id: 'c4',
        name: 'Valbest fully cooked chicken Nugget- frozen, 9g protein per 4 nugget serving, 24 0z (1.5lb)',
        price: 3.88,
        quantity: 5,
        image: 'https://api.builder.io/api/v1/image/assets/TEMP/a499a598d54a4cf8d3d1529a18284e4be924b977?width=132',
        category: 'Grocery',
        status: 'confirmed',
      },
    ],
  },
];

interface CompletedTabContentProps {
  onProceedToReview?: () => void;
}

export default function CompletedTabContent({ onProceedToReview }: CompletedTabContentProps) {
  const handleProceedToReview = () => {
    console.log('Proceed to Review');
    router.push('/(private)/orders/preview-page' as any);
    onProceedToReview?.();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Categories */}
          {COMPLETED_ITEMS.map((category) => (
            <View key={category.name} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{category.name}</Text>
              {category.items.map((item) => (
                <CompletedItemCard key={item.id} item={item} />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Proceed to Review Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.proceedButton} onPress={handleProceedToReview}>
          <Svg width="24" height="24" viewBox="0 0 24 25" fill="none">
            <Path 
              d="M16 11.5V7.5C16 6.43913 15.5786 5.42172 14.8284 4.67157C14.0783 3.92143 13.0609 3.5 12 3.5C10.9391 3.5 9.92172 3.92143 9.17157 4.67157C8.42143 5.42172 8 6.43913 8 7.5V11.5M5 9.5H19L20 21.5H4L5 9.5Z" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={styles.proceedButtonText}>Proceed to Review</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface CompletedItemCardProps {
  item: ShoppingListItem;
}

const CompletedItemCard = ({ item }: CompletedItemCardProps) => {
  const hasReplacement = !!item.replacementItem;

  return (
    <View style={styles.completedCard}>
      {/* Status Badge */}
      <View style={styles.statusBadgeContainer}>
        <View style={styles.confirmedBadge}>
          <Text style={styles.confirmedText}>Confirmed</Text>
        </View>
      </View>

      {/* Original Item */}
      <View style={styles.itemContent}>
        <View style={styles.itemImageContainer}>
          <Image source={{ uri: item.image }} style={styles.itemImage} />
        </View>
        <View style={styles.itemDetails}>
          <Text style={[styles.itemName, hasReplacement && styles.replacedItemName]}>
            {item.name}
          </Text>
          <View style={styles.itemPriceRow}>
            <Text style={[styles.itemPrice, hasReplacement && styles.replacedItemPrice]}>
              ${item.price.toFixed(2)}
            </Text>
            <View style={styles.quantityContainer}>
              <Text style={[styles.quantityLabel, hasReplacement && styles.replacedQuantityLabel]}>
                QTY
              </Text>
              <Text style={[styles.quantityValue, hasReplacement && styles.replacedQuantityValue]}>
                {hasReplacement ? ` ${item.quantity} of ${item.originalQuantity}` : ` ${item.quantity}`}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Replacement Section */}
      {hasReplacement && (
        <>
          {/* Arrow */}
          <View style={styles.arrowContainer}>
            <Svg width="322" height="8" viewBox="0 0 323 8" fill="none">
              <Path 
                d="M322.354 4.35355C322.549 4.15829 322.549 3.84171 322.354 3.64645L319.172 0.464466C318.976 0.269204 318.66 0.269204 318.464 0.464466C318.269 0.659728 318.269 0.976311 318.464 1.17157L321.293 4L318.464 6.82843C318.269 7.02369 318.269 7.34027 318.464 7.53553C318.66 7.7308 318.976 7.7308 319.172 7.53553L322.354 4.35355ZM0 4V4.5H322V4V3.5H0V4Z" 
                fill="#BBBBBB"
              />
            </Svg>
          </View>

          {/* Replacement Text */}
          <View style={styles.replacementTextContainer}>
            <Text style={styles.replacementText}>Above was replaced with this</Text>
          </View>

          {/* Replacement Item */}
          <View style={styles.itemContent}>
            <View style={styles.itemImageContainer}>
              <Image source={{ uri: item.replacementItem!.image }} style={styles.itemImage} />
            </View>
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.replacementItem!.name}</Text>
              <View style={styles.itemPriceRow}>
                <Text style={styles.itemPrice}>${item.replacementItem!.price.toFixed(2)}</Text>
                <View style={styles.quantityContainer}>
                  <Text style={styles.quantityLabel}>QTY</Text>
                  <Text style={styles.quantityValue}> {item.replacementItem!.quantity}</Text>
                </View>
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 25,
    paddingTop: spacing.md + spacing.sm,
    gap: spacing.md + spacing.sm,
  },
  categorySection: {
    gap: 6,
  },
  categoryTitle: {
    fontSize: typography.sizes.base,
    fontFamily: typography.families.secondary,
    fontWeight: typography.weights.bold,
    color: '#BBBBBB',
    lineHeight: 16,
  },
  completedCard: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#BBBBBB',
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  statusBadgeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 13,
    paddingHorizontal: 21,
  },
  confirmedBadge: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(33, 196, 93, 0.10)',
  },
  confirmedText: {
    fontSize: 10,
    fontFamily: typography.families.secondary,
    fontWeight: typography.weights.normal,
    color: '#21C45D',
    lineHeight: 20,
    textAlign: 'center',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 21,
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
  itemName: {
    fontSize: 12,
    fontFamily: typography.families.secondary,
    fontWeight: typography.weights.normal,
    color: colors.textPrimary,
    lineHeight: 16,
  },
  replacedItemName: {
    color: '#BBBBBB',
  },
  itemPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: typography.families.secondary,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    lineHeight: 14,
  },
  replacedItemPrice: {
    color: '#BBBBBB',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityLabel: {
    fontSize: 12,
    fontFamily: typography.families.secondary,
    fontWeight: typography.weights.normal,
    color: '#BBBBBB',
    lineHeight: 12,
  },
  replacedQuantityLabel: {
    color: '#BBBBBB',
  },
  quantityValue: {
    fontSize: 12,
    fontFamily: typography.families.secondary,
    fontWeight: typography.weights.bold,
    color: '#7C7B7B',
    lineHeight: 12,
  },
  replacedQuantityValue: {
    color: '#BBBBBB',
  },
  arrowContainer: {
    paddingHorizontal: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  replacementTextContainer: {
    paddingHorizontal: 21,
    paddingVertical: 12,
  },
  replacementText: {
    fontSize: 12,
    fontFamily: typography.families.secondary,
    fontWeight: typography.weights.normal,
    color: '#BBBBBB',
    lineHeight: 12,
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
