import { User } from '@/api';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { ArrowBackSVG, NotificationSVG, SupportSVG } from '../../../components/icons';

const MOCK_SHOPPERS: User[] = [
  {
    id: '1',
    name: 'Mr Damilare Adebanjo',
    email: 'damilareadebanjo@gmail.com',
    mobileNumber: '+1 334 654 7788',
  },
  {
    id: '2',
    name: 'Magrett Kingsley',
    email: 'damilareadebanjo@gmail.com',
    mobileNumber: '+1 334 654 7788',
  },
  {
    id: '3',
    name: 'Magrett Kingsley',
    email: 'damilareadebanjo@gmail.com',
    mobileNumber: '+1 334 654 7788',
  },
  {
    id: '4',
    name: 'Mr Damilare Adebanjo',
    email: 'damilareadebanjo@gmail.com',
    mobileNumber: '+1 334 654 7788'
  },
  {
    id: '5',
    name: 'Mr Damilare Adebanjo',
    email: 'damilareadebanjo@gmail.com',
    mobileNumber: '+1 334 654 7788',
  },
];

export default function MyShoppersScreen() {
  const handleGoBack = () => {
    router.back();
  };

  const handleNotifications = () => {
    console.log('Open notifications');
  };

  const handleSupport = () => {
    console.log('Open support');
  };

  const handleShopperPress = (shopperId?: string) => {
    if (!shopperId) return;
    router.push(`/(private)/home/view-shopper?shopperId=${shopperId}`);
  };

  const handleAddShopper = () => {
    console.log('Add new shopper');
    // Navigate to add shopper page
  };

  const ShopperCard = ({ shopper }: { shopper: User }) => (
    <TouchableOpacity 
      style={styles.shopperCard} 
      onPress={() => handleShopperPress(shopper?.id)}
    >
      <View style={styles.shopperContent}>
        <Image 
          source={require('../../../assets/images/user profile.png')}
          style={styles.shopperAvatar}
        />
        <View style={styles.shopperInfo}>
          <View style={styles.shopperDetails}>
            <Text style={styles.shopperName}>{shopper.name}</Text>
            <View style={[
              styles.statusBadge, styles.availableBadge 
              ]}>
              <Text style={[
                styles.statusText,
                styles.statusBadge, styles.availableBadge 
              ]}>
              </Text>
            </View>
          </View>
          <Svg width="7" height="13" viewBox="0 0 7 13" fill="none">
            <Path d="M0.866949 12.4985C0.66474 12.4988 0.468777 12.4292 0.313076 12.3017C0.225444 12.2299 0.153007 12.1418 0.0999113 12.0423C0.0468157 11.9428 0.0141058 11.8339 0.00365506 11.7219C-0.0067957 11.6098 0.00521815 11.4969 0.0390082 11.3895C0.0727983 11.2821 0.1277 11.1823 0.200571 11.0958L4.07768 6.51173L0.339039 1.91906C0.267152 1.83158 0.213468 1.73092 0.181074 1.62286C0.148679 1.51481 0.138213 1.4015 0.150276 1.28944C0.16234 1.17738 0.196694 1.06878 0.251367 0.969879C0.306039 0.870982 0.379951 0.783737 0.468853 0.713159C0.558395 0.635301 0.663255 0.576573 0.776853 0.540662C0.89045 0.504751 1.01033 0.492432 1.12898 0.504478C1.24762 0.516525 1.36246 0.552676 1.4663 0.610663C1.57014 0.66865 1.66072 0.747221 1.73237 0.841446L5.91238 5.97292C6.03967 6.12596 6.10925 6.31791 6.10925 6.51601C6.10925 6.7141 6.03967 6.90606 5.91238 7.05909L1.58525 12.1906C1.49843 12.2941 1.38815 12.3759 1.26335 12.4294C1.13854 12.4829 1.00274 12.5065 0.866949 12.4985Z" fill="#333333"/>
          </Svg>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#06888C" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.leftSection}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <ArrowBackSVG width={30} height={30} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Shoppers</Text>
          </View>
          <View style={styles.rightSection}>
            <TouchableOpacity style={styles.iconButton} onPress={handleNotifications}>
              <NotificationSVG width={24} height={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleSupport}>
              <SupportSVG width={24} height={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Shoppers Count */}
          <Text style={styles.shoppersCount}>You have 5 shoppers</Text>

          {/* Shoppers List */}
          <View style={styles.shoppersList}>
            {MOCK_SHOPPERS.map((shopper) => (
              <ShopperCard key={shopper.id} shopper={shopper} />
            ))}
          </View>

          {/* Add Shopper Button */}
          <TouchableOpacity style={styles.addShopperButton} onPress={handleAddShopper}>
            <Text style={styles.addShopperText}>Add Shopper</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 20,
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
    paddingTop: 24,
    paddingBottom: 30,
  },
  shoppersCount: {
    fontSize: 16,
    fontWeight: '700',
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
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#000',
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
    fontWeight: '700',
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
    paddingHorizontal: 50,
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
});
