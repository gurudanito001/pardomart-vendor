import { ProductApi } from '@/api';
import { apiConfig } from '@/api/config';
import type { ProductVendorMyProductsGet200Response } from '@/api/models';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { toast } from 'sonner-native';

const productKeys = {
  all: ['products'] as const,
  myProducts: (vendorId?: string) => [...productKeys.all, 'my-products', { vendorId }] as const,
};

export const useMyProducts = (vendorId?: string) => {
  const productApi = useMemo(() => new ProductApi(apiConfig), []);

  return useQuery<ProductVendorMyProductsGet200Response, Error>({
    queryKey: productKeys.myProducts(vendorId),
    queryFn: async () => {
      try {
        const response = await productApi.productVendorMyProductsGet(vendorId);
        return response.data;
      } catch (err: any) {
        const message =
          err?.response?.data?.message || err?.message || 'Failed to load products';
        toast.error(message);
        throw new Error(message);
      }
    },
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
  });
};