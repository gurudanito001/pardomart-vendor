import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { apiConfig } from '../api/config';
import { NotificationApi } from '../api/endpoints/notification-api';

export const useNotificationCount = () => {
  const notificationApi = useMemo(() => new NotificationApi(apiConfig), []);

  const query = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const response = await notificationApi.notificationsUnreadCountGet();
      return (response.data as any)?.count ?? 0;
    },
    refetchInterval: 60000,
    staleTime: 30000,
  });

  return {
    count: query.data ?? 0,
    loading: query.isLoading,
    error: query.error ? 'Failed to load notification count.' : null,
    refetch: query.refetch,
  };
};