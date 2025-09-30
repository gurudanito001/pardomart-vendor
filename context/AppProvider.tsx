import React, { ReactNode } from 'react';
import { AuthProvider, useAuth as useAuthFromContext } from './AuthContext';
import { VendorProvider, useVendor as useVendorFromContext } from './VendorContext';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <AuthProvider>
      <VendorProvider>
        {children}
      </VendorProvider>
    </AuthProvider>
  );
};

// Re-export hooks for convenience
export const useAuth = useAuthFromContext;
export const useVendor = useVendorFromContext;

// Re-export types
export type { AuthState, VendorState } from '../types';
