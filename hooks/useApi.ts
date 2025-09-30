import { useCallback, useEffect, useRef, useState } from 'react';
export interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

/**
 * Custom hook for managing API calls with loading, error, and data states
 */
export function useApi<T, Args extends any[] = any[]>(
  apiFunction: (...args: Args) => Promise<{ data: T }>,
  options: UseApiOptions = {}
): UseApiReturn<T> & { execute: (...args: Args) => Promise<T> } {
  const { immediate = false, onSuccess, onError } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const mountedRef = useRef(true);
  const lastCallIdRef = useRef(0);

  // Track component mount status
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async (...args: Args): Promise<T> => {
    const callId = ++lastCallIdRef.current;
    
    try {
      setLoading(true);
      setError(null);

      const response = await apiFunction(...args);
      
      // Only update state if this is the latest call and component is still mounted
      if (callId === lastCallIdRef.current && mountedRef.current) {
        setData(response.data);
        setLoading(false);
        
        if (onSuccess) {
          onSuccess(response.data);
        }
      }
      
      return response.data;
    } catch (err: any) {
      // Only update state if this is the latest call and component is still mounted
      if (callId === lastCallIdRef.current && mountedRef.current) {
        const errorMessage = err.error?.message || err.message || 'An error occurred';
        setError(errorMessage);
        setLoading(false);
        
        if (onError) {
          onError(err);
        }
      }
      
      throw err;
    }
  }, [apiFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      (execute as unknown as () => Promise<any>)();
    }
  }, [immediate, execute]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

/**
 * Custom hook for paginated API calls
 */
export function usePaginatedApi<T>(
  apiFunction: (page: number, limit: number) => Promise<{
    data: {
      items: T[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    };
  }>,
  initialLimit: number = 20
) {
  const [items, setItems] = useState<T[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: initialLimit,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      if (append) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      setError(null);

      const response = await apiFunction(page, pagination.limit);
      
      // Ensure items is always an array
      const serverItems = response?.data?.items ?? [];
      setItems(prev => append ? [...prev, ...serverItems] : serverItems);

      // Ensure pagination is always an object with defaults to avoid introducing undefined
      const serverPagination = response?.data?.pagination ?? {} as any;
      setPagination(prev => ({
        page: serverPagination.page ?? prev.page,
        limit: serverPagination.limit ?? prev.limit,
        total: serverPagination.total ?? prev.total,
        totalPages: serverPagination.totalPages ?? prev.totalPages,
        hasNext: serverPagination.hasNext ?? prev.hasNext,
        hasPrev: serverPagination.hasPrev ?? prev.hasPrev,
      }));
    } catch (err: any) {
      const errorMessage = err.error?.message || err.message || 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [apiFunction, pagination?.limit]);

  const loadMore = useCallback(() => {
    if (!loading && pagination.hasNext) {
      fetchData(pagination.page + 1, true);
    }
  }, [loading, pagination.hasNext, pagination.page, fetchData]);

  const refresh = useCallback(() => {
    fetchData(1, false);
  }, [fetchData]);

  const reset = useCallback(() => {
    setItems([]);
    setPagination({
      page: 1,
      limit: initialLimit,
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    });
    setError(null);
    setLoading(false);
    setRefreshing(false);
  }, [initialLimit]);

  // Initial load
  useEffect(() => {
    fetchData();
  }, []);

  return {
    items,
    pagination,
    loading,
    refreshing,
    error,
    loadMore,
    refresh,
    reset,
  };
}

/**
 * Custom hook for managing multiple API calls
 */
export function useMultipleApi<T extends Record<string, any>>(
  apiCalls: {
    [K in keyof T]: () => Promise<{ data: T[K] }>;
  }
) {
  const [data, setData] = useState<Partial<T>>({});
  const [loading, setLoading] = useState<{ [K in keyof T]?: boolean }>({});
  const [errors, setErrors] = useState<{ [K in keyof T]?: string }>({});
  
  const execute = useCallback(async (callNames?: (keyof T)[]) => {
    const callsToExecute = callNames || Object.keys(apiCalls);
    
    // Set loading states
    setLoading(prev => ({
      ...prev,
      ...callsToExecute.reduce((acc, name) => ({ ...acc, [name]: true }), {}),
    }));
    
    // Clear previous errors
    setErrors(prev => ({
      ...prev,
      ...callsToExecute.reduce((acc, name) => ({ ...acc, [name]: undefined }), {} as any),
    }));

    type ResultItem = { name: keyof T; data?: T[keyof T]; error?: string };
    const promises: Promise<ResultItem>[] = callsToExecute.map(async (name) => {
      try {
        const response = await apiCalls[name]();
        return { name, data: response.data } as ResultItem;
      } catch (err: any) {
        const errorMessage = err.error?.message || err.message || 'An error occurred';
        return { name, error: errorMessage } as ResultItem;
      }
    });

    const results = await Promise.allSettled(promises);
    
    const newData: Partial<T> = {};
    const newErrors: Partial<Record<keyof T, string | undefined>> = {};
    const newLoading: { [K in keyof T]?: boolean } = {};

    results.forEach((result, index) => {
      const callName = callsToExecute[index];
      newLoading[callName] = false;
      
      if (result.status === 'fulfilled') {
        const { data, error } = result.value as ResultItem;
        if (error !== undefined) {
          newErrors[callName] = error;
        } else if (data !== undefined) {
          newData[callName] = data;
        }
      } else {
        newErrors[callName] = 'Request failed';
      }
    });

    setData(prev => ({ ...prev, ...newData }));
    setErrors(prev => ({ ...prev, ...newErrors }));
    setLoading(prev => ({ ...prev, ...newLoading }));
  }, [apiCalls]);

  const reset = useCallback(() => {
    setData({});
    setLoading({});
    setErrors({});
  }, []);

  const isLoading = Object.values(loading).some(Boolean);
  const hasErrors = Object.values(errors).some(Boolean);

  return {
    data,
    loading,
    errors,
    isLoading,
    hasErrors,
    execute,
    reset,
  };
}

/**
 * Custom hook for optimistic updates
 */
export function useOptimisticApi<T>(
  apiFunction: (data: T) => Promise<{ data: T }>,
  onSuccess?: (data: T) => void,
  onError?: (error: any, rollbackData: T) => void
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (optimisticData: T): Promise<void> => {
    const previousData = data;
    
    try {
      // Apply optimistic update
      setData(optimisticData);
      setLoading(true);
      setError(null);

      // Make API call
      const response = await apiFunction(optimisticData);
      
      // Update with real data
      setData(response.data);
      
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (err: any) {
      // Rollback optimistic update
      setData(previousData);
      
      const errorMessage = err.error?.message || err.message || 'An error occurred';
      setError(errorMessage);
      
      if (onError) {
        onError(err, optimisticData);
      }
    } finally {
      setLoading(false);
    }
  }, [data, apiFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}
