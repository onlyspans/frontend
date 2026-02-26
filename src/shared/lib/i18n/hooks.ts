import { useTranslation as useI18nTranslation } from 'react-i18next';
import type { TypedTFunction, TranslationKey, SupportedLanguage } from './types';

export const useTranslation = () => {
  const { t: originalT, i18n } = useI18nTranslation();

  const t: TypedTFunction = ((key: TranslationKey, params?: Record<string, string | number>) => {
    if (params) {
      return originalT(key, params);
    }
    return originalT(key);
  }) as TypedTFunction;

  const changeLanguage = (lng: SupportedLanguage) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return {
    t,
    changeLanguage,
    currentLanguage: (i18n.language || 'en') as SupportedLanguage
  };
};
