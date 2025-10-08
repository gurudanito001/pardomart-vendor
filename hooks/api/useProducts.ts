import { apiConfig } from '@/api/config';
import { ProductApi } from '@/api/endpoints/product-api';
import { CreateVendorProductWithBarcodePayload, PaginatedVendorProducts, VendorProduct, VendorProductWithRelations } from '@/api/models';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner-native';

type ApiError = { response?: { data?: { message?: string } }; message?: string };

interface UseProductsState {
  products: VendorProduct[];
  pagination: {
    page: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
  } | null;
  loading: boolean;
  error: string | null;
}

export const useProducts = () => {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    loading: false,
    error: null,
    pagination: null,
  });

  const showError = useCallback((m: string) => toast.error(m), []);
  const showSuccess = useCallback((m: string) => toast.success(m), []);
  const productApi = useMemo(() => new ProductApi(apiConfig), []);

  const handleError = useCallback((error: ApiError, defaultMessage: string) => {
    const errorMessage = error?.response?.data?.message || error?.message || defaultMessage;
    showError(errorMessage);
    return errorMessage;
  }, [showError]);

  const fetchProductsByStore = useCallback(async (
    storeId: string,
    params?: {
      name?: string;
      categoryIds?: string[];
      page?: number;
      size?: number;
    }
  ): Promise<PaginatedVendorProducts> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await productApi.productVendorGet(
        params?.name,
        storeId,
        undefined, // productId
        params?.categoryIds,
        undefined, // tagIds
        params?.page,
        params?.size
      );
      const data = response.data as PaginatedVendorProducts;
      
      setState({
        products: data.data || [],
        pagination: {
          page: data.page || 1,
          totalPages: data.totalPages || 1,
          pageSize: data.pageSize || 10,
          totalCount: data.totalCount || 0,
        },
        loading: false,
        error: null,
      });
      return data;
    } catch (error: any) {
      handleError(error, 'Failed to fetch products');
      setState(prev => ({ ...prev, loading: false, error: 'Failed to fetch products' }));
      return {
        data: [],
        page: 1,
        totalPages: 1,
        pageSize: 10,
        totalCount: 0,
      };
    }
  }, [productApi, handleError]);

  const createProductWithBarcode = useCallback(async (
    payload: CreateVendorProductWithBarcodePayload
  ): Promise<VendorProductWithRelations | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await productApi.productVendorBarcodePost(payload);
      const newProduct = response.data;
      setState(prev => ({
        ...prev,
        products: [newProduct, ...prev.products],
        loading: false,
      }));
      showSuccess('Product created successfully!');
      return newProduct;
    } catch (error: any) {
      handleError(error, 'Failed to create product');
      setState(prev => ({ ...prev, loading: false, error: 'Failed to create product' }));
      return null;
    }
  }, [productApi, handleError, showSuccess]);

  return {
    ...state,
    fetchProductsByStore,
    createProductWithBarcode,
  };
};