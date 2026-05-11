import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { toast } from 'sonner-native';
import { apiConfig } from '../../api/config';
import { VendorApi } from '../../api/endpoints/vendor-api';
import type { Order, OrderStatus } from '../../api/models';

export const useVendorOrders = (vendorId?: string, status?: OrderStatus) => {
  const vendorApi = useMemo(() => new VendorApi(apiConfig), []);

  return useQuery<Order[], Error>({
    queryKey: ['vendorOrders', vendorId, status],
    queryFn: async () => {
      try {
        // Using the consolidated vendor-specific order endpoint
        const response = await vendorApi.orderVendorGet(vendorId, status);
        console.log("vendor orders", response.data)
        return response.data;
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to load orders';
        toast.error(message);
        // Re-throw the error to let react-query handle the error state
        throw new Error(message);
      }
    },
    // You can adjust staleTime and other options as needed
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
    // Map the API data to the format your component expects.
    // This is a good place to transform data if needed.
    select: (data) =>
      data.map((order) => ({
        ...order,
        // Example of mapping fields if names differ.
        // For now, we assume the structure is compatible.
        customerName: order.user?.name || 'N/A',
        total: order.totalAmount,
        time: new Date(order.createdAt ?? Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date(order.createdAt ?? Date.now()).toLocaleDateString(),
        units: order.orderItems?.reduce((sum, item) => sum + (item.quantity ?? 0), 0) ?? 0,
      })),
  });
};