import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';
import { AuthRegisterPostRequest } from '../api';
import { STORAGE_KEYS } from '../constants';
import { authService } from '../services/auth';
import {
  AuthState,
  OTPVerificationRequest,
  RegisterRequest,
  ResendOTPRequest,
  User,
} from '../types';
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
  initiateLogin: (mobileNumber: string, role: AuthRegisterPostRequest['role']) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  verifyOTP: (data: OTPVerificationRequest) => Promise<void>; // This is verify-login
  resendOTP: (data: ResendOTPRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
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

  const initializeAuth = async () => {
    try {
      dispatch({ type: 'AUTH_START' });
      
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

  const initiateLogin = async (mobileNumber: string, role: AuthRegisterPostRequest['role']) => {
    try {
      dispatch({ type: 'AUTH_START' });
      await authService.initiateLogin({ mobileNumber, role });
      // This action completes, but doesn't log the user in. Just finish loading.
      dispatch({ type: 'AUTH_FINISH' });
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error?.error?.message || 'Failed to send OTP.' });
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      dispatch({ type: 'AUTH_START' });
      await authService.register(data as AuthRegisterPostRequest);
      // Registration is successful, but the user is not logged in yet. Finish loading.
      dispatch({ type: 'AUTH_FINISH' });
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error?.error?.message || 'Registration failed.' });
      throw error;
    }
  };

  const verifyOTP = async (data: OTPVerificationRequest) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authService.verifyOTP(data);
      
      await saveAuthData(response.data.user, response.data.token, response.data.refreshToken);
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.data.user,
          token: response.data.token,
        },
      });
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error?.error?.message || 'Verification failed.' });
      throw error;
    }
  };

  const resendOTP = async (data: ResendOTPRequest) => {
    try {
      // This action doesn't need a loading spinner in the context,
      // as it's usually a small action on the verify screen.
      await authService.resendOTP(data);
    } catch (error: any) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
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
    register,
    verifyOTP,
    resendOTP,
    logout,
    updateUser,
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
