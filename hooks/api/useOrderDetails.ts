import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { toast } from 'sonner-native';
import { apiConfig } from '../../api/config';
import { OrderApi } from '../../api/endpoints/order-api';
import type { VendorOrder } from '../../api/models';

export const useOrderDetails = (orderId?: string) => {
  const orderApi = useMemo(() => new OrderApi(apiConfig), []);

  return useQuery<VendorOrder, Error>({
    queryKey: ['orderDetails', orderId],
    queryFn: async () => {
      if (!orderId) {
        throw new Error('Order ID is required to fetch details.');
      }
      try {
        const response = await orderApi.orderIdGet(orderId);
        return response.data;
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to load order details';
        toast.error(message);
        // Re-throw the error to let react-query handle the error state
        throw new Error(message);
      }
    },
    // This query will not run until an orderId is available.
    enabled: !!orderId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};