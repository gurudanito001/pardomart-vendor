import { STORAGE_KEYS } from '../constants';
import { getStorageItem } from '../utils/storage';
import { Configuration } from './configuration';

// API configuration
export const API_BASE_URL = 'https://pardomart-node-api-vaje.onrender.com/api/v1';

// Create and export the API configuration
export const apiConfig = new Configuration({
  basePath: API_BASE_URL,
  // This function will be called before every API request to get the token
  accessToken: async () => {
    // Retrieve the token from async storage
    const token = await getStorageItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return token || ''; // Return the token or an empty string if not found
  },
});

// Function to update the access token
export const setAuthToken = (token: string) => {
  // This function is no longer the primary way to set the token for requests,
  // but can be kept for specific use cases or tests if needed.
  // For dynamic requests, the accessToken function above is used.
};

// Function to clear the access token
export const clearAuthToken = () => {
  // This function is also less critical now, as clearing the token from storage
  // is the main way to "log out" from the API's perspective.
};
