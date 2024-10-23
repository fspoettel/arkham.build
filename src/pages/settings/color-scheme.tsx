import { Field, FieldLabel } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { AVAILABLE_THEMES, useDarkMode } from "@/utils/use-dark-mode";

export function ColorScheme() {
  const [pref, setPref] = useDarkMode();

  return (
    <Field bordered>
      <FieldLabel>Color scheme</FieldLabel>
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
