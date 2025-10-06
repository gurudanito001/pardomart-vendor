import { useCallback, useMemo, useState } from 'react';

// API & Models
import { apiConfig } from '../../api/config';
import { VendorApi } from '../../api/endpoints/vendor-api';
import { CreateVendorPayload, PaginatedVendors, Vendor, VendorWithRelations } from '../../api/models';

// Contexts
import { toast } from 'sonner-native';

// Types
type ApiError = { response?: { data?: { message?: string } }; message?: string };

interface UseVendorsState {
  vendors: Vendor[];
  pagination: {
    page: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
  } | null;
  loading: boolean;
  error: string | null;
}

interface UseVendorState {
  vendor: VendorWithRelations | null;
  loading: boolean;
  error: string | null;
}

export const useVendors = () => {
  const [state, setState] = useState<UseVendorsState>({
    vendors: [],
    pagination: null,
    loading: false,
    error: null,
  });

  const showError = useCallback((m: string) => toast.error(m), []);
  const vendorApi = useMemo(() => new VendorApi(apiConfig), []);

  const handleError = useCallback((error: ApiError, defaultMessage: string) => {
    const errorMessage = error?.response?.data?.message || error?.message || defaultMessage;
    showError(errorMessage);
    return errorMessage;
  }, [showError]);

  const fetchVendors = useCallback(async (params?: {
    name?: string;
    latitude?: number;
    longitude?: number;
    userId?: string;
    page?: number;
    size?: number;
  }) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await vendorApi.vendorsGet(
        params?.name,
        params?.latitude,
        params?.longitude,
        params?.userId,
        params?.page,
        params?.size
      );
      
      const data = response.data as PaginatedVendors;
      
      setState({
        vendors: data?.data || [],
        pagination: {
          page: data?.page || 1,
          totalPages: data?.totalPages || 1,
          pageSize: data?.pageSize || 10,
          totalCount: data?.totalCount || 0,
        },
        loading: false,
        error: null,
      });
      return data;
    } catch (error: any) {
      const errorMessage = handleError(error, 'Failed to fetch vendors');
      setState({
        vendors: [],
        pagination: null,
        loading: false,
        error: errorMessage,
      });
      throw error;
    }
  }, [vendorApi, handleError]);

  const fetchNearbyVendors = useCallback(async (
    latitude: number,
    longitude: number,
    page?: number,
    size?: number
  ) => {
    return fetchVendors({ latitude, longitude, page, size });
  }, [fetchVendors]);

  const searchVendors = useCallback(async (
    name: string,
    latitude?: number,
    longitude?: number,
    page?: number,
    size?: number
  ) => {
    return fetchVendors({ name, latitude, longitude, page, size });
  }, [fetchVendors]);

  const createVendor = useCallback(async (payload: CreateVendorPayload) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await vendorApi.vendorsPost(payload);
      const newVendor = response.data as Vendor;

      // Add the new vendor to the existing list
      setState(prev => ({
        ...prev,
        vendors: [newVendor, ...prev.vendors],
        loading: false,
      }));
      return newVendor;
    } catch (error: any) {
      const errorMessage = handleError(error, 'Failed to create vendor');
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, [vendorApi, handleError]);

  return {
    ...state,
    fetchVendors,
    fetchNearbyVendors,
    searchVendors,
    createVendor,
  };
};

export const useVendor = () => {
  const [state, setState] = useState<UseVendorState>({
    vendor: null,
    loading: false,
    error: null,
  });

  const showError = useCallback((m: string) => toast.error(m), []);
  const vendorApi = useMemo(() => new VendorApi(apiConfig), []);

  const handleError = useCallback((error: ApiError, defaultMessage: string) => {
    const errorMessage = error?.response?.data?.message || error?.message || defaultMessage;
    showError(errorMessage);
    return errorMessage;
  }, [showError]);

  const fetchVendor = useCallback(async (vendorId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await vendorApi.vendorsIdGet(vendorId);
      setState({
        vendor: response.data,
        loading: false,
        error: null,
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = handleError(error, 'Failed to fetch vendor');
      setState({
        vendor: null,
        loading: false,
        error: errorMessage,
      });
      throw error;
    }
  }, [vendorApi, handleError]);

  return {
    ...state,
    fetchVendor,
  };
};
