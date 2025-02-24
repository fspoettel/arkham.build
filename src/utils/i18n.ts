import i18n from "i18next";

import { initReactI18next } from "react-i18next";

import en from "@/locales/en.json";
import type { Locale } from "@/store/slices/settings.types";

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  resources: {
    en,
  },
  interpolation: {
    escapeValue: false,
  },
});

export async function changeLanguage(lng: Locale) {
  if (i18n.language === lng) return;

  document.documentElement.lang = lng;

  if (!i18n.hasResourceBundle(lng, "translation")) {
    try {
      const translations = await import(`@/locales/${lng}.json`);
      i18n.addResourceBundle(
        lng,
        "translation",
        translations.default.translation,
      );
    } catch (error) {
      console.error("Failed to load translations:", error);
      return;
    }
  }

  i18n.changeLanguage(lng);
}

export default i18n;
