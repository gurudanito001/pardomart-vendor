import NotificationBell from '@/components/NotificationBell';
import { useAuth } from '@/context/AppProvider';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

interface MenuItemProps {
  title: string;
  icon: string;
  onPress: () => void;
  isLogout?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ title, icon, onPress, isLogout = false }) => (
  <Pressable style={[styles.menuItem, isLogout && styles.logoutItem]} onPress={onPress}>
    <View style={styles.menuItemLeft}>
      <Ionicons name={icon as any} size={24} color={"#000"} />
      <Text style={[styles.menuItemText, isLogout && styles.logoutText]}>{title}</Text>
    </View>
    {!isLogout && <Ionicons name="chevron-forward" size={24} color="#000" />}
  </Pressable>
);

interface MenuSectionProps {
  children: React.ReactNode;
  style?: any;
}

const MenuSection: React.FC<MenuSectionProps> = ({ children, style }) => (
  <View style={[styles.menuSection, style]}>{children}</View>
);

const ProfileScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state, logout, initializeAuth } = useAuth();
  const { user, isLoading: authLoading } = state;
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleGoBack = () => router.back();
  const handleScroll = (event: any) => {
    const y = event?.nativeEvent?.contentOffset?.y;
    setIsScrolled(typeof y === 'number' && y > 130);
  };
  const handleRefresh = async () => {
    await initializeAuth();
  };
  
  // Navigation handlers
  const handleNotifications = () => router.push({ pathname: '/shared/notifications', params: { from: '/profile/profile' } });
  const handleEditProfile = () => router.push('/profile/editProfile');
  const handleMyPayment = () => router.push('/profile/myPayments');
  const handleTermsCondition = () => router.push('/profile/termsCondition');
  const handlePrivacyPolicy = () => router.push('/profile/privacyPolicy');
  const handleWallet = () => router.push('/profile/wallet');
  const handleSettings = () => console.log('Settings');

  // Implemented Logout Functionality
  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    setLogoutModalVisible(false);
    try {
      await logout();
    } catch (error: any) {
      console.error('Failed to sign out:', error);
    }
  };

  if (authLoading && !user) {
    return (
      <SafeAreaView style={styles.container} edges={['top','left','right']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F48022" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['top','left','right']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unable to load profile. Please try again.</Text>
          <Pressable style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top','left','right']}>
      <View style={[
        styles.header, 
        isScrolled && styles.scrolledHeader,
        // Apply padding dynamically to respect the device's status bar/notch area
        { paddingTop: insets.top + 10 }
      ]}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="chevron-back" size={24} color="#100A37" />
          </Pressable>
          <Text style={styles.headerTitle}>Account</Text>
        </View>
        <NotificationBell from="/profile/profile" />
      </View>

      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={authLoading} onRefresh={handleRefresh} tintColor="#F48022" />}
      >
        <View style={styles.profileContainer}>
          <View style={styles.profileBackground} />
          <View style={styles.profileContent}>
            <View style={styles.profileImageContainer}>
              <View style={styles.profileImage}>
                <Image
                source={require("../../../assets/images/user profile.png")}
                style={styles.profileImage}
                resizeMode="contain"
              />
              </View>
              {authLoading && (
                <View style={styles.profileLoadingOverlay}><ActivityIndicator size="small" color="#F48022" /></View>
              )}
            </View>
            <Text style={styles.userName}>{user.name || 'No Name'}</Text>
            <Text style={styles.userEmail}>{user.email || user.mobileNumber || 'No Contact Information'}</Text>
            {user.isMobileVerified === false && (
              <Text style={styles.verificationStatus}>Mobile number not verified</Text>
            )}
          </View>
        </View>

        <MenuSection>
          <MenuItem title="Edit Profile" icon="person-circle-outline" onPress={handleEditProfile} />
          <MenuItem title="My Payment" icon="card-outline" onPress={handleMyPayment} />
          <MenuItem title="My Wallet" icon="wallet-outline" onPress={handleWallet} />
        </MenuSection>

        <MenuSection>
          <MenuItem title="Terms & Condition" icon="document-text-outline" onPress={handleTermsCondition} />
          <MenuItem title="Privacy Policy" icon="shield-checkmark-outline" onPress={handlePrivacyPolicy} />
        </MenuSection>

        <MenuSection style={styles.lastSection}>
          <MenuItem title="Settings" icon="settings-outline" onPress={handleSettings} />
          <MenuItem title="Logout" icon="log-out-outline" onPress={handleLogout} isLogout={true} />
        </MenuSection>
      </ScrollView>

      <Modal
        transparent
        visible={logoutModalVisible}
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.confirmModalOverlay}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.confirmModalTitle}>Confirm Logout</Text>
            <Text style={styles.confirmModalMessage}>
              Are you sure you want to log out?
            </Text>
            <View style={styles.confirmModalActions}>
              <TouchableOpacity style={styles.confirmCancelButton} onPress={() => setLogoutModalVisible(false)}>
                <Text style={styles.confirmCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmLogoutButton} onPress={confirmLogout}>
                <Text style={styles.confirmLogoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileBackground: {
    backgroundColor: '#06888C',
    width: '100%',
    height: 160,
    position: 'absolute',
    top: 0,
  },
  profileContent: {
    alignItems: 'center',
    paddingTop: 104, 
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 21,
    width: '100%',
    backgroundColor: 'transparent',
    paddingBottom: 5,
    position: 'absolute',
    top: 0,
    zIndex: 10,
  },
  scrolledHeader: {
    backgroundColor: '#FFF',
  },
  headerLeft: {
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
    fontFamily: 'Raleway-Bold',
    color: '#000',
  },
  notificationButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: 'transparent',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  userName: {
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'Raleway-Bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Raleway-Regular',
    color: '#999',
    textAlign: 'center',
  },
  menuSection: {
    marginHorizontal: 21,
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: '#F0F8F8',
    padding: 10,
  },
  lastSection: {
    marginBottom: 40,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 10,
  },
  logoutItem: {
    marginBottom: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Raleway-SemiBold',
    color: '#000',
  },
  logoutText: {
    color: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Raleway-Medium',
    color: '#7C7B7B',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Raleway-Medium',
    color: '#FF5630',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#F48022',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Raleway-SemiBold',
    color: '#FFF',
  },

  profileLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verificationStatus: {
    fontSize: 11,
    fontWeight: '500',
    fontFamily: 'Raleway-Medium',
    color: '#FF5630',
    textAlign: 'center',
    marginTop: 4,
    backgroundColor: '#FFF2F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  confirmModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmModalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  confirmModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Raleway-Bold',
    color: '#100A37',
    marginBottom: 8,
  },
  confirmModalMessage: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: '#484C52',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  confirmModalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F0F0F1',
    alignItems: 'center',
    marginRight: 8,
  },
  confirmCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Raleway-SemiBold',
    color: '#484C52',
  },
  confirmLogoutButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#DA5742',
    alignItems: 'center',
    marginLeft: 8,
  },
  confirmLogoutButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway-Bold',
    color: '#FFF',
  },
});

export default ProfileScreen;