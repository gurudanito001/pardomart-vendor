import { Role, StaffApi, type StaffPostRequest } from '@/api';
import { apiConfig } from '@/api/config';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useVendor } from '@/hooks/api/useVendors';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { ArrowBackSVG } from '../../../components/icons';

export default function AddStaffScreen() {
  const params = useLocalSearchParams<{ storeId?: string | string[] }>();
  const storeIdFromParam = useMemo(() => {
    const value = params.storeId;
    return Array.isArray(value) ? value[0] : value;
  }, [params.storeId]);

  const qc = useQueryClient();
  const staffApi = useMemo(() => new StaffApi(apiConfig), []);

  const { getVendorById } = useVendor();

  const { data: vendor, isLoading: vendorLoading, isError: vendorError } = useQuery({
    queryKey: ['vendor', storeIdFromParam],
    queryFn: () => getVendorById(storeIdFromParam!),
    enabled: !!storeIdFromParam,
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | undefined>();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const roleOptions = useMemo(() => [
    { label: 'Store Admin', value: Role.StoreAdmin },
    { label: 'Store Shopper', value: Role.StoreShopper },
  ], []);

  const selectedRoleName = useMemo(() => {
    return roleOptions.find(r => r.value === selectedRole)?.label ?? 'Select a role';
  }, [roleOptions, selectedRole]);

  const createMutation = useMutation({
    mutationFn: async (payload: StaffPostRequest & { role: Role }) => {
      return staffApi.staffPost(payload as any);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['staff', storeIdFromParam] }); // Invalidate staff for the specific store
      await qc.invalidateQueries({ queryKey: ['staff'] }); // Invalidate general staff list
      router.back();
    },
    onError: (e: any) => {
      setError(e?.message ?? 'Failed to add staff');
    },
  });

  const handleGoBack = () => router.back();

  const canSubmit = name.trim().length > 0 && email.trim().length > 0 && mobileNumber.trim().length > 0 && !!storeIdFromParam && !!selectedRole;

  const handleCreate = () => {
    setError(null);
    if (!canSubmit) {
      setError('Please fill all fields');
      return;
    }
    const payload: StaffPostRequest & { role: Role } = {
      name: name.trim(),
      email: email.trim(),
      mobileNumber: mobileNumber.trim(),
      vendorId: storeIdFromParam!,
      role: selectedRole!,
    } as any;
    createMutation.mutate(payload);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#06888C" />

      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowBackSVG width={30} height={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Staff</Text>
        <View style={{ width: 30 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={{ flex: 1 }}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Store Assigned</Text>
              <View style={styles.readonlyField}> 
                <Text style={styles.readonlyText}>
                  {vendor ? vendor.name : vendorLoading ? 'Loading store...' : (storeIdFromParam || 'No store selected')}
                </Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Role</Text>
              <TouchableOpacity style={styles.selectField} onPress={() => setIsModalVisible(true)}>
                <Text style={styles.selectFieldText}>
                  {selectedRoleName}
                </Text>
                <Svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <Path d="M1 1.5L6 6.5L11 1.5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </TouchableOpacity>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <Input placeholder="Enter staff name" value={name} onChangeText={setName} autoCapitalize="words" returnKeyType="next" />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              <Input placeholder="e.g. +1 555 123 4567" keyboardType="phone-pad" value={mobileNumber} onChangeText={setMobileNumber} returnKeyType="next" />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              <Input placeholder="user@example.com" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} returnKeyType="done" />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Button title="Create Staff" onPress={handleCreate} loading={createMutation.isPending} disabled={!canSubmit || createMutation.isPending} fullWidth style={styles.submitButton} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal transparent visible={isModalVisible} animationType="fade" onRequestClose={() => setIsModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsModalVisible(false)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Select a Role</Text>
            <ScrollView>
              {roleOptions.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.optionItem, selectedRole === opt.value && styles.selectedOption]}
                  onPress={() => {
                    setSelectedRole(opt.value);
                    setIsModalVisible(false);
                  }}
                >
                  <Text style={[styles.optionText, selectedRole === opt.value && styles.selectedOptionText]}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
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
  form: {
    paddingTop: 17,
    paddingBottom: 40,
    gap: 18,
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
  readonlyField: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#F0F8F8',
  },
  readonlyText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#000',
    lineHeight: 13,
  },
  selectField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#FFF',
    height: 50,
  },
  selectFieldText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#000',
    lineHeight: 13,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E94435',
    fontFamily: 'Open Sans',
  },
  submitButton: {
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
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
    textAlign: 'center',
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    borderRadius: 8,
    marginVertical: 2,
  },
  optionText: {
    fontSize: 14,
    color: '#111827',
    fontFamily: 'Open Sans',
  },
  selectedOption: {
    backgroundColor: '#06888C',
  },
  selectedOptionText: {
    color: '#FFF',
    fontWeight: '600',
  },
});
