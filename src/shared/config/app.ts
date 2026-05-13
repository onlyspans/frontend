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

function parseBooleanEnv(
  value: string | undefined,
  defaultValue: boolean
): boolean {
  const normalized = (value ?? '').trim().toLowerCase();
  if (!normalized) return defaultValue;
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  return defaultValue;
}

function getRequiredEnvIf(enabled: boolean, key: keyof ImportMetaEnv): string | undefined {
  return enabled ? getRequiredEnv(key) : getOptionalEnv(key);
}

const authEnabled = parseBooleanEnv(getOptionalEnv('VITE_AUTH_ENABLED'), true);

export const appConfig = {
  auth: {
    enabled: authEnabled
  },
  api: {
    projects: getRequiredEnv('VITE_PROJECTS_API_URL'),
    events: getRequiredEnv('VITE_EVENTS_API_URL'),
    variables: getRequiredEnv('VITE_VARIABLES_API_URL')
  },
  oidc: {
    issuer: getRequiredEnvIf(authEnabled, 'VITE_OIDC_ISSUER'),
    clientId: getRequiredEnvIf(authEnabled, 'VITE_OIDC_CLIENT_ID'),
    redirectUri: getRequiredEnvIf(authEnabled, 'VITE_OIDC_REDIRECT_URI'),
    silentRedirectUri: getOptionalEnv('VITE_OIDC_SILENT_REDIRECT_URI')
  }
} as const;
