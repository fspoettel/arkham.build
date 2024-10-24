import { useEffect, useState } from "react";

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

  return [pref, setPref] as const;
}
