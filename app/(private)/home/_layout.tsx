import { Stack } from 'expo-router';
import React from 'react';

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      
      <Stack.Screen name="add-staff" />
      <Stack.Screen name="completed-orders" />
      <Stack.Screen name="customer-details" />
      <Stack.Screen name="customers" />
      <Stack.Screen name="earnings-wallet" />
      <Stack.Screen name="index" />
      <Stack.Screen name="my-staff" />
      <Stack.Screen name="my-stores" />
      <Stack.Screen name="products" />
      <Stack.Screen name="transactions" />
      <Stack.Screen name="view-staff" />

    </Stack>
  );
}
