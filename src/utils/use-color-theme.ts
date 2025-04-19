import i18n from "@/utils/i18n";
import { useEffect, useState } from "react";
import { useMedia } from "./use-media";

export function getAvailableThemes(): Record<string, string> {
  return {
    dark: i18n.t("settings.display.theme_dark"),
    light: i18n.t("settings.display.theme_light"),
    system: i18n.t("settings.display.theme_system"),
  };
}

const DEFAULT_THEME = "dark";

export function getColorThemePreference() {
  const pref = localStorage.getItem("color-scheme-preference");
  if (pref && getAvailableThemes()[pref]) return pref;
  return DEFAULT_THEME;
}

export function getColorThemePreferenceResolveSystem() {
  const [currentTheme] = getColorThemePreference();

  const isDarkMode = useMedia("(prefers-color-scheme: dark)");

  if (currentTheme === "system") {
    return isDarkMode ? "dark" : "light";
  }

  return currentTheme;
}

function applyColorThemeNotPersistent(theme: string, isDarkMode: boolean) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.remove("theme-light", "theme-system");
    root.classList.add("theme-dark");
  } else if (theme === "light") {
    root.classList.remove("theme-dark", "theme-system");
    root.classList.add("theme-light");
  } else {
    root.classList.remove("theme-dark", "theme-light");
    root.classList.add("theme-system");
  }
  if (theme === "system") {
    document.documentElement.dataset.theme = isDarkMode ? "dark" : "light";
  } else {
    document.documentElement.dataset.theme = theme;
  }
}

export function applyStoredColorTheme() {
  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = getColorThemePreference();
  applyColorThemeNotPersistent(theme, isDarkMode);
}

export function useThemeManager() {
  const [currentTheme, setCurrentTheme] = useState(getColorThemePreference());
  const systemIsDarkMode = useMedia("(prefers-color-scheme: dark)");

  useEffect(() => {
    applyColorThemeNotPersistent(currentTheme, systemIsDarkMode);
  }, [currentTheme, systemIsDarkMode]);

  return [currentTheme, setCurrentTheme] as const;
}

export function useResolvedColorTheme() {
  const [currentTheme] = useThemeManager();

  const isDarkMode = useMedia("(prefers-color-scheme: dark)");

  if (currentTheme === "system") {
    return isDarkMode ? "dark" : "light";
  }

  return currentTheme;
}
