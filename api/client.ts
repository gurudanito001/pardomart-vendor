import { config } from '../config/environment';
import { STORAGE_KEYS } from '../constants';
import { getStorageItem } from '../utils/storage';
import { Configuration } from './configuration';
import { AuthApiFactory } from './endpoints/auth-api';
import { NotificationApiFactory } from './endpoints/notification-api';
import { VendorApiFactory } from './endpoints/vendor-api';

// Lazily create a configuration that reads the latest token from storage
function createConfiguration() {
  return new Configuration({
    basePath: config.API_BASE_URL,
    accessToken: async () => {
      const token = await getStorageItem<string>(STORAGE_KEYS.AUTH_TOKEN);
      return token || '';
    },
    baseOptions: {
      headers: {
        Accept: 'application/json',
      },
    },
  });
}

export function vendorApi() {
  const configuration = createConfiguration();
  return VendorApiFactory(configuration);
}

export function authApi() {
  const configuration = createConfiguration();
  return AuthApiFactory(configuration);
}

export function notificationApi() {
  const configuration = createConfiguration();
  return NotificationApiFactory(configuration);
}


