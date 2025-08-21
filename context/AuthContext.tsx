import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, User, LoginRequest, RegisterRequest, OTPVerificationRequest } from '../types';
import { authService } from '../services/auth';
import { STORAGE_KEYS } from '../constants';
import { setStorageItem, getStorageItem, removeStorageItem } from '../utils/storage';

// Auth Actions
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'CLEAR_ERROR' };

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
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
    
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    
    case 'LOGOUT':
      return {
        ...initialState,
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
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
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  verifyOTP: (data: OTPVerificationRequest) => Promise<void>;
  resendOTP: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  clearError: () => void;
  refreshAuth: () => Promise<void>;
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
      
      const [token, user] = await Promise.all([
        getStorageItem<string>(STORAGE_KEYS.AUTH_TOKEN),
        getStorageItem<User>(STORAGE_KEYS.USER_DATA),
      ]);

      if (token && user) {
        // Verify token is still valid by making a request
        try {
          const response = await authService.getCurrentUser();
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user: response.data, token },
          });
        } catch (error) {
          // Token is invalid, clear storage
          await clearAuthStorage();
          dispatch({ type: 'AUTH_FAILURE', payload: 'Session expired' });
        }
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: '' });
      }
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: 'Failed to initialize auth' });
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
      refreshToken && setStorageItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
    ]);
  };

  const login = async (credentials: LoginRequest) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authService.login(credentials);
      
      await saveAuthData(response.data.user, response.data.token, response.data.refreshToken);
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.data.user,
          token: response.data.token,
        },
      });
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message });
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authService.register(data);
      
      // Registration might not return tokens (pending email verification)
      if (response.data.token) {
        await saveAuthData(response.data.user, response.data.token, response.data.refreshToken);
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: response.data.user,
            token: response.data.token,
          },
        });
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: '' });
      }
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message });
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
      dispatch({ type: 'AUTH_FAILURE', payload: error.message });
      throw error;
    }
  };

  const resendOTP = async (email: string) => {
    try {
      await authService.resendOTP(email);
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

  const refreshAuth = async () => {
    try {
      const refreshToken = await getStorageItem<string>(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authService.refreshToken(refreshToken);
      await saveAuthData(response.data.user, response.data.token, response.data.refreshToken);
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.data.user,
          token: response.data.token,
        },
      });
    } catch (error) {
      await clearAuthStorage();
      dispatch({ type: 'LOGOUT' });
      throw error;
    }
  };

  const value: AuthContextType = {
    state,
    login,
    register,
    verifyOTP,
    resendOTP,
    logout,
    updateUser,
    clearError,
    refreshAuth,
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
