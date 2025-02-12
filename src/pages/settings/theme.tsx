import { Field, FieldLabel } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { AVAILABLE_THEMES, useColorTheme } from "@/utils/use-color-theme";
import { useTranslation } from "react-i18next";

export function ThemeSetting() {
  const [pref, setPref] = useColorTheme();
  const { t } = useTranslation();

  return (
    <Field bordered>
      <FieldLabel>{t("settings.display.theme")}</FieldLabel>
      <Select
        value={pref}
        required
        onChange={(evt) => setPref(evt.target.value)}
        options={Object.entries(AVAILABLE_THEMES).map(([value, label]) => ({
          label,
          value,
        }))}
      />
    </Field>
  );
}
