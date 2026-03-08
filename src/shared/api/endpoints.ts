import { appConfig } from '@/shared/config/app';

function createEndpoints<T extends Record<string, string | ((...args: any[]) => string)>>(
  base: string,
  endpoints: T
): {
  [K in keyof T]: T[K] extends (...args: any[]) => string
    ? (...args: Parameters<T[K]>) => string
    : string;
} {
  const result = {} as any;

  for (const [key, value] of Object.entries(endpoints)) {
    if (typeof value === 'function') {
      result[key] = (...args: any[]) => `${base}${value(...args)}`;
    } else {
      result[key] = `${base}${value}`;
    }
  }

  return result;
}

export const API_ENDPOINTS = {
  AUTH: createEndpoints('/auth', {
    LOGIN: '/login',
    REGISTER: '/register',
    LOGOUT: '/logout',
    REFRESH: '/refresh',
    ME: '/me',
    VERIFY_EMAIL: '/verify-email',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password'
  }),

  USERS: createEndpoints('/users', {
    BASE: '',
    BY_ID: (id: string) => `/${id}`,
    PROFILE: '/profile',
    UPDATE_PROFILE: '/profile'
  }),

  SPACES: createEndpoints('/spaces', {
    BASE: '',
    BY_ID: (id: string) => `/${id}`,
    BY_SLUG: (slug: string) => `/slug/${slug}`
  })
} as const;

export const getApiBaseUrl = (): string => appConfig.apiBaseUrl;
