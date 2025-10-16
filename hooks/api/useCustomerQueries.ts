import { CustomersApi } from '@/api';
import { apiConfig } from '@/api/config';
import type { Transaction, UserSummary } from '@/api/models';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { toast } from 'sonner-native';

export interface CustomerItem extends UserSummary {
  avatarUrl?: string;
  orderCount?: number;
  totalAmount?: string;
  email?: string | null;
}

const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (vendorId?: string) => [...customerKeys.lists(), { vendorId }] as const,
  transactions: (customerId: string) => [...customerKeys.all, customerId, 'transactions'] as const,
};

/**
 * Fetches a list of customers, optionally filtered by vendorId.
 * @param vendorId - The ID of the vendor/store to filter by.
 */
export const useCustomers = (vendorId?: string) => {
  const customersApi = useMemo(() => new CustomersApi(apiConfig), []);

  return useQuery<CustomerItem[], Error>({
    queryKey: customerKeys.list(vendorId),
    queryFn: async (): Promise<CustomerItem[]> => {
      try {
        const response = await customersApi.customersGet(vendorId);
        return response.data ?? [];
      } catch (err: any) {
        const message = err?.response?.data?.message || err?.message || 'Failed to load customers';
        toast.error(message);
        throw new Error(message);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Fetches transaction history for a specific customer.
 * @param customerId - The ID of the customer.
 * @param vendorId - Optional vendor ID to filter transactions.
 */
export const useCustomerTransactions = (customerId?: string, vendorId?: string) => {
  const customersApi = useMemo(() => new CustomersApi(apiConfig), []);

  return useQuery<Transaction[], Error>({
    queryKey: customerKeys.transactions(customerId!),
    queryFn: async (): Promise<Transaction[]> => {
      if (!customerId) {
        throw new Error('Customer ID is required');
      }
      try {
        const response = await customersApi.customersCustomerIdTransactionsGet(customerId, vendorId);
        return response.data ?? [];
      } catch (err: any) {
        const message =
          err?.response?.data?.message || err?.message || 'Failed to load transactions';
        toast.error(message);
        throw new Error(message);
      }
    },
    enabled: !!customerId,
  });
};