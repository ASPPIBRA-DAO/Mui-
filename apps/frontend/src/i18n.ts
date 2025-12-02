import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en', // Se falhar a detecção, usa Inglês
    debug: true, // Ajuda a ver erros no console durante o desenvolvimento
    
    interpolation: {
      escapeValue: false,
    },
    
    backend: {
      // Caminho exato baseado na sua pasta public/locales
      loadPath: '/locales/{{lng}}/translation.json',
    }
  });

export default i18n;