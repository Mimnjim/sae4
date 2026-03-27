import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import frTranslation from './locales/fr.json';
import enTranslation from './locales/en.json';

// Récupère la langue depuis localStorage, par défaut 'fr'
const savedLang = localStorage.getItem('lang') || 'fr';

i18next
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: frTranslation },
      en: { translation: enTranslation },
    },
    lng: savedLang,
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;
