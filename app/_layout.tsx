import 'react-native-gesture-handler';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AppProvider, useAuth } from '@/context/AppProvider';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Slot, SplashScreen, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster as Sonner } from '@/sonner';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayout() {
  const { state } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Wait until the auth state is fully loaded
    if (!state.isReady) {
      return;
    }

    const inAuthGroup = segments[0] === 'auth'; // e.g. /auth/sign-in
    const inAppGroup = segments[0] === '(private)';

    if (state.isAuthenticated && !inAppGroup) {
      // If the user is authenticated and tries to access an auth screen,
      // or is not in the main app group, redirect them to the home screen.
      router.replace('/(private)/home');
    } else if (!state.isAuthenticated && inAppGroup) {
      // If the user is not authenticated and is trying to access a private screen,
      // redirect them to the sign-in screen. This is the primary protection.
      router.replace('/auth/sign-in');
    }

    // Hide the splash screen once we are ready and fonts are loaded.
    if (state.isReady) {
      SplashScreen.hideAsync();
    }

  }, [state.isReady, state.isAuthenticated, segments, router]);

  // Render nothing until the auth state is determined and redirection is complete.
  // This prevents a flash of the wrong screen.
  if (!state.isReady) {
    return null;
  }

  return <Slot />;
}

export default function AppLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    "OpenSans-Regular": require("../assets/fonts/OpenSans-Regular.ttf"),
    "OpenSans-SemiBold": require("../assets/fonts/OpenSans-SemiBold.ttf"),
    "Raleway-Bold": require("../assets/fonts/Raleway-Bold.ttf"),
    "Raleway-SemiBold": require("../assets/fonts/Raleway-SemiBold.ttf"),
    "Raleway-Regular": require("../assets/fonts/Raleway-Regular.ttf"),
  });



  if (!loaded) {
    return null;
  }
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <QueryClientProvider client={queryClient}>
            <AppProvider>
              <ThemeProvider
                value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
              >
                <StatusBar style="auto" />
                <RootLayout />
                <Sonner position="bottom-center" theme={colorScheme === 'dark' ? 'dark' : 'light'} />
              </ThemeProvider>
            </AppProvider>
          </QueryClientProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
