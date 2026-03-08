interface AppConfig {
  projectsBaseUrl: string;
}

let appConfig: AppConfig | null = null;

export async function loadAppConfig(): Promise<void> {
  const response = await fetch('/config.json');
  if (!response.ok) {
    throw new Error('Failed to load app config');
  }

  const config = await response.json();

  if (!config.projectsBaseUrl) {
    throw new Error('projectsBaseUrl is required in config.json');
  }

  appConfig = {
    projectsBaseUrl: config.projectsBaseUrl,
  };
}

export function getAppConfig(): AppConfig {
  if (!appConfig) {
    throw new Error('App config is not loaded. Call loadAppConfig() first.');
  }
  return appConfig;
}
