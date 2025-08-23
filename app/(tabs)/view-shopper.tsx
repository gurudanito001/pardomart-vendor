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
  ArrowBackSVG,
  ChatFilledSVG,
  LocationSVG,
  NotificationSVG,
  PhoneOutlineSVG,
  SupportSVG
} from '../../components/icons';
import { Shopper } from '../../types';

export default function ViewShopperScreen() {
  const params = useLocalSearchParams();
  const shopperId = params.shopperId as string;

  // Mock shopper data - in a real app, you'd fetch this based on shopperId
  const shopper: Shopper = {
    id: shopperId || '1',
    name: 'Mr Damilare Adebanjo',
    email: 'damilareadebanjo@gmail.com',
    phone: '+1 334 654 7788',
    storeAddress: '450 South Cradle Avenue, Chicago, IL',
    isAvailable: true,
    avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/3903888e367800e286fd49d74addfae6ead15583?width=168',
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleNotifications = () => {
    console.log('Open notifications');
  };

  const handleSupport = () => {
    console.log('Open support');
  };

  const handleChat = () => {
    console.log('Start chat with shopper');
  };

  const handleCall = () => {
    console.log('Call shopper');
  };

  const handleChangeStore = () => {
    console.log('Change store assignment');
  };

  const handleEditPhone = () => {
    console.log('Edit phone number');
  };

  const handleEditEmail = () => {
    console.log('Edit email address');
  };

  const handleDeleteShopper = () => {
    console.log('Delete shopper');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#06888C" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowBackSVG width={30} height={30} color="white" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>View Shopper</Text>
        
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
        {/* Contact Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.contactContainer}>
            <Image source={{ uri: shopper.avatar }} style={styles.shopperAvatar} />
            <View style={styles.shopperDetails}>
              <View style={styles.shopperNameRow}>
                <Text style={styles.shopperName}>{shopper.name}</Text>
                <View style={[
                  styles.statusBadge, 
                  shopper.isAvailable ? styles.availableBadge : styles.unavailableBadge
                ]}>
                  <Text style={[
                    styles.statusText,
                    shopper.isAvailable ? styles.availableText : styles.unavailableText
                  ]}>
                    {shopper.isAvailable ? 'Available' : 'Not available'}
                  </Text>
                </View>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.chatButton} onPress={handleChat}>
                  <ChatFilledSVG width={30} height={30} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.phoneButton} onPress={handleCall}>
                  <PhoneOutlineSVG width={30} height={30} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Store Assigned Field */}
        <View style={styles.fieldsContainer}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Store Assigned</Text>
            <View style={styles.fieldInputWithButton}>
              <View style={styles.addressContainer}>
                <LocationSVG width={18} height={20} color="black" />
                <Text style={styles.fieldValue}>{shopper.storeAddress}</Text>
              </View>
              <TouchableOpacity style={styles.editButton} onPress={handleChangeStore}>
                <Text style={styles.editButtonText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Phone Number</Text>
            <View style={styles.fieldInputWithButton}>
              <Text style={styles.fieldValue}>{shopper.phone}</Text>
              <TouchableOpacity style={styles.editButton} onPress={handleEditPhone}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Email Address</Text>
            <View style={styles.fieldInputWithButton}>
              <Text style={styles.fieldValue}>{shopper.email}</Text>
              <TouchableOpacity style={styles.editButton} onPress={handleEditEmail}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Delete Shopper Button */}
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteShopper}>
          <Text style={styles.deleteButtonText}>Delete Shopper</Text>
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
    paddingHorizontal: 22,
  },
  section: {
    paddingTop: 17,
    marginBottom: 54,
  },
  sectionTitle: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    lineHeight: 19,
    marginBottom: 18,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  shopperAvatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
  },
  shopperDetails: {
    flex: 1,
    gap: 12,
  },
  shopperNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shopperName: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#000',
    lineHeight: 16,
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
  },
  availableBadge: {
    backgroundColor: 'rgba(44, 175, 11, 0.15)',
  },
  unavailableBadge: {
    backgroundColor: 'rgba(255, 0, 0, 0.15)',
  },
  statusText: {
    fontSize: 8,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    lineHeight: 10,
  },
  availableText: {
    color: '#2CAF0B',
  },
  unavailableText: {
    color: '#FF0000',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  chatButton: {
    width: 30,
    height: 30,
  },
  phoneButton: {
    width: 30,
    height: 30,
  },
  fieldsContainer: {
    gap: 22,
    marginBottom: 54,
  },
  fieldGroup: {
    gap: 9,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#000',
    lineHeight: 16,
  },
  fieldInputWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#F0F8F8',
    gap: 34,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  fieldValue: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#000',
    lineHeight: 13,
    flex: 1,
  },
  editButton: {
    paddingHorizontal: 21,
    paddingVertical: 9,
    borderRadius: 16,
    backgroundColor: '#06888C',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 9,
    elevation: 2,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
    lineHeight: 16,
  },
  deleteButton: {
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 16,
    backgroundColor: '#C70000',
    alignItems: 'center',
    justifyContent: 'center',
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
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
    lineHeight: 25,
    textAlign: 'center',
  },
});
