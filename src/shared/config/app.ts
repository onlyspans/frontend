function getRequiredEnv(key: keyof ImportMetaEnv): string {
  const value = import.meta.env[key as keyof ImportMeta['env']];
  const trimmed = typeof value === 'string' ? value.trim() : '';
  if (!trimmed) {
    throw new Error(`${String(key)} is required.`);
  }
  return trimmed;
}

export const appConfig = {
  api: {
    auth: getRequiredEnv('VITE_AUTH_API_URL'),
    projects: getRequiredEnv('VITE_PROJECTS_API_URL'),
    events: getRequiredEnv('VITE_EVENTS_API_URL'),
    variables: getRequiredEnv('VITE_VARIABLES_API_URL')
  }
} as const;
