import React, { createContext, ReactNode, useContext, useEffect, useMemo, useReducer } from 'react';
import { apiConfig } from '../api/config';
import { OrderApi } from '../api/endpoints/order-api';
import type {
  MediaUploadPostIdentifierEnum, MediaUploadPostReferenceTypeEnum,
  OrderWithRelations,
  UpdateOrderItemShoppingStatusPayload,
  VendorWithRelations as VendorProfile
} from '../api/models';
import { STORAGE_KEYS } from '../constants';
import { getStorageItem, removeStorageItem, setStorageItem } from '../utils/storage';

import { MediaApi } from '../api/endpoints/media-api';
// Vendor Actions
type VendorAction =
  | { type: 'VENDOR_LOADING' }
  | { type: 'VENDOR_PROFILE_LOADED'; payload: VendorProfile }
  | { type: 'VENDOR_ERROR'; payload: string }
  | { type: 'VENDOR_ONLINE_STATUS_CHANGED'; payload: boolean }
  | { type: 'VENDOR_DOCUMENT_UPLOADED'; payload: any }
  | { type: 'VENDOR_RESET' }
  | { type: 'CLEAR_VENDOR_ERROR' }
  | { type: 'SET_ACTIVE_ORDER'; payload: OrderWithRelations | null };

// V. Terminal Order States where staff are unassigned and the order is "Closed"
const TERMINAL_ORDER_STATES = [
  'delivered',
  'picked_up_by_customer',
  'no_items_found',
  'cancelled_by_customer',
  'declined_by_vendor',
] as const;

interface VendorState {
  profile: VendorProfile | null;
  activeOrder: OrderWithRelations | null;
  isOnline: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: VendorState = {
  profile: null,
  activeOrder: null,
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
        isOnline: action.payload && 'isOnline' in (action.payload as any) ? (action.payload as any).isOnline === true || (action.payload as any).isOnline === 'true' : state.isOnline,
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
        isOnline: Boolean(action.payload),
        profile: state.profile ? ({
          ...(state.profile as any),
          isOnline: Boolean(action.payload),
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
    
    case 'SET_ACTIVE_ORDER':
      return {
        ...state,
        activeOrder: action.payload,
        isLoading: false,
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
  fetchActiveOrder: () => Promise<void>;
  startShopping: (orderId: string) => Promise<void>;
  updateOrderItemStatus: (orderId: string, itemId: string, data: UpdateOrderItemShoppingStatusPayload) => Promise<any>;
  verifyPickup: (orderId: string, verificationCode: string) => Promise<void>;
  updateActiveOrder: (order: OrderWithRelations | null) => void;
}

// Create context
const VendorContext = createContext<VendorContextType | undefined>(undefined);

// Vendor Provider component
interface VendorProviderProps {
  children: ReactNode;
}

export const VendorProvider: React.FC<VendorProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(vendorReducer, initialState);
  const mediaApi = useMemo(() => new MediaApi(apiConfig), []);
  const orderApi = useMemo(() => new OrderApi(apiConfig), []);

  // Load profile from storage on mount
  useEffect(() => {
    loadStoredProfile();
    fetchActiveOrder();
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

      let updatedProfileData = { ...(state.profile || {}), ...data };

      // Handle image upload if a new image is provided (URI from image picker)
      if (data.image && typeof data.image === 'string' && (data.image.startsWith('file://') || data.image.startsWith('data:image'))) {
        const imageUri = data.image;
        const fileName = imageUri.split('/').pop() || 'profile_picture.jpg';
        const fileType = imageUri.split('.').pop() || 'jpeg'; // Default to jpeg if not found

        // Create a File-like object for FormData. React Native's FormData can handle this.
        const fileToUpload = {
          uri: imageUri,
          name: fileName,
          type: `image/${fileType}`, // Adjust type as necessary
        } as any;

        // Assuming state.profile.id is the referenceId for the vendor
        const referenceId = state.profile?.id;
        if (!referenceId) {
          throw new Error('Vendor ID not available for image upload.');
        }

        const mediaUploadResponse = await mediaApi.mediaUploadPost(fileToUpload, referenceId, MediaUploadPostReferenceTypeEnum.UserImage, MediaUploadPostIdentifierEnum.ProfilePicture);
        updatedProfileData.image = mediaUploadResponse.data.url; // Update the image URL in the profile data
      }

      // TODO: Replace with the correct OpenAPI call for updating other vendor profile fields (e.g., name)
      const response = { data: updatedProfileData } as any; // Mocking the response structure for other fields

      dispatch({ type: 'VENDOR_PROFILE_LOADED', payload: updatedProfileData });
      await saveProfileToStorage(response.data);
      return response;
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

  const fetchActiveOrder = async () => {
    try {
      dispatch({ type: 'VENDOR_LOADING' });
      const response = await orderApi.orderActiveMeGet();
      dispatch({ type: 'SET_ACTIVE_ORDER', payload: response.data as any });
    } catch (error: any) {
      console.warn('Failed to fetch active order:', error);
      dispatch({ type: 'SET_ACTIVE_ORDER', payload: null });
    }
  };

  const startShopping = async (orderId: string) => {
    try {
      dispatch({ type: 'VENDOR_LOADING' });
      const response = await orderApi.orderOrderIdStartShoppingPatch(orderId);
      dispatch({ type: 'SET_ACTIVE_ORDER', payload: response.data as any });
    } catch (error: any) {
      dispatch({ type: 'VENDOR_ERROR', payload: error?.error?.message || 'Failed to start shopping' });
      throw error;
    }
  };

  const updateOrderItemStatus = async (orderId: string, itemId: string, data: UpdateOrderItemShoppingStatusPayload) => {
    try {
      dispatch({ type: 'VENDOR_LOADING' });
      const response = await orderApi.orderOrderIdItemsItemIdUpdateShoppingStatusPatch(data, orderId, itemId);

      /**
       * III. Replacement Logic & Preferences
       * The backend returns the updated OrderWithRelations after recalculating totals.
       * If send_request is active and the suggested item is new, its status will stay PENDING.
       */
      const updatedOrder = response.data as unknown as OrderWithRelations;

      /**
       * II. Terminal Failure Flow: 'no_items_found'
       * If the status transitions to 'no_items_found', the backend unassigns the shopper.
       * We clear the activeOrder locally to automatically end the session.
       */
      if (updatedOrder.orderStatus === 'no_items_found') {
        dispatch({ type: 'SET_ACTIVE_ORDER', payload: null });
        return { orderStatus: 'no_items_found', isTerminal: true };
      }

      dispatch({ type: 'SET_ACTIVE_ORDER', payload: updatedOrder });

      // Extract the updated item to check for 'send_request' approval state
      const updatedItem = (updatedOrder as any).orderItems?.find((i: any) => i.id === itemId);
      
      if (data.status === 'REPLACED' && updatedItem?.status === 'PENDING') {
        // Return a flag so the UI can notify the shopper that approval is required
        return { ...updatedItem, requiresApproval: true };
      }

      return updatedItem || updatedOrder;
    } catch (error: any) {
      // I. Handle the "Strict Budget" Barrier (400 error)
      const status = error?.response?.status || error?.status;
      const message = error?.response?.data?.message || error?.error?.message || 'Failed to update item';
      
      if (status === 400) {
        // I & III. Distinguish between Budget Barrier and Replacement Preference blocking
        if (message.toLowerCase().includes('budget')) {
          dispatch({ type: 'VENDOR_ERROR', payload: `Budget Barrier: ${message}` });
        } else if (message.toLowerCase().includes('replacement') || message.toLowerCase().includes('preference')) {
          dispatch({ type: 'VENDOR_ERROR', payload: `Customer Preference: ${message}` });
        } else {
          dispatch({ type: 'VENDOR_ERROR', payload: message });
        }
      } else {
        dispatch({ type: 'VENDOR_ERROR', payload: message });
      }
      throw error;
    }
  };

  const verifyPickup = async (orderId: string, verificationCode: string) => {
    try {
      dispatch({ type: 'VENDOR_LOADING' });
      // VII. Handles hand-off to Driver or Customer via OTP
      await orderApi.orderIdVerifyPickupPost({ verificationCode }, orderId);
      
      // After successful verification, refresh to get the updated status or clear unassigned order
      await fetchActiveOrder();
    } catch (error: any) {
      dispatch({ type: 'VENDOR_ERROR', payload: error?.error?.message || 'Verification failed' });
      throw error;
    }
  };

  // VI. Used to update UI in real-time from Socket events
  const updateActiveOrder = (order: OrderWithRelations | null) => {
    // V. Terminal States and Staff Unstacking: Clear session if order is closed
    if (order?.orderStatus && TERMINAL_ORDER_STATES.includes(order.orderStatus as any)) {
      dispatch({ type: 'SET_ACTIVE_ORDER', payload: null });
      return;
    }

    dispatch({ type: 'SET_ACTIVE_ORDER', payload: order });
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
    fetchActiveOrder,
    startShopping,
    updateOrderItemStatus,
    verifyPickup,
    updateActiveOrder,
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
