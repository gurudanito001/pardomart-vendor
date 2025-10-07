import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { toast } from 'sonner-native';
import { apiConfig } from '../../api/config';
import { CustomersApi } from '../../api/endpoints/customers-api';
import type { User } from '../../api/models';

export type CustomerItem = User & {
  orderCount?: number;
  totalAmount?: string;
  avatarUrl?: string;
};

export const useCustomers = (vendorId?: string) => {
  const customersApi = useMemo(() => new CustomersApi(apiConfig), []);

  return useQuery<CustomerItem[], Error>({
    queryKey: ['customers', vendorId ?? 'all'],
    queryFn: async (): Promise<CustomerItem[]> => {
      try {
        const response: any = await customersApi.customersGet(vendorId);
        // Best-effort parsing: API should return an array of users. The generated client
        // may wrap the response differently; handle both .data and direct array.
        const data = response?.data ?? response;

        if (!Array.isArray(data)) return [];

        // Map users to CustomerItem; preserve available fields and provide sensible defaults
        return data.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          mobileNumber: u.mobileNumber,
          orderCount: u.orderCount ?? 0,
          totalAmount: u.totalAmount ?? '$0.00',
          avatarUrl: u.dynamicMediaUrls?.avatar?.small ?? u.avatarUrl ?? undefined,
        } as CustomerItem));
      } catch (err: any) {
        const message = err?.response?.data?.message || err?.message || 'Failed to load customers';
        toast.error(message);
        throw err;
      }
    },
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
  });
};
