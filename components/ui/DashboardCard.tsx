import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type Props = {
  title: string;
  subtitle: string;
  iconComponent: React.ReactNode;
  onPress?: () => void;
  style?: any;
};

export default function DashboardCard({ title, subtitle, iconComponent, onPress, style }: Props) {
  return (
    <TouchableOpacity style={[styles.dashboardCard, style]} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cardContent}>
        <View style={styles.cardIconContainer}>{iconComponent}</View>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{title}</Text>
          <View style={styles.cardSubtitleContainer}>
            <Text style={styles.cardSubtitle}>{subtitle}</Text>
            <View style={styles.arrowIcon}>
              <Svg width={12} height={24} viewBox="0 0 12 24" fill="none">
                <Path fillRule="evenodd" clipRule="evenodd" d="M10.1569 12.711L4.49994 18.368L3.08594 16.954L8.03594 12.004L3.08594 7.054L4.49994 5.64L10.1569 11.297C10.3444 11.4845 10.4497 11.7388 10.4497 12.004C10.4497 12.2692 10.3444 12.5235 10.1569 12.711Z" fill="#484C52" />
              </Svg>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  dashboardCard: {
    flex: 1,
    height: 158,
    borderRadius: 16,
    backgroundColor: '#F0F8F8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardContent: {
    padding: 16,
    paddingBottom: 18,
    flex: 1,
    gap: 15,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(6, 136, 140, 0.30)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTextContainer: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#000',
    lineHeight: 22,
  },
  cardSubtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  cardSubtitle: {
    flex: 1,
    fontSize: 8,
    fontWeight: '400',
    fontFamily: 'Raleway',
    color: '#444',
    lineHeight: 12,
  },
  arrowIcon: {
    width: 12,
    height: 24,
  },
});
