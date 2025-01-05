import { useEffect, useState } from "react";
import { useMedia } from "./use-media";

export const AVAILABLE_THEMES: Record<string, string> = {
  dark: "Dark",
  light: "Light",
  system: "System",
};

const DEFAULT_THEME = "dark";

function getPreference() {
  const pref = localStorage.getItem("color-scheme-preference");
  if (pref && AVAILABLE_THEMES[pref]) return pref;
  return DEFAULT_THEME;
}

export function useColorTheme() {
  const [pref, setPref] = useState(getPreference());

  useEffect(() => {
    const root = document.documentElement;
    if (pref === "dark") {
      root.classList.remove("theme-light", "theme-system");
      root.classList.add("theme-dark");
    } else if (pref === "light") {
      root.classList.remove("theme-dark", "theme-system");
      root.classList.add("theme-light");
    } else {
      root.classList.remove("theme-dark", "theme-light");
      root.classList.add("theme-system");
    }

    localStorage.setItem("color-scheme-preference", pref);
  }, [pref]);

  const isDarkMode = useMedia("(prefers-color-scheme: dark)");

  useEffect(() => {
    if (pref === "system") {
      document.documentElement.dataset.theme = isDarkMode ? "dark" : "light";
    } else {
      document.documentElement.dataset.theme = pref;
    }
  }, [pref, isDarkMode]);

  return [pref, setPref] as const;
}

export function useResolvedColorTheme() {
  const [pref] = useColorTheme();

  const isDarkMode = useMedia("(prefers-color-scheme: dark)");

  if (pref === "system") {
    return isDarkMode ? "dark" : "light";
  }

  return pref;
}
