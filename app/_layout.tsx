import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AppProvider } from '@/context/AppProvider';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    'SF Pro': require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Open Sans': require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Raleway': require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Nunito Sans': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <AppProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="vendor/sign-in" />
          <Stack.Screen name="vendor/register" />
          <Stack.Screen name="vendor/verify" />
          <Stack.Screen name="vendor/verified" />
          <Stack.Screen name="vendor/take-photo" />
          <Stack.Screen name="vendor/edit-store" />
          <Stack.Screen name="vendor/online" />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AppProvider>
  );
}
