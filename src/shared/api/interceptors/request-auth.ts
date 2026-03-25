import type { InternalAxiosRequestConfig } from 'axios';
import { useTokenStore } from '@/shared/stores';

export function addBearerToken(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const token = useTokenStore.getState().accessToken;

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}
