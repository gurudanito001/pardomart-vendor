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
  image: string;
  category: string;
  isPerishable?: boolean;
}

interface ShoppingCategory {
  name: string;
  items: ShoppingListItem[];
}

// Mock data - will move to separate file later
const REMAINING_ITEMS: ShoppingCategory[] = [
  {
    name: 'Dsd Groceries',
    items: [
      {
        id: '1',
        name: 'Valbest fully cooked chicken Nugget- frozen, 9g protein per 4 nugget serving, 24 0z (1.5lb)',
        price: 3.88,
        quantity: 5,
        image: 'https://api.builder.io/api/v1/image/assets/TEMP/8ca46a868ac10a74a0da8c30074c452c3ddf4ae8?width=114',
        category: 'Dsd Groceries',
      },
    ],
  },
  {
    name: 'Frozen',
    items: [
      {
        id: '2',
        name: 'Valbest fully cooked chicken Nugget- frozen, 9g protein per 4 nugget serving, 24 0z (1.5lb)',
        price: 3.88,
        quantity: 5,
        image: 'https://api.builder.io/api/v1/image/assets/TEMP/f58c1a19122fda28da6d87adec8eeb3ad60c22d6?width=132',
        category: 'Frozen',
        isPerishable: true,
      },
    ],
  },
  {
    name: 'Grocery',
    items: [
      {
        id: '3',
        name: 'Valbest fully cooked chicken Nugget- frozen, 9g protein per 4 nugget serving, 24 0z (1.5lb)',
        price: 3.88,
        quantity: 5,
        image: 'https://api.builder.io/api/v1/image/assets/TEMP/a499a598d54a4cf8d3d1529a18284e4be924b977?width=132',
        category: 'Grocery',
      },
    ],
  },
];

interface RemainingTabContentProps {
  onResumeClick: () => void;
}

export default function RemainingTabContent({ onResumeClick }: RemainingTabContentProps) {
  const getItemsLeft = () => {
    return REMAINING_ITEMS.reduce((total, category) => total + category.items.length, 0);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Items Left Card */}
          <View style={styles.itemsLeftCard}>
            <View style={styles.itemsLeftContent}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Path 
                  d="M17 4H7C5.89543 4 5 4.89543 5 6V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V6C19 4.89543 18.1046 4 17 4Z" 
                  stroke="black" 
                  strokeWidth="2"
                />
                <Path 
                  d="M9 9H15M9 13H15M9 17H13" 
                  stroke="black" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />
              </Svg>
              <Text style={styles.itemsLeftText}>{getItemsLeft()} Items left</Text>
            </View>
          </View>

          {/* Tip Card */}
          <View style={styles.tipCard}>
            <View style={styles.tipContent}>
              <View style={styles.tipIconContainer}>
                <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <Path 
                    d="M7 20H11C11 21.1 10.1 22 9 22C7.9 22 7 21.1 7 20ZM5 19H13V17H5V19ZM16.5 9.5C16.5 13.32 13.84 15.36 12.73 16H5.27C4.16 15.36 1.5 13.32 1.5 9.5C1.5 5.36 4.86 2 9 2C13.14 2 16.5 5.36 16.5 9.5ZM14.5 9.5C14.5 6.47 12.03 4 9 4C5.97 4 3.5 6.47 3.5 9.5C3.5 11.97 4.99 13.39 5.85 14H12.15C13.01 13.39 14.5 11.97 14.5 9.5ZM21.37 7.37L20 8L21.37 8.63L22 10L22.63 8.63L24 8L22.63 7.37L22 6L21.37 7.37ZM19 6L19.94 3.94L22 3L19.94 2.06L19 0L18.06 2.06L16 3L18.06 3.94L19 6Z" 
                    fill="#FFAC06"
                  />
                </Svg>
              </View>
              <Text style={styles.tipText}>
                Shopping for perishable items last reduces cancellations due to food safety standards
              </Text>
            </View>
          </View>

          {/* Categories */}
          {REMAINING_ITEMS.map((category) => (
            <View key={category.name} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{category.name}</Text>
              {category.items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Resume Shopping Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.resumeButton} onPress={onResumeClick}>
          <Text style={styles.resumeButtonText}>Resume Shopping</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface ItemCardProps {
  item: ShoppingListItem;
}

const ItemCard = ({ item }: ItemCardProps) => {
  return (
    <View style={styles.itemCard}>
      <View style={styles.itemContent}>
        <View style={styles.itemImageContainer}>
          <Image source={{ uri: item.image }} style={styles.itemImage} />
        </View>
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <View style={styles.itemPriceRow}>
            <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            <View style={styles.quantityContainer}>
              <Text style={styles.quantityLabel}>QTY</Text>
              <Text style={styles.quantityValue}> {item.quantity}</Text>
            </View>
            {item.isPerishable && (
              <View style={styles.perishableTag}>
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
  scrollContainer: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 25,
    paddingTop: spacing.md + spacing.sm,
    gap: spacing.md + spacing.sm,
  },
  itemsLeftCard: {
    padding: 9,
    paddingHorizontal: 22,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#444343',
  },
  itemsLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  itemsLeftText: {
    fontSize: typography.sizes.base,
    fontFamily: typography.families.secondary,
    fontWeight: typography.weights.normal,
    color: colors.textPrimary,
    lineHeight: 22,
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
  categorySection: {
    gap: 6,
  },
  categoryTitle: {
    fontSize: typography.sizes.base,
    fontFamily: typography.families.secondary,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    lineHeight: 16,
  },
  itemCard: {
    padding: spacing.md,
    paddingHorizontal: 21,
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
  itemName: {
    fontSize: 12,
    fontFamily: typography.families.secondary,
    fontWeight: typography.weights.normal,
    color: '#484C52',
    lineHeight: 16,
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
  quantityValue: {
    fontSize: 12,
    fontFamily: typography.families.secondary,
    fontWeight: typography.weights.bold,
    color: '#7C7B7B',
    lineHeight: 12,
  },
  perishableTag: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(33, 196, 93, 0.10)',
    marginLeft: 'auto',
  },
  perishableText: {
    fontSize: 10,
    fontFamily: typography.families.secondary,
    fontWeight: typography.weights.normal,
    color: '#21C45D',
    lineHeight: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    padding: spacing.lg,
    paddingHorizontal: 22,
    backgroundColor: colors.background,
  },
  resumeButton: {
    padding: 14,
    paddingHorizontal: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  resumeButtonText: {
    fontSize: typography.sizes.base,
    fontFamily: typography.families.accent,
    fontWeight: typography.weights.bold,
    color: colors.background,
    lineHeight: 25,
    textAlign: 'center',
  },
});
