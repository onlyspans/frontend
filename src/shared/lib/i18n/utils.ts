import type { SupportedLanguage } from './types.ts';

export const mapLanguageCode = (code: string | null | undefined): SupportedLanguage => {
  if (!code) return 'en';

  const normalized = code.toLowerCase().split('-')[0];

  if (normalized === 'en' || normalized === 'ru') {
    return normalized as SupportedLanguage;
  }

  return 'en';
};
