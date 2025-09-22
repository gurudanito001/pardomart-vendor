import { Stack } from 'expo-router';
import React from 'react';

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="setting-up-store" />
      <Stack.Screen name="my-shoppers" />
      <Stack.Screen name="earnings-wallet" />
      <Stack.Screen name="transactions" />
      <Stack.Screen name="customers" />
      <Stack.Screen name="my-stores" />
      <Stack.Screen name="completed-orders" />
      <Stack.Screen name="view-shopper" />
      <Stack.Screen name="customer-details" />
    </Stack>
  );
}
