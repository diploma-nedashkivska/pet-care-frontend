import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en/translation.json';
import uk from './locales/uk/translation.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    uk: { translation: uk },
  },
  fallbackLng: 'en',
  lng: 'uk', // мова за замовчуванням
  interpolation: {
    escapeValue: false, // не екранізуємо HTML
  },
});

export default i18n;
