const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

export const appConfig = {
  apiBaseUrl: API_BASE_URL
} as const;
