import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { VendorProvider } from './VendorContext';

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
export { useAuth } from './AuthContext';
export { useVendor } from './VendorContext';

// Re-export types
export type { AuthState, VendorState } from '../types';
