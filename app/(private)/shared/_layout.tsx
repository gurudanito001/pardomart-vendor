import { Stack } from 'expo-router';
import React from 'react';



export default function SharedStackLayout() {

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="notifications" />
      <Stack.Screen name="my-shoppers" />
      <Stack.Screen name="view-shopper" />
      <Stack.Screen name="customers" />
      <Stack.Screen name="customer-details" />
    </Stack>
    
  );
}
