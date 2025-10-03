import axios, { AxiosInstance } from 'axios';
import { config } from '../config/environment';
import { STORAGE_KEYS } from '../constants';
import { getStorageItem } from '../utils/storage';
import { AuthApi, CategoryApi, GeneralSearchApi, MediaApi, NotificationApi, ProductApi, VendorApi } from './api';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: config.API_TIMEOUT,
});

axiosInstance.interceptors.request.use(
  async (axiosConfig) => {
    const token = await getStorageItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      axiosConfig.headers.Authorization = `Bearer ${token}`;
    }
    axiosConfig.headers.Accept = 'application/json';
    // Do not force Content-Type for FormData requests — let browser/axios set multipart boundaries
    const data = (axiosConfig as any).data;
    const isFormData = typeof FormData !== 'undefined' && data && (data instanceof FormData || (data && typeof data.append === 'function'));
    if (!isFormData) {
      axiosConfig.headers['Content-Type'] = 'application/json';
    } else {
      // remove any existing content-type to allow automatic boundary generation
      delete (axiosConfig.headers as any)['Content-Type'];
      delete (axiosConfig.headers as any)['content-type'];
    }

    return axiosConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authApi = () => new AuthApi(undefined, config.API_BASE_URL, axiosInstance);
export const vendorApi = () => new VendorApi(undefined, config.API_BASE_URL, axiosInstance);
export const mediaApi = () => new MediaApi(undefined, config.API_BASE_URL, axiosInstance);
export const notificationApi = () => new NotificationApi(undefined, config.API_BASE_URL, axiosInstance);
export const productApi = () => new ProductApi(undefined, config.API_BASE_URL, axiosInstance);
export const generalSearchApi = () => new GeneralSearchApi(undefined, config.API_BASE_URL, axiosInstance);
export const categoryApi = () => new CategoryApi(undefined, config.API_BASE_URL, axiosInstance);
