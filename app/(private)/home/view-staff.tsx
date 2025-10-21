import { Role, StaffApi, Vendor } from '@/api';
import { apiConfig } from '@/api/config';
import { useAuth } from '@/context/AppProvider';
import { useStaffMember } from '@/hooks/api/useStaff';
import { useVendors } from '@/hooks/api/useVendors';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';
import {
  ArrowBackSVG,
  ChatFilledSVG,
  LocationSVG,
  PhoneOutlineSVG
} from '../../../components/icons';
import NotificationBell from '../../../components/NotificationBell';

export default function ViewShopperScreen() {
  const {fetchVendors} = useVendors();
  const params = useLocalSearchParams();
  const shopperId = params.shopperId as string | undefined;
  const qc = useQueryClient();
  const { state: authState } = useAuth();
  const userId = authState.user?.id;

  const { data: shopper, isLoading, isError, error, refetch, isFetching } = useStaffMember(shopperId);

  // Fetch all vendors for the current user to populate the dropdown
  const { data: vendors, isLoading: isLoadingStores } = useQuery({
    queryKey: ['vendors', userId],
    queryFn: () => fetchVendors({ userId }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!userId,
  });
  const vendorOptions =
    vendors?.data?.map((v: Vendor) => ({ label: v.name, value: v.id })) ?? [];

  const assignedStoreName =
    vendors?.data?.find((v: Vendor) => v.id === shopper?.vendorId)?.name ?? 'N/A';

  const roleOptions = React.useMemo(() => [
    { label: 'Store Admin', value: Role.StoreAdmin },
    { label: 'Store Shopper', value: Role.StoreShopper },
  ], []);

  const assignedRoleName = React.useMemo(() => {
    return roleOptions.find(r => r.value === shopper?.role)?.label ?? 'N/A';
  }, [shopper, roleOptions]);


  // Edit state management
  const [isStoreSelectModalVisible, setStoreSelectModalVisible] = React.useState(false);
  const [selectedStoreId, setSelectedStoreId] = React.useState<string | undefined>(undefined);

  const [isEditingPhone, setIsEditingPhone] = React.useState(false);
  const [tempPhone, setTempPhone] = React.useState<string>('');

  const [isEditingEmail, setIsEditingEmail] = React.useState(false);
  const [tempEmail, setTempEmail] = React.useState<string>('');

  const [isRoleSelectModalVisible, setIsRoleSelectModalVisible] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<Role | undefined>(undefined);

  React.useEffect(() => {
    if (shopper) {
      setSelectedStoreId(shopper.vendorId || undefined);
      setTempPhone(shopper.mobileNumber || '');
      setTempEmail(shopper.email || '');
      setSelectedRole(shopper.role as Role || undefined);
    }
  }, [shopper]);

  // Mutations for updating shopper
  const staffApi = React.useMemo(() => new StaffApi(apiConfig), []);

  const updateMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (!shopperId) throw new Error('Missing staffId');
      const res = await staffApi.staffStaffIdPatch(payload, shopperId);
      return res.data;
    },
    onSuccess: async (data, variables) => {
      toast.success('Updated successfully');
      setStoreSelectModalVisible(false);
      setIsEditingPhone(false);
      setIsEditingEmail(false);
      setIsRoleSelectModalVisible(false);
      // If we are disabling the user, go back after success.
      if (variables.active === false && router.canGoBack()) {
        await qc.invalidateQueries({ queryKey: ['staff'] });
        router.back();
      } else {
        await qc.invalidateQueries({ queryKey: ['staff', 'detail', shopperId] });
        await qc.invalidateQueries({ queryKey: ['staff'] });
      }
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message || e?.message || 'Update failed');
    }
  });

  // Disable staff state
  const [confirmToggleStatusOpen, setConfirmToggleStatusOpen] = React.useState(false);

  const handleGoBack = () => {
    router.back();
  };

  const handleNotifications = () => {};


  const handleChat = () => {
    console.log('Start chat with shopper');
  };

  const handleCall = () => {
    console.log('Call shopper');
  };

  const handleSaveStore = () => {
    if (!selectedStoreId) return;
    updateMutation.mutate({ vendorId: selectedStoreId });
  };

  const handleEditPhone = () => {
    if (!isEditingPhone) setTempPhone(shopper?.mobileNumber || '');
    setIsEditingPhone((v) => !v);
  };

  const handleSavePhone = () => {
    updateMutation.mutate({ mobileNumber: tempPhone });
  };

  const handleSaveRole = () => {
    if (!selectedRole) return;
    updateMutation.mutate({ role: selectedRole });
  };

  const handleEditEmail = () => {
    if (!isEditingEmail) setTempEmail(shopper?.email || '');
    setIsEditingEmail((v) => !v);
  };

  const handleSaveEmail = () => {
    updateMutation.mutate({ email: tempEmail });
  };

  const handleToggleStaffStatus = () => {
    setConfirmToggleStatusOpen(true);
  };

  const confirmToggleStaffStatus = () => {
    if (!shopper) return;
    updateMutation.mutate({ active: !shopper.active });
    setConfirmToggleStatusOpen(false);
  };

  if (!shopperId) {
    return (
      <SafeAreaView style={[styles.container, {justifyContent:'center',alignItems:'center'}]}> 
        <Text style={{color:'#7C8BA0'}}>No shopper selected</Text>
      </SafeAreaView>
    );
  }

  const isBusy = isLoading || isFetching;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#06888C" />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowBackSVG width={30} height={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>View Shopper</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleNotifications} style={styles.headerAction}>
            <NotificationBell from="/(private)/shared/view-shopper" />
          </TouchableOpacity>
            {/* Support icon removed from header (kept only on Help page) */}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isBusy ? (
          <View style={{flex:1,alignItems:'center',justifyContent:'center',paddingVertical:40}}>
            <ActivityIndicator size="large" color="#06888C" />
            <Text style={{marginTop:10,color:'#7C8BA0'}}>Loading shopper...</Text>
          </View>
        ) : isError ? (
          <View style={{flex:1,alignItems:'center',justifyContent:'center',paddingVertical:40}}>
            <Text style={{fontSize:16,fontWeight:'600',color:'#333'}}>Failed to load shopper</Text>
            <Text style={{color:'#7C8BA0',marginTop:8}}>{(error as Error)?.message}</Text>
            <TouchableOpacity onPress={() => refetch()} style={{marginTop:16,paddingHorizontal:16,paddingVertical:8,borderRadius:8,borderWidth:1,borderColor:'#06888C'}}>
              <Text style={{color:'#06888C',fontWeight:'700'}}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              <View style={styles.contactContainer}>
                <Image
                  source={
                    shopper?.image
                      ? { uri: shopper.image as string }
                      : require('../../../assets/images/user profile.png')
                  }
                  style={styles.shopperAvatar}
                />
                <View style={styles.shopperDetails}>
                  <View style={styles.shopperNameRow}>
                    <Text style={styles.shopperName}>{shopper?.name ?? 'Unknown'}</Text>
                    <View style={[styles.statusBadge, shopper?.active ? styles.availableBadge : styles.unavailableBadge]}>
                      <Text style={[styles.statusText, shopper?.active ? styles.availableText : styles.unavailableText]}>
                        {shopper?.active ? 'Active' : 'Disabled'}
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

            <View style={styles.fieldsContainer}>
              {/* Store Assigned */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Store Assigned</Text>
                <View style={styles.fieldInputWithButton}>
                  <View style={styles.addressContainer}>
                    <LocationSVG width={18} height={20} color="black" />
                    <Text style={styles.fieldValue} numberOfLines={1}>
                      {assignedStoreName}
                    </Text>
                  </View>
                  {selectedStoreId && selectedStoreId !== shopper?.vendorId ? (
                    <TouchableOpacity style={styles.editButton} onPress={handleSaveStore} disabled={updateMutation.isPending}>
                      <Text style={styles.editButtonText}>{updateMutation.isPending ? 'Saving...' : 'Save'}</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.editButton} onPress={() => setStoreSelectModalVisible(true)}>
                      <Text style={styles.editButtonText}>Change</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Role */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Role</Text>
                <View style={styles.fieldInputWithButton}>
                  <View style={styles.addressContainer}>
                    <Text style={styles.fieldValue} numberOfLines={1}>
                      {assignedRoleName}
                    </Text>
                  </View>
                  {selectedRole && selectedRole !== shopper?.role ? (
                    <TouchableOpacity style={styles.editButton} onPress={handleSaveRole} disabled={updateMutation.isPending}>
                      <Text style={styles.editButtonText}>{updateMutation.isPending ? 'Saving...' : 'Save'}</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.editButton} onPress={() => setIsRoleSelectModalVisible(true)}>
                      <Text style={styles.editButtonText}>Change</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Phone Number */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Phone Number</Text>
                <View style={styles.fieldInputWithButton}>
                  {isEditingPhone ? (
                    <TextInput
                      style={styles.fieldValue}
                      value={tempPhone}
                      onChangeText={setTempPhone}
                      keyboardType="phone-pad"
                      autoFocus
                    />
                  ) : (
                    <Text style={styles.fieldValue}>{shopper?.mobileNumber ?? 'N/A'}</Text>
                  )}
                  <TouchableOpacity style={styles.editButton} onPress={isEditingPhone ? handleSavePhone : handleEditPhone} disabled={updateMutation.isPending}>
                    <Text style={styles.editButtonText}>{isEditingPhone ? (updateMutation.isPending ? 'Saving...' : 'Save') : 'Edit'}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Email Address */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Email Address</Text>
                <View style={styles.fieldInputWithButton}>
                  {isEditingEmail ? (
                    <TextInput
                      style={styles.fieldValue}
                      value={tempEmail}
                      onChangeText={setTempEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoFocus
                    />
                  ) : (
                    <Text style={styles.fieldValue}>{shopper?.email ?? 'N/A'}</Text>
                  )}
                  <TouchableOpacity style={styles.editButton} onPress={isEditingEmail ? handleSaveEmail : handleEditEmail} disabled={updateMutation.isPending}>
                    <Text style={styles.editButtonText}>{isEditingEmail ? (updateMutation.isPending ? 'Saving...' : 'Save') : 'Edit'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.toggleStatusButton,
                shopper?.active ? styles.deactivateButton : styles.activateButton,
              ]}
              onPress={handleToggleStaffStatus}
            >
              <Text style={styles.toggleStatusButtonText}>{shopper?.active ? 'Deactivate Staff' : 'Activate Staff'}</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Store Select Modal */}
      <Modal transparent visible={isStoreSelectModalVisible} animationType="fade" onRequestClose={() => setStoreSelectModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setStoreSelectModalVisible(false)}>
          <View style={styles.storeSelectModalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Select a Store</Text>
            <ScrollView>
              {vendorOptions.map((opt: any) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.optionItem, selectedStoreId === opt.value && styles.selectedOption]}
                  onPress={() => {
                    setSelectedStoreId(opt.value);
                    setStoreSelectModalVisible(false);
                  }}
                >
                  <Text style={[styles.optionText, selectedStoreId === opt.value && styles.selectedOptionText]}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Role Select Modal */}
      <Modal transparent visible={isRoleSelectModalVisible} animationType="fade" onRequestClose={() => setIsRoleSelectModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsRoleSelectModalVisible(false)}>
          <View style={styles.storeSelectModalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Select a Role</Text>
            <ScrollView>
              {roleOptions.map((opt: any) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.optionItem, selectedRole === opt.value && styles.selectedOption]}
                  onPress={() => {
                    setSelectedRole(opt.value);
                    setIsRoleSelectModalVisible(false);
                  }}
                >
                  <Text style={[styles.optionText, selectedRole === opt.value && styles.selectedOptionText]}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Confirmation Modal */}
      <Modal transparent visible={confirmToggleStatusOpen} animationType="fade" onRequestClose={() => setConfirmToggleStatusOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{shopper?.active ? 'Deactivate Staff?' : 'Activate Staff?'}</Text>
            <Text style={styles.modalMessage}>
              {shopper?.active ? 'This will revoke their access. Are you sure?' : 'This will restore their access. Are you sure?'}
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#E5E7EB' }]} onPress={() => setConfirmToggleStatusOpen(false)}>
                <Text style={[styles.modalButtonText, { color: '#111827' }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, shopper?.active ? { backgroundColor: '#C70000' } : { backgroundColor: '#06888C' }]}
                onPress={confirmToggleStaffStatus} disabled={updateMutation.isPending}>
                <Text style={styles.modalButtonText}>{updateMutation.isPending ? 'Processing...' : (shopper?.active ? 'Deactivate' : 'Activate')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    width: 70,
    height: 70,
    borderRadius: 35,
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
  toggleStatusButton: {
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 16,
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
  deactivateButton: {
    backgroundColor: '#C70000',
  },
  activateButton: {
    backgroundColor: '#06888C',
  },
  toggleStatusButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
    lineHeight: 25,
    textAlign: 'center',
  },
  // Simple select styles
  selectBox: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#FFF',
    marginBottom: 8,
  },
  optionList: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFF',
    maxHeight: 160,
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionText: {
    fontSize: 14,
    color: '#111827',
  },
  selectedOption: {
    backgroundColor: '#06888C',
  },
  selectedOptionText: {
    color: '#FFF',
    fontWeight: '600',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#FFF',
    padding: 16,
  },
  storeSelectModalContent: {
    width: '100%',
    maxHeight: '60%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  modalMessage: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#FFF',
    fontWeight: '700',
  },
});
