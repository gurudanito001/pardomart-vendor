import { VendorApi } from '@/api';
import { apiConfig } from '@/api/config';
import type { TransactionWithRelations } from '@/api/models';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { toast } from 'sonner-native';

const earningsKeys = {
  all: ['earnings'] as const,
  total: () => [...earningsKeys.all, 'total'] as const,
  list: (vendorId?: string) => [...earningsKeys.all, 'list', { vendorId }] as const,
};

export const useTotalEarnings = () => {
  const vendorApi = useMemo(() => new VendorApi(apiConfig), []);

  return useQuery({
    queryKey: earningsKeys.total(),
    queryFn: async () => {
      try {
        const response = await vendorApi.earningsTotalGet();
        return response.data;
      } catch (err: any) {
        const message = err?.response?.data?.message || err?.message || 'Failed to load total earnings';
        toast.error(message);
        throw new Error(message);
      }
    },
  });
};

export const useEarningsList = (vendorId?: string) => {
  const vendorApi = useMemo(() => new VendorApi(apiConfig), []);

  return useQuery<TransactionWithRelations[], Error>({
    queryKey: earningsKeys.list(vendorId),
    queryFn: async () => {
      try {
        const response = await vendorApi.earningsGet(vendorId);
        return response.data;
      } catch (err: any) {
        const message = err?.response?.data?.message || err?.message || 'Failed to load earnings list';
        toast.error(message);
        throw new Error(message);
      }
    },
  });
};