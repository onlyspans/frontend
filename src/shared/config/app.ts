interface AppConfig {
  projectsBaseUrl: string;
}

declare global {
  interface Window {
    __APP_CONFIG__: AppConfig;
  }
}

export function getAppConfig(): AppConfig {
  const config = window.__APP_CONFIG__;
  if (!config?.projectsBaseUrl) {
    throw new Error('projectsBaseUrl is required in config.js');
  }
  return config;
}
