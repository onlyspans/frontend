import axios, { type AxiosInstance } from 'axios';
import { appConfig } from '@/shared/config/app';
import { addBearerToken } from './interceptors/request-auth';
import { createAuthRefreshInterceptor } from './interceptors/response-auth-refresh';

export interface ServiceClientOptions {
  bearerToken?: boolean;
}

export function createServiceClient(
  baseURL: string,
  options: ServiceClientOptions = {}
): AxiosInstance {
  const { bearerToken = true } = options;
  const client = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 30000
  });

  if (bearerToken) {
    client.interceptors.request.use(
      addBearerToken,
      (err: unknown) => Promise.reject(err)
    );
  }

  return client;
}

const projectsClient = createServiceClient(appConfig.api.projects, {
  bearerToken: appConfig.auth.enabled
});
const eventsClient = createServiceClient(appConfig.api.events, {
  bearerToken: appConfig.auth.enabled
});
const variablesClient = createServiceClient(appConfig.api.variables, {
  bearerToken: appConfig.auth.enabled
});

export const api = {
  projects: projectsClient,
  events: eventsClient,
  variables: variablesClient
} as const;

if (appConfig.auth.enabled) {
  const attachAuthRefresh = createAuthRefreshInterceptor();
  [api.projects, api.events, api.variables].forEach(attachAuthRefresh);
}
