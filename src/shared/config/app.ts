function getRequiredEnv(key: keyof ImportMetaEnv): string {
  const value = import.meta.env[key as keyof ImportMeta['env']];
  const trimmed = typeof value === 'string' ? value.trim() : '';
  if (!trimmed) {
    throw new Error(`${String(key)} is required.`);
  }
  return trimmed;
}

function getOptionalEnv(key: keyof ImportMetaEnv): string | undefined {
  const value = import.meta.env[key as keyof ImportMeta['env']];
  const trimmed = typeof value === 'string' ? value.trim() : '';
  return trimmed || undefined;
}

export const appConfig = {
  api: {
    projects: getRequiredEnv('VITE_PROJECTS_API_URL'),
    events: getRequiredEnv('VITE_EVENTS_API_URL'),
    variables: getRequiredEnv('VITE_VARIABLES_API_URL')
  },
  oidc: {
    issuer: getRequiredEnv('VITE_OIDC_ISSUER'),
    clientId: getRequiredEnv('VITE_OIDC_CLIENT_ID'),
    redirectUri: getRequiredEnv('VITE_OIDC_REDIRECT_URI'),
    silentRedirectUri: getOptionalEnv('VITE_OIDC_SILENT_REDIRECT_URI')
  }
} as const;
