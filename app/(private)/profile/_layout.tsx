import { Stack } from 'expo-router';
import React from 'react';

export default function OrdersLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="editProfile" />
      <Stack.Screen name="myPayments" />
      <Stack.Screen name="privacyPolicy" />
      <Stack.Screen name="termsCondition" />
      <Stack.Screen name="wallet" />
    </Stack>
  );
}
