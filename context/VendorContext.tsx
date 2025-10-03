import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';
import type { VendorWithRelations as VendorProfile } from '../api/models';
import { STORAGE_KEYS } from '../constants';
import { getStorageItem, removeStorageItem, setStorageItem } from '../utils/storage';

// Vendor Actions
type VendorAction =
  | { type: 'VENDOR_LOADING' }
  | { type: 'VENDOR_PROFILE_LOADED'; payload: VendorProfile }
  | { type: 'VENDOR_ERROR'; payload: string }
  | { type: 'VENDOR_ONLINE_STATUS_CHANGED'; payload: boolean }
  | { type: 'VENDOR_DOCUMENT_UPLOADED'; payload: any }
  | { type: 'VENDOR_RESET' }
  | { type: 'CLEAR_VENDOR_ERROR' };

interface VendorState {
  profile: VendorProfile | null;
  isOnline: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: VendorState = {
  profile: null,
  isOnline: false,
  isLoading: false,
  error: null,
};

// Vendor reducer
const vendorReducer = (state: VendorState, action: VendorAction): VendorState => {
  switch (action.type) {
    case 'VENDOR_LOADING':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    
    case 'VENDOR_PROFILE_LOADED':
      return {
        ...state,
        profile: action.payload as any,
        isOnline: (action.payload as any)?.isOnline ?? state.isOnline,
        isLoading: false,
        error: null,
      };
    
    case 'VENDOR_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    
    case 'VENDOR_ONLINE_STATUS_CHANGED':
      return {
        ...state,
        isOnline: action.payload,
        profile: state.profile ? ({
          ...(state.profile as any),
          isOnline: action.payload,
        } as any) : null,
      };
    
    case 'VENDOR_DOCUMENT_UPLOADED':
      return {
        ...state,
        profile: state.profile ? ({
          ...(state.profile as any),
          documents: ([...(state.profile as any).documents ?? [], action.payload] as any),
        } as any) : null,
      };
    
    case 'VENDOR_RESET':
      return initialState;
    
    case 'CLEAR_VENDOR_ERROR':
      return {
        ...state,
        error: null,
      };
    
    default:
      return state;
  }
};

// Context interface
interface VendorContextType {
  state: VendorState;
  loadProfile: () => Promise<void>;
  updateProfile: (data: Partial<VendorProfile>) => Promise<any>;
  uploadDocument: (file: FormData) => Promise<void>;
  goOnline: () => Promise<void>;
  goOffline: () => Promise<void>;
  clearError: () => void;
  resetVendor: () => void;
}

// Create context
const VendorContext = createContext<VendorContextType | undefined>(undefined);

// Vendor Provider component
interface VendorProviderProps {
  children: ReactNode;
}

export const VendorProvider: React.FC<VendorProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(vendorReducer, initialState);

  // Load profile from storage on mount
  useEffect(() => {
    loadStoredProfile();
  }, []);

  const loadStoredProfile = async () => {
    try {
      const storedProfile = await getStorageItem<VendorProfile>(STORAGE_KEYS.VENDOR_PROFILE);
      if (storedProfile) {
        dispatch({ type: 'VENDOR_PROFILE_LOADED', payload: storedProfile });
      }
    } catch (error) {
      console.warn('Failed to load stored vendor profile:', error);
    }
  };

  const saveProfileToStorage = async (profile: VendorProfile) => {
    try {
      await setStorageItem(STORAGE_KEYS.VENDOR_PROFILE, profile);
    } catch (error) {
      console.warn('Failed to save vendor profile to storage:', error);
    }
  };

  const loadProfile = async () => {
    try {
      dispatch({ type: 'VENDOR_LOADING' });
      // TODO: Replace with OpenAPI call when a vendor profile/me endpoint is available.
      const existing = await getStorageItem<VendorProfile>(STORAGE_KEYS.VENDOR_PROFILE);
      if (existing) {
        dispatch({ type: 'VENDOR_PROFILE_LOADED', payload: existing });
      } else {
        dispatch({ type: 'VENDOR_ERROR', payload: 'Vendor profile not available' });
      }
    } catch (error: any) {
      dispatch({ type: 'VENDOR_ERROR', payload: error.message });
      throw error;
    }
  };

  const updateProfile = async (data: Partial<VendorProfile>) => {
    try {
      dispatch({ type: 'VENDOR_LOADING' });
      // TODO: Replace with the correct OpenAPI call when available
      const response = { data: { ...(state.profile || {}), ...data } } as any;
      
      dispatch({ type: 'VENDOR_PROFILE_LOADED', payload: response.data });
      await saveProfileToStorage(response.data);
    } catch (error: any) {
      dispatch({ type: 'VENDOR_ERROR', payload: error.message });
      throw error;
    }
  };

  const uploadDocument = async (file: FormData) => {
    try {
      dispatch({ type: 'VENDOR_LOADING' });
      // TODO: Replace with the correct OpenAPI call when available
      const response = { data: {} as any } as any;
      
      dispatch({ type: 'VENDOR_DOCUMENT_UPLOADED', payload: response.data });
      
      // Update profile in storage
      if (state.profile) {
        const updatedProfile = {
          ...(state.profile as any),
          documents: ([...(state.profile as any).documents ?? [], response.data] as any),
        } as any;
        await saveProfileToStorage(updatedProfile);
      }
    } catch (error: any) {
      dispatch({ type: 'VENDOR_ERROR', payload: error.message });
      throw error;
    }
  };

  const goOnline = async () => {
    try {
      // TODO: Replace with OpenAPI call if available
      dispatch({ type: 'VENDOR_ONLINE_STATUS_CHANGED', payload: true });
      
      // Update profile in storage
      if (state.profile) {
        const updatedProfile = { ...state.profile, isOnline: true };
        await saveProfileToStorage(updatedProfile);
      }
    } catch (error: any) {
      dispatch({ type: 'VENDOR_ERROR', payload: error.message });
      throw error;
    }
  };

  const goOffline = async () => {
    try {
      // TODO: Replace with OpenAPI call if available
      dispatch({ type: 'VENDOR_ONLINE_STATUS_CHANGED', payload: false });
      
      // Update profile in storage
      if (state.profile) {
        const updatedProfile = { ...state.profile, isOnline: false };
        await saveProfileToStorage(updatedProfile);
      }
    } catch (error: any) {
      dispatch({ type: 'VENDOR_ERROR', payload: error.message });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_VENDOR_ERROR' });
  };

  const resetVendor = async () => {
    dispatch({ type: 'VENDOR_RESET' });
    await removeStorageItem(STORAGE_KEYS.VENDOR_PROFILE);
  };

  const value: VendorContextType = {
    state,
    loadProfile,
    updateProfile,
    uploadDocument,
    goOnline,
    goOffline,
    clearError,
    resetVendor,
  };

  return <VendorContext.Provider value={value}>{children}</VendorContext.Provider>;
};

// Hook to use vendor context
export const useVendor = (): VendorContextType => {
  const context = useContext(VendorContext);
  if (!context) {
    throw new Error('useVendor must be used within a VendorProvider');
  }
  return context;
};
