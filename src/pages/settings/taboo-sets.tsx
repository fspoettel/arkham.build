import { useEffect, useState } from "react";

import { Field } from "@/components/ui/field";
import { useStore } from "@/store";
import { selectOptions } from "@/store/selectors/filters/taboo-set";
import type { SettingsState } from "@/store/slices/settings/types";

type Props = {
  settings: SettingsState;
};

export function TabooSets({ settings }: Props) {
  const tabooSets = useStore(selectOptions);

  const [value, setValue] = useState(settings.tabooSetId);

  useEffect(() => {
    setValue(settings.tabooSetId);
  }, [settings]);

  return (
    <Field>
      <label htmlFor="taboo-set">Default taboo list</label>
      <select
        name="taboo-set"
        id="taboo-set"
        onChange={(evt) => setValue(+evt.target.value || null)}
        value={value ?? ""}
      >
        <option value="">None</option>
        {tabooSets.map((set) => (
          <option value={set.id} key={set.id}>
            {set.name} - {set.date}
          </option>
        ))}
      </select>
    </Field>
  );
}
