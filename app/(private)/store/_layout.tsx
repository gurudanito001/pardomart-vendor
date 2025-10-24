import { Stack } from 'expo-router';
import React from 'react';

export default function StoreLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      
      <Stack.Screen name="add-products" />
      <Stack.Screen name="add-staff" />
      <Stack.Screen name="add-store" />
      <Stack.Screen name="document-verification" />
      <Stack.Screen name="edit-product" />
      <Stack.Screen name="edit-store" />
      <Stack.Screen name="fully-set-up-store" />
      <Stack.Screen name="index" />
      <Stack.Screen name="store-customers" />
      <Stack.Screen name="store-homepage" />
      <Stack.Screen name="store-products" />
      <Stack.Screen name="store-staff" />
      <Stack.Screen name="store-transactions" />
      <Stack.Screen name="upload-documents" />
      <Stack.Screen name="view-product" />
      <Stack.Screen name="view-staff" />

    </Stack>
  );
}
