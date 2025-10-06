import { router } from 'expo-router';
import { Platform } from 'react-native';
import { toast } from './toast';

let firebaseApp: any = null;
let firebaseMessaging: any = null;

const getWebConfig = () => {
  const cfg = (globalThis as any).__FIREBASE_WEB_CONFIG || (globalThis as any).firebaseConfig;
  try {
    // @ts-ignore expo-constants may be unavailable on web build, so guard import
    const Constants = require('expo-constants').default;
    const extra = (Constants?.expoConfig as any)?.extra;
    const fromExtra = extra?.firebaseWeb;
    return fromExtra || cfg || null;
  } catch {
    return cfg || null;
  }
};

export const ensureFirebaseWebApp = async (): Promise<any | null> => {
  if (Platform.OS !== 'web') return null;
  if (firebaseApp) return firebaseApp;
  let config = getWebConfig();

  if (!config && typeof document !== 'undefined') {
    try {
      await new Promise<void>((resolve) => {
        const s = document.createElement('script');
        s.src = '/firebase-web-config.js';
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => resolve();
        document.head.appendChild(s);
      });
      config = getWebConfig();
    } catch {}
  }

  if (!config) return null;

  const appMod = await import('firebase/app');
  const { initializeApp, getApps, getApp } = appMod;
  firebaseApp = getApps().length ? getApp() : initializeApp(config);
  return firebaseApp;
};

export const ensureWebMessaging = async (): Promise<any | null> => {
  if (Platform.OS !== 'web') return null;
  if (firebaseMessaging) return firebaseMessaging;
  const app = await ensureFirebaseWebApp();
  if (!app) return null;

  const { getMessaging, onMessage, getToken, isSupported } = await import('firebase/messaging');
  const supported = await isSupported();
  if (!supported) return null;

  try {
    if ('serviceWorker' in navigator) {
      await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    }
  } catch {}

  firebaseMessaging = { getMessaging, onMessage, getToken };
  return firebaseMessaging;
};

export const initWebPush = async (): Promise<void> => {
  if (Platform.OS !== 'web') return;
  const messagingMod = await ensureWebMessaging();
  const config = getWebConfig();
  if (!messagingMod || !config) return;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      toast.info?.('Notifications are disabled');
      return;
    }

    const registration = await navigator.serviceWorker.getRegistration();
    const token = await messagingMod.getToken(messagingMod.getMessaging(), {
      vapidKey: config.vapidKey,
      serviceWorkerRegistration: registration ?? undefined,
    });
    if (token) {
      // Web token registration with backend can reuse native flow
      // Importing lazily to avoid cycles
      const { registerDeviceWithServer } = await import('./push');
      try { await registerDeviceWithServer(token); } catch {}
    }

    messagingMod.onMessage(messagingMod.getMessaging(), (payload: any) => {
      const title = payload?.notification?.title || 'Notification';
      const body = payload?.notification?.body || '';
      toast.info?.(`${title}\n${body}`);
      const screen = payload?.data?.screen;
      const url = payload?.data?.url;
      if (screen) {
        try { router.push(screen as any); } catch {}
      } else if (url) {
        try { router.push(url as any); } catch {}
      }
    });
  } catch (e) {
    // Silently ignore on web if not configured
  }
};
