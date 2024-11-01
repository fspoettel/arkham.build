import { useMemo } from "react";

export function useAccentColor(factionCode: string) {
  const cssVariables = useMemo(
    () =>
      ({
        "--accent-color":
          factionCode === "neutral"
            ? "var(--palette-3)"
            : `var(--color-${factionCode})`,
        "--accent-color-dark": `var(--${factionCode}-dark)`,
        "--acent-color-contrast": "var(--palette-6)",
      }) as React.CSSProperties,
    [factionCode],
  );

  return cssVariables;
}
