import { Stack } from 'expo-router';
import React from 'react';

export default function StoreLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="add-store" />
      <Stack.Screen name="edit-store" />
      <Stack.Screen name="upload-documents" />
      <Stack.Screen name="document-verification" />
      <Stack.Screen name="unpublished-store" />
      <Stack.Screen name="select-category" />
      <Stack.Screen name="add-product" />
      <Stack.Screen name="fully-set-up-store" />
    </Stack>
  );
}
