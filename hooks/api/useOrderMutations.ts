import type { Order, OrderItemWithRelations, UpdateOrderItemShoppingStatusPayload } from '@/api';
import { apiConfig } from '@/api/config';
import { OrderApi } from '@/api/endpoints/order-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { toast } from 'sonner-native';

export const useOrderMutations = () => {
  const queryClient = useQueryClient();
  const orderApi = useMemo(() => new OrderApi(apiConfig), []);

  /**
   * Mutation to mark an order as 'shopping_in_progress'.
   */
  const useStartShopping = () => {
    return useMutation<Order, Error, string>({
      mutationFn: (orderId: string) => {
        return orderApi.orderOrderIdStartShoppingPatch(orderId).then(response => response.data);
      },
      onSuccess: (data) => {
        toast.success('Shopping started!');
        // Invalidate and refetch the specific order details to get the updated status
        queryClient.invalidateQueries({ queryKey: ['orderDetails', data.id] });
        // Optionally, invalidate the list of all orders
        queryClient.invalidateQueries({ queryKey: ['vendorOrders'] });
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message || 'Failed to start shopping.';
        toast.error(message);
      },
    });
  };

  /**
   * Mutation to update the shopping status of a single item in an order.
   */
  const useUpdateOrderItemStatus = () => {
    return useMutation<
      OrderItemWithRelations,
      Error,
      { orderId: string; itemId: string; payload: UpdateOrderItemShoppingStatusPayload }
    >({
      mutationFn: ({ orderId, itemId, payload }) => {
        return orderApi
          .orderOrderIdItemsItemIdUpdateShoppingStatusPatch(payload, orderId, itemId)
          .then(response => response.data);
      },
      onSuccess: (data, variables) => {
        /* if (variables.payload.status === 'found') {
          toast.success('Item status updated to "Found".');
        } */
        // Invalidate the order details to reflect the change in item status
        queryClient.invalidateQueries({ queryKey: ['orderDetails', variables.orderId] });
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message || 'Failed to update item status.';
        toast.error(message);
      },
    });
  };

  /**
   * Mutation to accept a pending order.
   */
  const useAcceptOrder = () => {
    return useMutation<Order, Error, string>({
      mutationFn: (orderId: string) => {
        return orderApi.orderOrderIdAcceptPatch(orderId).then(response => response.data);
      },
      onSuccess: (data) => {
        toast.success(`Order #${data.orderCode} accepted!`);
        // Invalidate and refetch the orders list to remove/update the accepted order
        queryClient.invalidateQueries({ queryKey: ['vendorOrders'] });
        // Also invalidate the specific order details if it's cached, in case the user navigates there
        queryClient.invalidateQueries({ queryKey: ['orderDetails', data.id] });
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message || 'Failed to accept order.';
        toast.error(message);
      },
    });
  };

  return {
    useStartShopping,
    useUpdateOrderItemStatus,
    useAcceptOrder,
  };
};

export const useStartShopping = () => useOrderMutations().useStartShopping();
export const useUpdateOrderItemStatus = () => useOrderMutations().useUpdateOrderItemStatus();
export const useAcceptOrder = () => useOrderMutations().useAcceptOrder();