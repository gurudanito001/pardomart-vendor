import { Role } from '@/api/models';
import { useAuth } from '@/context/AppProvider';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import DashboardScreen from './dashboard';

export default function HomePage() {
  const router = useRouter();
  const { state } = useAuth();
  const { user, isReady } = state;

  const params = useLocalSearchParams<{
    storeId?: string | string[];
    fromIncompleteSetup?: string | string[];
  }>();
  
  const storeIdParam = params.storeId;
  const effectiveStoreId = Array.isArray(storeIdParam) ? storeIdParam[0] : storeIdParam;
  const isValidStoreIdParam = typeof effectiveStoreId === 'string' && effectiveStoreId.length > 0 && effectiveStoreId !== 'undefined';

  useEffect(() => {
    // If the user is not a vendor and the storeId is missing, redirect with it.
    if (isReady && user?.role !== Role.Vendor && !isValidStoreIdParam && user?.vendorId) {
      router.replace(`/(private)/home?storeId=${user.vendorId}`);
    }
  }, [isReady, user?.role, user?.vendorId, isValidStoreIdParam, router]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (user?.role === Role.Vendor) {
    return <DashboardScreen />;
  }

  if ((user?.role as Role) !== Role.Vendor && isValidStoreIdParam) {
    return <Redirect href={`/(private)/store/store-homepage?storeId=${effectiveStoreId}`} />;
  }

}