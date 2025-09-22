import { Stack } from 'expo-router';
import React from 'react';

export default function OrdersLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="order-details" />
      <Stack.Screen name="finding-item" />
      <Stack.Screen name="finding-items" />
      <Stack.Screen name="item-substitution" />
      <Stack.Screen name="complete-shopping" />
      <Stack.Screen name="success" />
      <Stack.Screen name="preview-page" />
      <Stack.Screen name="shopping-list" />
      <Stack.Screen name="verify-order-code" />
      <Stack.Screen name="order-verified" />
      <Stack.Screen name="completed-list" />
      <Stack.Screen name="remaining-list" />
    </Stack>
  );
}
