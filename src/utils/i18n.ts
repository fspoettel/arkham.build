import i18n, { type LanguageDetectorModule } from "i18next";

import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";

import en from "@/locales/en.json";
import type { Locale } from "@/store/slices/settings.types";

const localStorageDectector: LanguageDetectorModule = {
  type: "languageDetector",
  detect() {
    const lang = localStorage.getItem("i18nextLng");
    return lang || "en";
  },
  cacheUserLanguage(lng: string) {
    localStorage.setItem("i18nextLng", lng);
  },
};

const importBackend = resourcesToBackend(
  async (lng: string, namespace: string) => {
    const bundle = await import(`@/locales/${lng}.json`);
    return bundle.default[namespace];
  },
);

i18n
  .use(localStorageDectector)
  .use(importBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    load: "languageOnly",
    partialBundledLanguages: true,
    resources: {
      en,
    },
    interpolation: {
      escapeValue: false,
    },
  });

export function changeLanguage(lng: Locale) {
  if (i18n.language === lng) return;
  document.documentElement.lang = lng;
  i18n.changeLanguage(lng);
}

export default i18n;
