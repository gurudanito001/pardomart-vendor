import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook that debounces a value
 * @param value The value to debounce
 * @param delay Delay in milliseconds
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook that debounces a callback function
 * @param callback The callback function to debounce
 * @param delay Delay in milliseconds
 * @param deps Dependencies array (similar to useCallback)
 * @returns Debounced callback function
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay, ...deps]
  ) as T;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

/**
 * Hook for debounced search functionality
 * @param searchFunction Function to execute the search
 * @param delay Debounce delay in milliseconds
 * @returns Object with search state and methods
 */
export function useDebouncedSearch<T>(
  searchFunction: (query: string) => Promise<T[]>,
  delay: number = 300
) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, delay);

  const executeSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const searchResults = await searchFunction(searchQuery);
      setResults(searchResults);
    } catch (err: any) {
      setError(err.message || 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchFunction]);

  useEffect(() => {
    executeSearch(debouncedQuery);
  }, [debouncedQuery, executeSearch]);

  const clear = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
    setLoading(false);
  }, []);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    clear,
  };
}

/**
 * Hook for debounced form validation
 * @param validator Validation function
 * @param delay Debounce delay in milliseconds
 * @returns Object with validation state and methods
 */
export function useDebouncedValidation<T>(
  validator: (value: T) => string | null | Promise<string | null>,
  delay: number = 300
) {
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);

  const debouncedValue = useDebounce(value, delay);

  const validate = useCallback(async (val: T) => {
    if (val === null || val === undefined) {
      setError(null);
      return;
    }

    try {
      setValidating(true);
      const validationError = await validator(val);
      setError(validationError);
    } catch (err: any) {
      setError(err.message || 'Validation failed');
    } finally {
      setValidating(false);
    }
  }, [validator]);

  useEffect(() => {
    if (debouncedValue !== null) {
      validate(debouncedValue);
    }
  }, [debouncedValue, validate]);

  const updateValue = useCallback((newValue: T) => {
    setValue(newValue);
    // Clear error immediately when value changes
    if (error) {
      setError(null);
    }
  }, [error]);

  const reset = useCallback(() => {
    setValue(null);
    setError(null);
    setValidating(false);
  }, []);

  return {
    value,
    setValue: updateValue,
    error,
    validating,
    isValid: !error && !validating && value !== null,
    reset,
  };
}

/**
 * Hook for debounced auto-save functionality
 * @param saveFunction Function to save the data
 * @param delay Debounce delay in milliseconds
 * @returns Object with auto-save state and methods
 */
export function useDebouncedAutoSave<T>(
  saveFunction: (data: T) => Promise<void>,
  delay: number = 1000
) {
  const [data, setData] = useState<T | null>(null);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const debouncedData = useDebounce(data, delay);

  const save = useCallback(async (dataToSave: T) => {
    try {
      setSaving(true);
      setError(null);
      await saveFunction(dataToSave);
      setLastSaved(new Date());
    } catch (err: any) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }, [saveFunction]);

  useEffect(() => {
    if (debouncedData !== null) {
      save(debouncedData);
    }
  }, [debouncedData, save]);

  const updateData = useCallback((newData: T) => {
    setData(newData);
    // Clear error when data changes
    if (error) {
      setError(null);
    }
  }, [error]);

  const manualSave = useCallback(() => {
    if (data !== null) {
      save(data);
    }
  }, [data, save]);

  const reset = useCallback(() => {
    setData(null);
    setSaving(false);
    setLastSaved(null);
    setError(null);
  }, []);

  const hasUnsavedChanges = data !== null && lastSaved === null && !saving;

  return {
    data,
    setData: updateData,
    saving,
    lastSaved,
    error,
    hasUnsavedChanges,
    manualSave,
    reset,
  };
}

/**
 * Hook for debounced resize detection
 * @param delay Debounce delay in milliseconds
 * @returns Current window dimensions
 */
export function useDebouncedResize(delay: number = 100) {
  const [dimensions, setDimensions] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  }));

  const updateDimensions = useDebouncedCallback(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, delay);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions]);

  return dimensions;
}
