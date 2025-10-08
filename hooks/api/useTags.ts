import { apiConfig } from '@/api/config';
import { TagApi } from '@/api/endpoints/tag-api';
import { Tag } from '@/api/models';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner-native';

type ApiError = { response?: { data?: { message?: string } }; message?: string };

interface UseTagsState {
  tags: Tag[];
  loading: boolean;
  error: string | null;
}

export const useTags = () => {
  const [state, setState] = useState<UseTagsState>({
    tags: [],
    loading: false,
    error: null,
  });

  const tagApi = useMemo(() => new TagApi(apiConfig), []);

  const handleError = useCallback((error: ApiError, defaultMessage: string) => {
    const errorMessage = error?.response?.data?.message || error?.message || defaultMessage;
    toast.error(errorMessage);
    return errorMessage;
  }, []);

  const fetchAllTags = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Assuming an endpoint exists to fetch all tags
      const response = await tagApi.tagsGet();
      const data = response.data as Tag[];
      setState({
        tags: data,
        loading: false,
        error: null,
      });
      return data;
    } catch (error: any)   {   
      const errorMessage = handleError(error, 'Failed to fetch tags');
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return null;
    }
  }, [tagApi, handleError]);

  return {
    ...state,
    fetchAllTags,
  };
};