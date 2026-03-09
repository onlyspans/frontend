import axios, { type AxiosInstance } from 'axios';
import { appConfig } from '@/shared/config/app';
import { addBearerToken } from './interceptors/request-auth';
import { createAuthRefreshInterceptor } from './interceptors/response-auth-refresh';

export function createServiceClient(baseURL: string): AxiosInstance {
  const client = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 30000
  });

  client.interceptors.request.use(
    addBearerToken,
    (err: unknown) => Promise.reject(err)
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

const attachAuthRefresh = createAuthRefreshInterceptor(() => api.auth);
[api.auth, api.projects, api.events].forEach(attachAuthRefresh);
