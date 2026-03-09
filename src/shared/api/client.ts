import axios, { AxiosError } from 'axios';
import type {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig
} from 'axios';
import { useTokenStore } from '@/shared/stores';
import { appConfig } from '@/shared/config/app';
import type { ApiError, ApiResponse } from './types';

const AUTH_REFRESH_PATH = '/auth/refresh';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (error?: unknown) => void;
  request: AxiosRequestConfig & { _retry?: boolean };
  client: AxiosInstance;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  const queue = failedQueue;
  failedQueue = [];

  queue.forEach((item) => {
    if (error || !token) {
      item.reject(error);
      return;
    }

    if (item.request.headers) {
      item.request.headers.Authorization = `Bearer ${token}`;
    }

    item.resolve(item.client(item.request));
  });
};

export function createServiceClient(baseURL: string): AxiosInstance {
  const client = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 30000
  });

  client.interceptors.request.use(
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

  return client;
}

const authClient = createServiceClient(appConfig.api.auth);
const projectsClient = createServiceClient(appConfig.api.projects);
const eventsClient = createServiceClient(appConfig.api.events);

export const api = {
  auth: authClient,
  projects: projectsClient,
  events: eventsClient
} as const;

function attachAuthRefreshInterceptor(client: AxiosInstance) {
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiError>) => {
      const originalRequest = error.config as
        | (AxiosRequestConfig & { _retry?: boolean })
        | undefined;

      if (!originalRequest) return Promise.reject(error);

      const url = String(originalRequest.url ?? '');
      const isRefreshCall = url.includes(AUTH_REFRESH_PATH);

      if (error.response?.status === 401 && !originalRequest._retry && !isRefreshCall) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve,
              reject,
              request: originalRequest,
              client
            });
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
            window.location.href = '/sign-in';
          }

          return Promise.reject(error);
        }

        try {
          const response = await api.auth.post<
            ApiResponse<{ accessToken: string; refreshToken?: string }>
          >(AUTH_REFRESH_PATH, { refreshToken });

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

          return client(originalRequest);
        } catch (refreshError) {
          useTokenStore.getState().clearTokens();
          processQueue(refreshError as AxiosError, null);
          isRefreshing = false;

          if (typeof window !== 'undefined') {
            window.location.href = '/sign-in';
          }

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
}

[api.auth, api.projects, api.events].forEach(attachAuthRefreshInterceptor);

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
