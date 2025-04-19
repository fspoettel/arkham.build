import { Field, FieldLabel } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { getAvailableThemes, useThemeManager } from "@/utils/use-color-theme";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";

export function ThemeSetting({
  setSettingsTheme,
}: { setSettingsTheme: (theme: string | null) => void }) {
  const [currentTheme, setCurrentTheme] = useThemeManager();
  const { t } = useTranslation();

  useEffect(() => {
    setSettingsTheme(currentTheme);
  }, [currentTheme, setSettingsTheme]);

  const onValueChange = useCallback(
    (value: string) => {
      setCurrentTheme(value);
    },
    [setCurrentTheme],
  );

  return (
    <Field bordered>
      <FieldLabel>{t("settings.display.theme")}</FieldLabel>
      <Select
        data-testid={"settings-select-theme"}
        value={currentTheme}
        required
        onChange={(evt) => onValueChange(evt.target.value)}
        options={Object.entries(getAvailableThemes()).map(([value, label]) => ({
          label,
          value,
        }))}
      />
    </Field>
  );
}
