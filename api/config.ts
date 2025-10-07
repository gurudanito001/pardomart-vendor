import axios from 'axios';
import { STORAGE_KEYS } from '../constants';
import { getStorageItem } from '../utils/storage';
import { Configuration } from './configuration';

// API configuration
export const API_BASE_URL = 'https://pardomart-node-api-vaje.onrender.com/api/v1';

// Ensure multipart/form-data boundary is set correctly by the runtime
axios.interceptors.request.use((config) => {
  const hasFormData = typeof FormData !== 'undefined' && config?.data instanceof FormData;
  if (hasFormData && config.headers) {
    // Let the browser/axios set the correct Content-Type with boundary
    delete (config.headers as any)['Content-Type'];
    delete (config.headers as any)['content-type'];
  }
  return config;
});

// Create and export the API configuration
export const apiConfig = new Configuration({
  basePath: API_BASE_URL,
  accessToken: async () => {
    const token = await getStorageItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return token || '';
  },
});

export const setAuthToken = (token: string) => {
  // Kept for potential explicit overrides
};

export const clearAuthToken = () => {
  // Clearing is handled via storage utilities
};
