import { config } from '../config/environment';
import { HTTP_STATUS, STORAGE_KEYS, TIMEOUTS } from '../constants';
import { ApiError, ApiMethod, ApiResponse } from '../types';
import { getStorageItem } from '../utils/storage';

export interface RequestConfig {
  method: ApiMethod;
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
  requiresAuth?: boolean;
}

export interface RequestInterceptor {
  onRequest?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
  onRequestError?: (error: any) => any;
}

export interface ResponseInterceptor {
  onResponse?: (response: any) => any;
  onResponseError?: (error: any) => any;
}

class ApiService {
  private baseURL: string;
  private defaultTimeout: number;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  constructor() {
    this.baseURL = config.API_BASE_URL;
    this.defaultTimeout = config.API_TIMEOUT;
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.addRequestInterceptor({
      onRequest: async (config) => {
        if (config.requiresAuth !== false) {
          const token = await getStorageItem<string>(STORAGE_KEYS.AUTH_TOKEN);
          if (token) {
            config.headers = {
              ...config.headers,
              'Authorization': `Bearer ${token}`,
            };
          }
        }

        // Add default headers
        config.headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...config.headers,
        };

        return config;
      },
    });

    // Response interceptor to handle common errors
    this.addResponseInterceptor({
      onResponseError: async (error) => {
        if (error.status === HTTP_STATUS.UNAUTHORIZED) {
          // Handle token expiration
          // You might want to dispatch a logout action here
          console.warn('Unauthorized request - token may be expired');
        }
        throw error;
      },
    });
  }

  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }

  private async executeRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    let modifiedConfig = config;

    for (const interceptor of this.requestInterceptors) {
      if (interceptor.onRequest) {
        try {
          modifiedConfig = await interceptor.onRequest(modifiedConfig);
        } catch (error) {
          if (interceptor.onRequestError) {
            interceptor.onRequestError(error);
          }
          throw error;
        }
      }
    }

    return modifiedConfig;
  }

  private async executeResponseInterceptors(response: any): Promise<any> {
    let modifiedResponse = response;

    for (const interceptor of this.responseInterceptors) {
      if (interceptor.onResponse) {
        try {
          modifiedResponse = await interceptor.onResponse(modifiedResponse);
        } catch (error) {
          if (interceptor.onResponseError) {
            await interceptor.onResponseError(error);
          }
          throw error;
        }
      }
    }

    return modifiedResponse;
  }

  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = `${this.baseURL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      
      const queryString = searchParams.toString();
      return queryString ? `${url}?${queryString}` : url;
    }
    
    return url;
  }

  private async makeRequest<T>(config: RequestConfig): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeout = config.timeout || this.defaultTimeout;
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      // Execute request interceptors
      const modifiedConfig = await this.executeRequestInterceptors(config);

      // Build URL with parameters
      const url = this.buildUrl(modifiedConfig.url, modifiedConfig.params);
      
      // Create fetch options
      const fetchOptions: RequestInit = {
        method: modifiedConfig.method,
        headers: modifiedConfig.headers as HeadersInit,
        // Use the controller's signal which is compatible with React Native
        signal: controller.signal,
      };

      // Add body for non-GET requests
      if (modifiedConfig.data && modifiedConfig.method !== 'GET') {
        if (modifiedConfig.data instanceof FormData) {
          fetchOptions.body = modifiedConfig.data;
          // Remove Content-Type header for FormData (browser will set it)
          const headers = { ...modifiedConfig.headers };
          delete headers['Content-Type'];
          fetchOptions.headers = headers as HeadersInit;
        } else {
          fetchOptions.body = JSON.stringify(modifiedConfig.data);
        }
      }

      // Make the request
      const response = await fetch(url, fetchOptions);
      
      // If the request completes, clear the timeout
      clearTimeout(timeoutId);

      // Parse response
      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      // Check if request was successful
      if (!response.ok) {
        const error: ApiError = {
          success: false,
          error: {
            code: response.status.toString(),
            message: responseData.message || response.statusText,
            details: responseData,
          },
          timestamp: new Date().toISOString(),
        };

        // Execute error response interceptors
        for (const interceptor of this.responseInterceptors) {
          if (interceptor.onResponseError) {
            await interceptor.onResponseError(error);
          }
        }

        throw error;
      }

      // Create successful response
      const successResponse: ApiResponse<T> = {
        success: true,
        data: responseData.data || responseData,
        message: responseData.message || 'Success',
        timestamp: new Date().toISOString(),
      };

      // Execute success response interceptors
      return await this.executeResponseInterceptors(successResponse);

    } catch (error: any) {
      // Ensure the timeout is cleared on any error
      clearTimeout(timeoutId);

      // Handle network errors, timeouts, etc.
      if (error.name === 'AbortError') {
        throw {
          success: false,
          error: {
            code: 'TIMEOUT',
            message: 'Request timeout',
            details: error,
          },
          timestamp: new Date().toISOString(),
        } as ApiError;
      }

      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw {
          success: false,
          error: {
            code: 'NETWORK_ERROR',
            message: 'Network error. Please check your connection.',
            details: error,
          },
          timestamp: new Date().toISOString(),
        } as ApiError;
      }

      // Re-throw API errors
      if (error.success === false) {
        throw error;
      }

      // Handle unexpected errors
      throw {
        success: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: error.message || 'An unexpected error occurred',
          details: error,
        },
        timestamp: new Date().toISOString(),
      } as ApiError;
    }
  }

  // HTTP method helpers
  async get<T>(url: string, params?: Record<string, any>, options?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      method: 'GET',
      url,
      params,
      ...options,
    });
  }

  async post<T>(url: string, data?: any, options?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      method: 'POST',
      url,
      data,
      ...options,
    });
  }

  async put<T>(url: string, data?: any, options?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      method: 'PUT',
      url,
      data,
      ...options,
    });
  }

  async patch<T>(url: string, data?: any, options?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      method: 'PATCH',
      url,
      data,
      ...options,
    });
  }

  async delete<T>(url: string, options?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      method: 'DELETE',
      url,
      ...options,
    });
  }

  // File upload helper
  async uploadFile<T>(
    url: string,
    file: File | FormData,
    onProgress?: (progress: { loaded: number; total: number; percentage: number }) => void,
    options?: Partial<RequestConfig>
  ): Promise<ApiResponse<T>> {
    let formData: FormData;

    if (file instanceof FormData) {
      formData = file;
    } else {
      formData = new FormData();
      formData.append('file', file);
    }

    return this.makeRequest<T>({
      method: 'POST',
      url,
      data: formData,
      timeout: TIMEOUTS.UPLOAD,
      ...options,
    });
  }

  // Utility methods
  setBaseURL(baseURL: string) {
    this.baseURL = baseURL;
  }

  setDefaultTimeout(timeout: number) {
    this.defaultTimeout = timeout;
  }

  getBaseURL(): string {
    return this.baseURL;
  }
}

// Create and export singleton instance
export const apiService = new ApiService();

// Export the class for testing or creating custom instances
export { ApiService };
