import { Stack } from 'expo-router';
import React from 'react';



export default function SharedStackLayout() {

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="notifications"
      />
    </Stack>
    
  );
}