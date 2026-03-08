function getRequiredEnv(key: keyof ImportMetaEnv): string {
  const value = import.meta.env[key as keyof ImportMeta['env']];
  const trimmed = typeof value === 'string' ? value.trim() : '';
  if (!trimmed) {
    throw new Error(`${String(key)} is required.`);
  }
  return trimmed;
}

export const appConfig = {
  apiBaseUrl: getRequiredEnv('VITE_API_URL')
} as const;
