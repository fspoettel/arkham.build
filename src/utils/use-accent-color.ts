import { useMemo } from "react";

export function useAccentColor(factionCode: string) {
  const cssVariables = useMemo(
    () =>
      ({
        "--accent-color":
          factionCode === "neutral" ? "var(--nord-3)" : `var(--${factionCode})`,
        "--accent-color-dark": `var(--${factionCode}-dark)`,
        "--acent-color-contrast": "var(--nord-6)",
      }) as React.CSSProperties,
    [factionCode],
  );

  return cssVariables;
}
