import { TransactionsApi } from '@/api';
import { apiConfig } from '@/api/config';
import type { Transaction, TransactionWithRelations } from '@/api/models';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { toast } from 'sonner-native';


export const useVendorTransactions = (vendorId?: string, status?: string) => {
  const transactionApi = useMemo(() => new TransactionsApi(apiConfig), []);

  return useQuery<TransactionWithRelations[], Error>({
    queryKey: ['allTransactions'],
    queryFn: async (): Promise<Transaction[]> => {
      try {
        const response = await transactionApi.transactionsGet(vendorId);
        console.log('Fetched transactions:', response?.data);
        return response?.data ?? [];
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to load transactions';
        toast.error(message);
        // Re-throw the error to let react-query handle the error state
        throw new Error(message);
      }
    },
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
    select: (data) =>
      data.map((transaction) => ({
        ...transaction,
      })),
  });
};