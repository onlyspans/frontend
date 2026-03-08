import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
import ruTranslations from './locales/ru.json';

const resources = {
  en: {
    translation: enTranslations
  },
  ru: {
    translation: ruTranslations
  },
};

const savedLng = typeof localStorage !== 'undefined' ? localStorage.getItem('language') : null;
const initialLng = (savedLng === 'en' || savedLng === 'ru') ? savedLng : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLng,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: true
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;
