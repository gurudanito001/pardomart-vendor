import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Set an item in AsyncStorage
 * @param key Storage key
 * @param value Value to store (will be JSON stringified)
 */
export const setStorageItem = async <T>(key: string, value: T): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error setting storage item ${key}:`, error);
    throw new Error(`Failed to set storage item: ${key}`);
  }
};

/**
 * Get an item from AsyncStorage
 * @param key Storage key
 * @returns Parsed value or null if not found
 */
export const getStorageItem = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error getting storage item ${key}:`, error);
    return null;
  }
};

/**
 * Remove an item from AsyncStorage
 * @param key Storage key
 */
export const removeStorageItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing storage item ${key}:`, error);
    throw new Error(`Failed to remove storage item: ${key}`);
  }
};

/**
 * Clear all items from AsyncStorage
 */
export const clearStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw new Error('Failed to clear storage');
  }
};

/**
 * Get all keys from AsyncStorage
 * @returns Array of all keys
 */
export const getAllKeys = async (): Promise<string[]> => {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error('Error getting all keys:', error);
    return [];
  }
};

/**
 * Get multiple items from AsyncStorage
 * @param keys Array of storage keys
 * @returns Array of [key, value] pairs
 */
export const getMultipleItems = async (keys: string[]): Promise<[string, string | null][]> => {
  try {
    return await AsyncStorage.multiGet(keys);
  } catch (error) {
    console.error('Error getting multiple items:', error);
    return [];
  }
};

/**
 * Set multiple items in AsyncStorage
 * @param keyValuePairs Array of [key, value] pairs
 */
export const setMultipleItems = async (keyValuePairs: [string, string][]): Promise<void> => {
  try {
    await AsyncStorage.multiSet(keyValuePairs);
  } catch (error) {
    console.error('Error setting multiple items:', error);
    throw new Error('Failed to set multiple items');
  }
};

/**
 * Remove multiple items from AsyncStorage
 * @param keys Array of storage keys
 */
export const removeMultipleItems = async (keys: string[]): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(keys);
  } catch (error) {
    console.error('Error removing multiple items:', error);
    throw new Error('Failed to remove multiple items');
  }
};

/**
 * Check if a key exists in AsyncStorage
 * @param key Storage key
 * @returns true if key exists, false otherwise
 */
export const hasStorageItem = async (key: string): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null;
  } catch (error) {
    console.error(`Error checking if storage item exists ${key}:`, error);
    return false;
  }
};

/**
 * Get storage usage information
 * @returns Object with storage info
 */
export const getStorageInfo = async (): Promise<{
  totalKeys: number;
  estimatedSize: number; // in bytes
}> => {
  try {
    const keys = await getAllKeys();
    const items = await getMultipleItems(keys);
    
    let estimatedSize = 0;
    items.forEach(([key, value]) => {
      if (value) {
        estimatedSize += key.length + value.length;
      }
    });

    return {
      totalKeys: keys.length,
      estimatedSize,
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return {
      totalKeys: 0,
      estimatedSize: 0,
    };
  }
};

/**
 * Utility to create a storage helper for a specific prefix
 * @param prefix Storage key prefix
 */
export const createStorageHelper = (prefix: string) => {
  const prefixedKey = (key: string) => `${prefix}:${key}`;

  return {
    set: <T>(key: string, value: T) => setStorageItem(prefixedKey(key), value),
    get: <T>(key: string) => getStorageItem<T>(prefixedKey(key)),
    remove: (key: string) => removeStorageItem(prefixedKey(key)),
    has: (key: string) => hasStorageItem(prefixedKey(key)),
    clear: async () => {
      const allKeys = await getAllKeys();
      const prefixedKeys = allKeys.filter(key => key.startsWith(`${prefix}:`));
      if (prefixedKeys.length > 0) {
        await removeMultipleItems(prefixedKeys);
      }
    },
  };
};

/**
 * Storage hook for React components
 * @param key Storage key
 * @param defaultValue Default value if key doesn't exist
 */
export const useAsyncStorage = <T>(key: string, defaultValue: T) => {
  const [value, setValue] = React.useState<T>(defaultValue);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadValue = async () => {
      try {
        setLoading(true);
        setError(null);
        const storedValue = await getStorageItem<T>(key);
        setValue(storedValue !== null ? storedValue : defaultValue);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load value');
        setValue(defaultValue);
      } finally {
        setLoading(false);
      }
    };

    loadValue();
  }, [key, defaultValue]);

  const updateValue = async (newValue: T) => {
    try {
      setError(null);
      await setStorageItem(key, newValue);
      setValue(newValue);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save value');
      throw err;
    }
  };

  const removeValue = async () => {
    try {
      setError(null);
      await removeStorageItem(key);
      setValue(defaultValue);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove value');
      throw err;
    }
  };

  return {
    value,
    loading,
    error,
    setValue: updateValue,
    removeValue,
  };
};

// Import React for the hook
import React from 'react';
