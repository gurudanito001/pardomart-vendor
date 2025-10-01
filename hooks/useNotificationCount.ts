import { useCallback, useEffect, useMemo, useState } from 'react';
import { NotificationApi } from '../api/endpoints/notification-api';

export const useNotificationCount = () => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const notificationApi = useMemo(() => new NotificationApi(), []);

  const fetchCount = useCallback(async () => {
    try {
      const response = await notificationApi.notificationsUnreadCountGet();
      setCount((response.data as any).count ?? 0);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch notification count:', err);
      setError('Failed to load notification count.');
      setCount(0); // Silently fail to avoid breaking UI
    } finally {
      setLoading(false);
    }
  }, [notificationApi]);

  useEffect(() => {
    fetchCount();
    // To keep the count updated, we can poll the endpoint periodically.
    // A WebSocket would be a more efficient solution in a real-world scenario.
    const interval = setInterval(fetchCount, 60000); // Refetch every 60 seconds

    return () => clearInterval(interval);
  }, [fetchCount]);

  return { count, loading, error, refetch: fetchCount };
};