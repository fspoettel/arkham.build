import i18n from "i18next";

import { initReactI18next } from "react-i18next";

import en from "@/locales/en.json";

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  resources: {
    en,
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
