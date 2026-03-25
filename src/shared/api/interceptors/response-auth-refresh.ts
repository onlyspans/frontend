import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { AxiosError } from 'axios';
import { useTokenStore } from '@/shared/stores';
import type { ApiError, ApiResponse } from '../types';

const AUTH_REFRESH_PATH = '/auth/refresh';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (error?: unknown) => void;
  request: AxiosRequestConfig & { _retry?: boolean };
  client: AxiosInstance;
}> = [];

function processQueue(error: AxiosError | null, token: string | null = null): void {
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
}

export type GetAuthClient = () => AxiosInstance;

export function createAuthRefreshInterceptor(getAuthClient: GetAuthClient) {
  return function attachToClient(client: AxiosInstance): void {
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
            const authClient = getAuthClient();
            const response = await authClient.post<
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
  };
}
