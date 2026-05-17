// lib/api.ts
import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const baseURL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api`;

const api: AxiosInstance = axios.create({ baseURL, withCredentials: true });

// Request interceptor to attach JWT token from cookie/localStorage
api.interceptors.request.use(
  (config: any) => {
    // If the URL starts with /api/, strip it since baseURL already has /api
    if (config.url && config.url.startsWith('/api/')) {
      config.url = config.url.replace('/api/', '/');
    }
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

let isRedirecting = false;

// Response interceptor for auth errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401 && !isRedirecting) {
      isRedirecting = true;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 100);
      }
    }
    return Promise.reject(error);
  },
);

export const get = <T = any>(url: string, config?: AxiosRequestConfig) => api.get<T>(url, config).then(res => res.data);
export const post = <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => api.post<T>(url, data, config).then(res => res.data);
export const put = <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => api.put<T>(url, data, config).then(res => res.data);
export const del = <T = any>(url: string, config?: AxiosRequestConfig) => api.delete<T>(url, config).then(res => res.data);
export const postForm = <T = any>(url: string, formData: FormData, config?: AxiosRequestConfig) =>
  api.post<T>(url, formData, { headers: { 'Content-Type': 'multipart/form-data' }, ...config }).then(res => res.data);

export default api;
