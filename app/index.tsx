import { useAuth } from '@/context/AuthContext';
import { router, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import SplashScreen from '../components/splashScreen';

const Index = () => {
  const { state } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    console.log('Auth State:', state);
    console.log('Current Segments:', segments);
    // Only run this logic if we are at the root of the app.
    if (segments.length > 0) return;

    if (state.isReady) {
      if (state.isAuthenticated) {
        router.replace('/(private)/home');
      } else if (state.isRegistered) {
        router.replace('/auth/sign-in');
      } else {
        router.replace('/auth/online');
      }
    }
  }, [state.isReady, state.isAuthenticated, state.isRegistered, segments]);

  return (
    <SplashScreen />
  );
};


export default Index;
