import { FormEvent, useCallback } from "react";

import { SettingsLayout } from "@/components/layouts/settings-layout";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { useStore } from "@/store";
import { selectIsInitialized } from "@/store/selectors";
import { selectTabooSets } from "@/store/selectors/filters/tabooSet";

export function Settings() {
  const settings = useStore((state) => state.settings);
  const initialized = useStore(selectIsInitialized);

  const tabooSets = useStore(selectTabooSets);

  const updateSettings = useStore((state) => state.updateSettings);

  const onSubmit = useCallback(
    (evt: FormEvent<HTMLFormElement>) => {
      evt.preventDefault();

      if (evt.target instanceof HTMLFormElement) {
        const data = new FormData(evt.target);
        const tabooSetStr = data.get("taboo-set")?.toString();
        updateSettings({
          tabooSetId: tabooSetStr ? +tabooSetStr : null,
        });
      }
    },
    [updateSettings],
  );

  if (!initialized) return null;

  return (
    <SettingsLayout>
      <form onSubmit={onSubmit}>
        <Field id="taboo-set" label="Select taboo list">
          <select
            name="taboo-set"
            id="taboo-set"
            defaultValue={settings.tabooSetId ?? ""}
          >
            <option value="">None</option>
            {tabooSets.map((set) => (
              <option value={set.id} key={set.id}>
                {set.name} - {set.date}
              </option>
            ))}
          </select>
        </Field>
        <footer>
          <Button type="submit">Save settings</Button>
        </footer>
      </form>
    </SettingsLayout>
  );
}
