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
  status?: 'confirmed' | 'pending' | 'not_approved' | 'edit';
  replacementItem?: ShoppingListItem;
}

interface ShoppingCategory {
  name: string;
  items: ShoppingListItem[];
}

// Mock data for pending items with substitutions
const PENDING_ITEMS: ShoppingCategory[] = [
  {
    name: 'Grocery',
    items: [
      {
        id: '4',
        name: 'Valbest fully cooked chicken Nugget- frozen, 9g protein per 4 nugget serving, 24 0z (1.5lb)',
        price: 3.88,
        quantity: 2,
        originalQuantity: 5,
        image: 'https://api.builder.io/api/v1/image/assets/TEMP/a499a598d54a4cf8d3d1529a18284e4be924b977?width=132',
        category: 'Grocery',
        status: 'confirmed',
        replacementItem: {
          id: '4b',
          name: 'fully cooked chicken Nugget- frozen, 9g protein per 4 nugget serving, 24 0z (1.5lb)',
          price: 3.88,
          quantity: 5,
          image: 'https://api.builder.io/api/v1/image/assets/TEMP/956b78689861a4302e29d6a66aeec32819e9ff9e?width=112',
          category: 'Grocery',
        },
      },
    ],
  },
  {
    name: 'Frozen',
    items: [
      {
        id: '5',
        name: 'Valbest fully cooked chicken Nugget- frozen, 9g protein per 4 nugget serving, 24 0z (1.5lb)',
        price: 3.88,
        quantity: 0,
        originalQuantity: 5,
        image: 'https://api.builder.io/api/v1/image/assets/TEMP/f58c1a19122fda28da6d87adec8eeb3ad60c22d6?width=132',
        category: 'Frozen',
        status: 'edit',
      },
      {
        id: '6',
        name: 'Valbest fully cooked chicken Nugget- frozen, 9g protein per 4 nugget serving, 24 0z (1.5lb)',
        price: 3.88,
        quantity: 2,
        originalQuantity: 5,
        image: 'https://api.builder.io/api/v1/image/assets/TEMP/a499a598d54a4cf8d3d1529a18284e4be924b977?width=132',
        category: 'Frozen',
        status: 'pending',
        replacementItem: {
          id: '6b',
          name: 'fully cooked chicken Nugget- frozen, 9g protein per 4 nugget serving, 24 0z (1.5lb)',
          price: 3.88,
          quantity: 5,
          image: 'https://api.builder.io/api/v1/image/assets/TEMP/956b78689861a4302e29d6a66aeec32819e9ff9e?width=112',
          category: 'Frozen',
        },
      },
      {
        id: '7',
        name: 'Valbest fully cooked chicken Nugget- frozen, 9g protein per 4 nugget serving, 24 0z (1.5lb)',
        price: 3.88,
        quantity: 2,
        originalQuantity: 5,
        image: 'https://api.builder.io/api/v1/image/assets/TEMP/a499a598d54a4cf8d3d1529a18284e4be924b977?width=132',
        category: 'Frozen',
        status: 'not_approved',
        replacementItem: {
          id: '7b',
          name: 'fully cooked chicken Nugget- frozen, 9g protein per 4 nugget serving, 24 0z (1.5lb)',
          price: 3.88,
          quantity: 5,
          image: 'https://api.builder.io/api/v1/image/assets/TEMP/956b78689861a4302e29d6a66aeec32819e9ff9e?width=112',
          category: 'Frozen',
        },
      },
    ],
  },
];

export default function PendingTabContent() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
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
                These are items substitutions that are awaiting confirmation from customers
              </Text>
            </View>
          </View>

          {/* Categories */}
          {PENDING_ITEMS.map((category) => (
            <View key={category.name} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{category.name}</Text>
              {category.items.map((item) => (
                <SubstitutionCard key={item.id} item={item} />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Resume Shopping Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.resumeButton}>
          <Text style={styles.resumeButtonText}>Resume Shopping</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface SubstitutionCardProps {
  item: ShoppingListItem;
}

const SubstitutionCard = ({ item }: SubstitutionCardProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return {
          text: 'Confirmed',
          backgroundColor: 'rgba(33, 196, 93, 0.10)',
          textColor: '#21C45D',
        };
      case 'pending':
        return {
          text: 'Pending',
          backgroundColor: 'rgba(204, 135, 7, 0.10)',
          textColor: '#CC8707',
        };
      case 'not_approved':
        return {
          text: 'Not approved',
          backgroundColor: 'rgba(196, 61, 40, 0.10)',
          textColor: '#C43D28',
        };
      default:
        return {
          text: 'Unknown',
          backgroundColor: 'rgba(136, 136, 136, 0.10)',
          textColor: '#888',
        };
    }
  };

  const statusBadge = getStatusBadge(item.status || '');
  const isEdit = item.status === 'edit';
  const borderColor = item.status === 'confirmed' 
    ? 'rgba(44, 175, 11, 0.30)' 
    : item.status === 'pending'
    ? 'rgba(204, 135, 7, 0.30)'
    : 'rgba(255, 0, 0, 0.30)';

  const backgroundColor = item.status === 'edit' 
    ? 'rgba(196, 61, 40, 0.20)' 
    : colors.background;

  return (
    <View style={[styles.substitutionCard, { borderColor, backgroundColor }]}>
      {/* Original Item (grayed out) */}
      <View style={styles.originalItemContent}>
        <View style={styles.itemImageContainer}>
          <Image source={{ uri: item.image }} style={styles.itemImage} />
        </View>
        <View style={styles.itemDetails}>
          <Text style={styles.originalItemName}>{item.name}</Text>
          <View style={styles.itemPriceRow}>
            <Text style={styles.originalItemPrice}>${item.price.toFixed(2)}</Text>
            <View style={styles.quantityContainer}>
              <Text style={styles.originalQuantityLabel}>QTY</Text>
              <Text style={styles.originalQuantityValue}> {item.quantity} of {item.originalQuantity}</Text>
            </View>
          </View>
        </View>
        {isEdit && (
          <View style={styles.editButton}>
            <Svg width="9" height="8" viewBox="0 0 11 9" fill="none">
              <Path 
                d="M6.82353 1.57427L8.41177 3.05835M5.76471 8.5H10M1.52941 6.52122L1 8.5L3.11765 8.0053L9.25141 2.27377C9.44991 2.08823 9.56142 1.83662 9.56142 1.57427C9.56142 1.31192 9.44991 1.06031 9.25141 0.874768L9.16035 0.78968C8.96179 0.604198 8.69253 0.5 8.41177 0.5C8.131 0.5 7.86174 0.604198 7.66318 0.78968L1.52941 6.52122Z" 
                stroke="white" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={styles.editButtonText}>Edit</Text>
          </View>
        )}
      </View>

      {!isEdit && (
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

          {/* Status and Action Row */}
          <View style={styles.statusActionRow}>
            <Text style={styles.replacementText}>Above was replaced with this</Text>
            <View style={styles.statusActions}>
              <View style={[styles.statusBadge, { backgroundColor: statusBadge.backgroundColor }]}>
                <Text style={[styles.statusText, { color: statusBadge.textColor }]}>
                  {statusBadge.text}
                </Text>
              </View>
            </View>
          </View>

          {/* Replacement Item */}
          {item.replacementItem && (
            <View style={styles.replacementItemContent}>
              <View style={styles.itemImageContainer}>
                <Image source={{ uri: item.replacementItem.image }} style={styles.itemImage} />
              </View>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.replacementItem.name}</Text>
                <View style={styles.itemPriceRow}>
                  <Text style={styles.itemPrice}>${item.replacementItem.price.toFixed(2)}</Text>
                  <View style={styles.quantityContainer}>
                    <Text style={styles.quantityLabel}>QTY</Text>
                    <Text style={styles.quantityValue}> {item.replacementItem.quantity}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
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
  substitutionCard: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  originalItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 15,
    paddingHorizontal: 21,
  },
  replacementItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 15,
    paddingHorizontal: 21,
  },
  itemImageContainer: {
    width: 81,
    height: 76,
    padding: 5,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImage: {
    width: 66,
    height: 66,
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
  originalItemName: {
    fontSize: 12,
    fontFamily: typography.families.secondary,
    fontWeight: typography.weights.normal,
    color: '#BBBBBB',
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
  originalItemPrice: {
    fontSize: 14,
    fontFamily: typography.families.secondary,
    fontWeight: typography.weights.bold,
    color: '#BBBBBB',
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
    color: colors.textPrimary,
    lineHeight: 12,
  },
  quantityValue: {
    fontSize: 12,
    fontFamily: typography.families.secondary,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    lineHeight: 12,
  },
  originalQuantityLabel: {
    fontSize: 12,
    fontFamily: typography.families.secondary,
    fontWeight: typography.weights.normal,
    color: '#BBBBBB',
    lineHeight: 12,
  },
  originalQuantityValue: {
    fontSize: 12,
    fontFamily: typography.families.secondary,
    fontWeight: typography.weights.bold,
    color: '#BBBBBB',
    lineHeight: 12,
  },
  arrowContainer: {
    paddingHorizontal: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 21,
    paddingTop: 10,
  },
  replacementText: {
    fontSize: 12,
    fontFamily: typography.families.secondary,
    fontWeight: typography.weights.normal,
    color: colors.textPrimary,
    lineHeight: 12,
  },
  statusActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontFamily: typography.families.secondary,
    fontWeight: typography.weights.normal,
    lineHeight: 20,
    textAlign: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  editButtonText: {
    fontSize: 10,
    fontFamily: typography.families.secondary,
    fontWeight: typography.weights.bold,
    color: colors.background,
    lineHeight: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    padding: spacing.lg,
    paddingHorizontal: 21,
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
