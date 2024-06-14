import { useEffect, useState } from "react";

import { Field, FieldLabel } from "@/components/ui/field";
import { useStore } from "@/store";
import { selectTabooSetOptions } from "@/store/selectors/filters";
import type { SettingsState } from "@/store/slices/settings.types";
import { formatTabooSet } from "@/utils/formatting";

type Props = {
  settings: SettingsState;
};

export function TabooSets({ settings }: Props) {
  const tabooSets = useStore(selectTabooSetOptions);

  const [value, setValue] = useState(settings.tabooSetId);

  useEffect(() => {
    setValue(settings.tabooSetId);
  }, [settings]);

  return (
    <Field bordered>
      <FieldLabel htmlFor="taboo-set">Default taboo list</FieldLabel>
      <select
        id="taboo-set"
        name="taboo-set"
        onChange={(evt) => setValue(+evt.target.value || undefined)}
        value={value ?? ""}
      >
        <option value="">None</option>
        {tabooSets.map((set) => (
          <option key={set.id} value={set.id}>
            {formatTabooSet(set)}
          </option>
        ))}
      </select>
    </Field>
  );
}
