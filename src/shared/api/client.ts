import axios, { AxiosError } from 'axios';
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { useTokenStore } from '@/shared/stores';
import { getApiBaseUrl } from './endpoints';
import type { ApiError, ApiResponse } from './types';

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useTokenStore.getState().accessToken;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const tokenStore = useTokenStore.getState();
      const refreshToken = tokenStore.refreshToken;

      if (!refreshToken) {
        tokenStore.clearTokens();
        processQueue(error, null);
        isRefreshing = false;

        if (typeof window !== 'undefined') {
          // window.location.href = '/login';
        }

        return Promise.reject(error);
      }

      try {
        const response = await axios.post<ApiResponse<{ accessToken: string; refreshToken?: string }>>(
          `${getApiBaseUrl()}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        if (newRefreshToken) {
          tokenStore.setTokens(accessToken, newRefreshToken);
        } else {
          tokenStore.setAccessToken(accessToken);
        }

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        processQueue(null, accessToken);
        isRefreshing = false;

        return apiClient(originalRequest);
      } catch (refreshError) {
        useTokenStore.getState().clearTokens();
        processQueue(refreshError as AxiosError, null);
        isRefreshing = false;

        if (typeof window !== 'undefined') {
          // window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError | undefined;

    if (apiError?.message) {
      return apiError.message;
    }

    if (error.response?.status === 401) {
      return 'Authentication required';
    }

    if (error.response?.status === 403) {
      return 'Access forbidden';
    }

    if (error.response?.status === 404) {
      return 'Resource not found';
    }

    if (error.response?.status === 500) {
      return 'Internal server error';
    }

    if (error.message) {
      return error.message;
    }
  }

  return 'An unknown error occurred';
};

export const extractData = <T>(response: { data: ApiResponse<T> }): T => {
  return response.data.data;
};

export default apiClient;
