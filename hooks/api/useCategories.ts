import { useCallback, useEffect, useMemo, useState } from 'react';

// API & Models
import { apiConfig } from '../../api/config';
import { CategoryApi } from '../../api/endpoints/category-api';
import { Category } from '../../api/models';

// Contexts
import { toast } from '../../utils/toast';

// Types
type ApiError = { response?: { data?: { message?: string } }; message?: string };

interface UseCategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

interface UseCategoryState {
  category: Category | null;
  loading: boolean;
  error: string | null;
}

export const useCategories = (autoFetch: boolean = true) => {
  const [state, setState] = useState<UseCategoriesState>({
    categories: [],
    loading: false,
    error: null,
  });

  const showError = useCallback((m: string) => toast.error(m), []);
  const categoryApi = useMemo(() => new CategoryApi(apiConfig), []);

  const handleError = useCallback((error: ApiError, defaultMessage: string) => {
    const errorMessage = error?.response?.data?.message || error?.message || defaultMessage;
    showError(errorMessage);
    return errorMessage;
  }, [showError]);

  const fetchCategories = useCallback(async (
    parentId?: string,
    type?: 'top' | 'sub',
    name?: string
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await categoryApi.categoryGet(parentId, type, name);
      setState({
        categories: response.data || [],
        loading: false,
        error: null,
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = handleError(error, 'Failed to fetch categories');
      setState({
        categories: [],
        loading: false,
        error: errorMessage,
      });
      // Don't throw error for background data fetching
      console.error('Categories fetch error:', error);
    }
  }, [categoryApi, handleError]);

  const fetchTopCategories = useCallback(() => {
    return fetchCategories(undefined, 'top');
  }, [fetchCategories]);

  const fetchSubCategories = useCallback((parentId: string) => {
    return fetchCategories(parentId, 'sub');
  }, [fetchCategories]);

  // Auto-fetch categories on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchTopCategories();
    }
  }, [autoFetch, fetchTopCategories]);

  return {
    ...state,
    fetchCategories,
    fetchTopCategories,
    fetchSubCategories,
    refetch: fetchTopCategories,
  };
};

export const useCategory = () => {
  const [state, setState] = useState<UseCategoryState>({
    category: null,
    loading: false,
    error: null,
  });

  const showError = useCallback((m: string) => toast.error(m), []);
  const categoryApi = useMemo(() => new CategoryApi(apiConfig), []);

  const handleError = useCallback((error: ApiError, defaultMessage: string) => {
    const errorMessage = error?.response?.data?.message || error?.message || defaultMessage;
    showError(errorMessage);
    return errorMessage;
  }, [showError]);

  const fetchCategory = useCallback(async (categoryId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await categoryApi.categoryIdGet(categoryId);
      setState({
        category: response.data,
        loading: false,
        error: null,
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = handleError(error, 'Failed to fetch category');
      setState({
        category: null,
        loading: false,
        error: errorMessage,
      });
      throw error;
    }
  }, [categoryApi, handleError]);

  return {
    ...state,
    fetchCategory,
  };
};
