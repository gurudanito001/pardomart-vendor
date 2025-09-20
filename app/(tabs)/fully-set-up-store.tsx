import React from 'react';
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
  CompletedOrdersSVG,
  CustomersSVG,
  EarningsWalletSVG,
  MyShoppersSVG,
  NotificationSVG,
  OrderSVG,
  ResourcesSVG,
  SettingsSVG,
  StoreSVG,
  SupportSVG,
  TransactionsSVG
} from '../../components/icons';
import DashboardCard from '../../components/ui/DashboardCard';
import { colors, shadows, spacing, typography } from '../../styles/theme';

const { width } = Dimensions.get('window');
const CARD_GAP = 12;
const NUM_COLUMNS = 2;
const CARD_WIDTH = (width - spacing.lg * 2 - CARD_GAP) / NUM_COLUMNS - 2; // approximate card width

type CardItem = {
  key: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  badge?: string | number;
};

export default function FullySetUpStore() {

  const cards: CardItem[] = [
    {
      key: 'my-stores',
      title: 'My Stores',
      subtitle: 'Checkout your store informations now',
      icon: <StoreSVG width={24} height={24} color="black" />,
    },
    {
      key: 'my-orders',
      title: 'My Orders',
      subtitle: 'Checkout your store informations now',
      badge: '12 New',
      icon: <OrderSVG width={22} height={22} color="black" />,
    },
    {
      key: 'transactions',
      title: 'Transactions',
      subtitle: 'Checkout your store informations now',
      icon: <TransactionsSVG width={24} height={24} color="black" />,
    },
    {
      key: 'my-shoppers',
      title: 'My Shoppers',
      subtitle: 'Checkout your store informations now',
      icon: <MyShoppersSVG width={24} height={24} color="black" />,
    },
    {
      key: 'customers',
      title: 'Customers',
      subtitle: 'Checkout your store informations now',
      icon: <CustomersSVG width={24} height={24} color="black" />,
    },
    {
      key: 'earnings',
      title: 'Earnings & Wallet',
      subtitle: 'Checkout your store informations now',
      icon: <EarningsWalletSVG width={24} height={24} color="black" />,
    },
    {
      key: 'resources',
      title: 'Resources',
      subtitle: 'Checkout your store informations now',
      icon: <ResourcesSVG width={24} height={24} color="black" />,
    },
    {
      key: 'settings',
      title: 'My Settings',
      subtitle: 'Checkout your store informations now',
      icon: <SettingsSVG width={24} height={24} color="black" />,
    },
  ];

  const completedOrdersCard: CardItem = {
    key: 'completed-orders',
    title: 'Completed Orders',
    subtitle: 'View all completed Orders and Verify Orders',
    icon: <CompletedOrdersSVG width={24} height={24} color="black" />,
  };

  return (
    <View style={styles.container}>
      {/* Header area - green background (status bar intentionally omitted) */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoCircle}>
            <Image
              source={{ uri: 'https://api.builder.io/api/v1/image/assets/TEMP/71dd8da5c1657c64604a217c2453898ecc67a2cd?width=48' }}
              style={styles.logoImage}
            />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.smallText}>Good morning</Text>
            <View style={styles.storeNameContainer}>
              <Text style={styles.storeName}>Jewel Osco</Text>
              <Svg width="12" height="12" viewBox="0 0 18 13" style={styles.dropdownArrow}>
                <Path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.28935 10.6571L2.63235 5.00006L4.04635 3.58606L8.99635 8.53606L13.9464 3.58606L15.3604 5.00006L9.70335 10.6571C9.51582 10.8445 9.26152 10.9498 8.99635 10.9498C8.73119 10.9498 8.47688 10.8445 8.28935 10.6571Z"
                  fill="white"
                />
              </Svg>
            </View>
          </View>
        </View>
        <View style={styles.headerRight}>
          <NotificationSVG width={24} height={24} color="white" />
          <View style={{ marginLeft: 14 }}>
            <SupportSVG width={24} height={24} color="white" />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity activeOpacity={0.9} style={styles.requestsBanner}>
          <View style={styles.requestsLeft}>
            <View style={styles.requestsIconContainer}>
              <Svg width="24" height="24" viewBox="0 0 24 24">
                <Path d="M17 4H7C5.89543 4 5 4.89543 5 6V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V6C19 4.89543 18.1046 4 17 4Z" stroke="black" strokeWidth="2"/>
                <Path d="M9 9H15M9 13H15M9 17H13" stroke="black" strokeWidth="2" strokeLinecap="round"/>
              </Svg>
            </View>
            <Text style={styles.requestsText}>You have 12 Order Requests</Text>
          </View>
          <Svg width="24" height="24" viewBox="0 0 24 24">
            <Path d="M13.2924 12L8.69238 7.40002L9.40038 6.69202L14.7084 12L9.40038 17.308L8.69238 16.6L13.2924 12Z" fill="black" fillOpacity="0.4"/>
          </Svg>
        </TouchableOpacity>

        <View style={styles.grid}>
          {cards.map((card) => (
            <View key={card.key} style={{ width: CARD_WIDTH }}>
              <View style={{ position: 'relative' }}>
                <DashboardCard
                  title={card.title}
                  subtitle={card.subtitle ?? ''}
                  iconComponent={card.icon}
                  onPress={() => {}}
                />
                {card.badge ? (
                  <View style={[styles.badge, { position: 'absolute', top: 16, right: 20 }]}>
                    <Text style={styles.badgeText}>{card.badge}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          ))}
        </View>

        {/* Completed Orders - Single Card using DashboardCard */}
        <View style={{ marginTop: 6 }}>
          <DashboardCard
            title={completedOrdersCard.title}
            subtitle={completedOrdersCard.subtitle ?? ""}
            iconComponent={completedOrdersCard.icon}
            onPress={() => {}}
            style={styles.fullWidthCard}
          />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'android' ? spacing.md : spacing.sm + 8,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 24,
    height: 24,
  },
  headerTextContainer: {
    gap: 1,
  },
  smallText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: typography.families.secondary,
    fontWeight: '400' as any,
  },
  storeNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  storeName: {
    color: '#fff',
    fontSize: 12,
    fontFamily: typography.families.accent,
    fontWeight: '700' as any,
  },
  dropdownArrow: {
    transform: [{ rotate: '90deg' }],
  },
  headerIcon: {
    // Base style for header icons
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  requestsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(6, 136, 140, 0.30)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginBottom: 17,
  },
  requestsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  requestsIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestsText: {
    fontFamily: typography.families.secondary,
    fontSize: 16,
    fontWeight: '600' as any,
    color: colors.textPrimary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: CARD_GAP,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#F0F8F8',
    borderRadius: 16,
    padding: 16,
    marginBottom: 17,
    ...shadows.sm,
  },
  fullWidthCard: {
    width: '100%',
  },
  cardContent: {
    gap: 15,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(6,136,140,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTextWrap: {
    gap: 4,
  },
  cardTitle: {
    fontFamily: typography.families.accent,
    fontWeight: '700' as any,
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  cardSubtitle: {
    fontFamily: typography.families.accent,
    fontSize: 8,
    color: '#444',
    lineHeight: 12,
    flex: 1,
  },
  cardChevron: {
    // Style for chevron in cards
  },
  badge: {
    backgroundColor: '#DA5742',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700' as any,
    fontFamily: typography.families.secondary,
  },
});
