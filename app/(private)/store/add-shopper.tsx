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
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowBackSVG, NotificationSVG, SupportSVG } from '../../../components/icons';

export default function AddShopperScreen() {
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

  const createMutation = useMutation({
    mutationFn: async (payload: StaffPostRequest & { role: Role }) => {
      return staffApi.staffPost(payload as any);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['staff', storeIdFromParam] });
      router.replace({ pathname: '/(private)/home/my-shoppers', params: { storeId: storeIdFromParam } } as any);
    },
    onError: (e: any) => {
      setError(e?.message ?? 'Failed to add shopper');
    },
  });

  const handleGoBack = () => router.back();
  const handleNotifications = () => router.push('/(private)/shared/notifications' as any);
  const handleSupport = () => {};

  const canSubmit = name.trim().length > 0 && email.trim().length > 0 && mobileNumber.trim().length > 0 && !!storeIdFromParam;

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
      role: Role.VendorStaff,
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
        <Text style={styles.headerTitle}>Add Shopper</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleNotifications} style={styles.headerAction}>
            <NotificationSVG width={24} height={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSupport} style={styles.headerAction}>
            <SupportSVG width={24} height={24} color="white" />
          </TouchableOpacity>
        </View>
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
              <Text style={styles.fieldLabel}>Full Name</Text>
              <Input placeholder="Enter shopper name" value={name} onChangeText={setName} autoCapitalize="words" returnKeyType="next" />
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

            <Button title="Create Shopper" onPress={handleCreate} loading={createMutation.isPending} disabled={!canSubmit || createMutation.isPending} fullWidth style={styles.submitButton} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  errorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E94435',
    fontFamily: 'Open Sans',
  },
  submitButton: {
    marginTop: 12,
  },
});
