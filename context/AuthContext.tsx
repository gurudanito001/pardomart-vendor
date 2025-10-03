import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';
import { authApi } from '../api/client';
import type { User } from '../api/models';
import { STORAGE_KEYS } from '../constants';
import { getStorageItem, removeStorageItem, setStorageItem } from '../utils/storage';

// Auth Actions
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_FINISH' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'SET_AUTHENTICATED'; payload: { user: User; token: string } }
  | { type: 'SET_REGISTERED'; payload: boolean }
  | { type: 'CLEAR_ERROR' };

// Local auth state type (replaces previous types)
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isReady: boolean;
  isRegistered: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  isReady: false,
  isRegistered: false,
  error: null,
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_FINISH':
      return {
        ...state,
        isLoading: false,
        isReady: true,
        error: null,
      };

    case 'SET_AUTHENTICATED':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        isRegistered: true, // A user being authenticated is always registered
        isReady: true,
      };
    
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        isReady: true,
        error: null,
      };
    
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isReady: true,
        error: action.payload,
      };
    
    case 'LOGOUT':
      return {
        ...initialState, // Reset to initial state
        isReady: true,
        isLoading: false, // But we are no longer loading
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };

    case 'SET_REGISTERED':
      return {
        ...state,
        isRegistered: action.payload,
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    
    default:
      return state;
  }
};

// Context interface
interface AuthContextType {
  state: AuthState;
  initiateLogin: (mobileNumber: string, role: 'vendor' | 'shopper') => Promise<void>;
  register: (data: any) => Promise<void>;
  verifyOTP: (data: { mobileNumber: string; verificationCode: string; role: 'vendor' | 'shopper' }) => Promise<any>;
  resendOTP: (data: { identifier: string; role: 'vendor' | 'shopper' }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  initializeAuth: () => Promise<void>;
  markAsRegistered: () => Promise<void>;
  clearAuthState: () => Promise<void>;
  clearError: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from storage
  useEffect(() => {
    initializeAuth();
  }, []);

  const migrateLegacyStorageKeys = async () => {
    // Migrate any old, non-namespaced keys if they exist
    const legacyToken = await getStorageItem<string>('auth_token');
    const legacyUser = await getStorageItem<User>('user_data');
    const legacyIsRegistered = await getStorageItem<boolean>('is_registered');

    const writes: Promise<any>[] = [];

    if (legacyToken) {
      writes.push(setStorageItem(STORAGE_KEYS.AUTH_TOKEN, legacyToken));
      writes.push(removeStorageItem('auth_token'));
    }
    if (legacyUser) {
      writes.push(setStorageItem(STORAGE_KEYS.USER_DATA, legacyUser));
      writes.push(removeStorageItem('user_data'));
    }
    if (typeof legacyIsRegistered !== 'undefined' && legacyIsRegistered !== null) {
      writes.push(setStorageItem(STORAGE_KEYS.IS_REGISTERED, legacyIsRegistered));
      writes.push(removeStorageItem('is_registered'));
    }

    if (writes.length) {
      await Promise.all(writes);
    }
  };

  const initializeAuth = async () => {
    try {
      dispatch({ type: 'AUTH_START' });
      await migrateLegacyStorageKeys();
      
      const [token, user, isRegistered] = await Promise.all([
        getStorageItem<string>(STORAGE_KEYS.AUTH_TOKEN),
        getStorageItem<User>(STORAGE_KEYS.USER_DATA),
        getStorageItem<boolean>(STORAGE_KEYS.IS_REGISTERED),
      ]);

      if (token && user) {
        // Optimistically set the user as authenticated based on token existence
        dispatch({
          type: 'SET_AUTHENTICATED',
          payload: { user, token },
        });

        // Then, verify the token with the server in the background
        /* try {
          const response = await authService.getCurrentUser();
          if (JSON.stringify(response.data) !== JSON.stringify(user)) {
            dispatch({ type: 'UPDATE_USER', payload: response.data });
            await setStorageItem(STORAGE_KEYS.USER_DATA, response.data);
          }
        } catch (error) {
          console.warn('Session token validation failed, logging out.', error);
          await clearAuthStorage();
          dispatch({ type: 'LOGOUT' });
        } */
      } else {
        // No token found, user is not authenticated.
        // isLoading will be set to false in the failure case.
        dispatch({ type: 'AUTH_FAILURE', payload: '' }); // payload is empty as it's not an error to show.
        if (isRegistered) {
          dispatch({ type: 'SET_REGISTERED', payload: true });
        }
      }
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: 'Failed to initialize auth' }); // This also sets isReady to true
    }
  };

  const clearAuthStorage = async () => {
    await Promise.all([
      removeStorageItem(STORAGE_KEYS.AUTH_TOKEN),
      removeStorageItem(STORAGE_KEYS.REFRESH_TOKEN),
      removeStorageItem(STORAGE_KEYS.USER_DATA),
      // Also remove any legacy keys to avoid duplication
      removeStorageItem('auth_token'),
      removeStorageItem('user_data'),
      removeStorageItem('is_registered'),
    ]);
  };

  const saveAuthData = async (user: User, token: string, refreshToken?: string) => {
    await Promise.all([
      setStorageItem(STORAGE_KEYS.AUTH_TOKEN, token),
      setStorageItem(STORAGE_KEYS.USER_DATA, user),
      setStorageItem(STORAGE_KEYS.IS_REGISTERED, true), // Mark that the user has registered
      refreshToken && setStorageItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
    ]);
  };

  const initiateLogin = async (mobileNumber: string, role: 'vendor' | 'shopper') => {
    try {
      dispatch({ type: 'AUTH_START' });
      await authApi().authInitiateLoginPost({ mobileNumber, role });
      // This action completes, but doesn't log the user in. Just finish loading.
      dispatch({ type: 'AUTH_FINISH' });
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error?.error?.message || 'Failed to send OTP.' });
      throw error;
    }
  };

  const register = async (data: any) => {
    try {
      dispatch({ type: 'AUTH_START' });
      await authApi().authRegisterPost(data);
      // Registration is successful, but the user is not logged in yet. Finish loading.
      dispatch({ type: 'AUTH_FINISH' });
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error?.error?.message || 'Registration failed.' });
      throw error;
    }
  };

  const verifyOTP = async (data: { mobileNumber: string; verificationCode: string; role: 'vendor' | 'shopper' }) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authApi().authVerifyLoginPost(data);
      // If your API client does not return the payload directly, adjust as needed:
      // For example, if response is { data: { user, token, refreshToken } }
      // Otherwise, if it returns the payload directly, use response as payload.
      const payload = (response as any)?.data ?? response;

      await saveAuthData(payload.user, payload.token, payload.refreshToken);

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: payload.user,
          token: payload.token,
        },
      });
      return payload;
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error?.error?.message || 'Verification failed.' });
      throw error;
    }
  };

  const resendOTP = async (data: { identifier: string; role: 'vendor' | 'shopper' }) => {
    try {
      // This action doesn't need a loading spinner in the context,
      // as it's usually a small action on the verify screen.
      await authApi().authInitiateLoginPost({ mobileNumber: data.identifier, role: data.role });
    } catch (error: any) {
      throw error;
    }
  };

  const markAsRegistered = async () => {
    try {
      await setStorageItem(STORAGE_KEYS.IS_REGISTERED, true);
      dispatch({ type: 'SET_REGISTERED', payload: true });
    } catch (error) {
      console.error('Failed to mark as registered:', error);
    }
  };

  const clearAuthState = async () => {
    await clearAuthStorage();
    dispatch({ type: 'LOGOUT' });
  };
  const logout = async () => {
    try {
      // If there is a logout endpoint in the OpenAPI, call it here instead
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      await clearAuthStorage();
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateUser = (user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
    setStorageItem(STORAGE_KEYS.USER_DATA, user);
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    state,
    initiateLogin,
    initializeAuth,
    register,
    verifyOTP,
    resendOTP,
    logout,
    updateUser,
    markAsRegistered,
    clearAuthState,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
