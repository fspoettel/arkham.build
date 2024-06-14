import { FormEvent, useCallback, useRef } from "react";

import { SettingsLayout } from "@/components/layouts/settings-layout";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store";
import { selectIsInitialized } from "@/store/selectors";

import css from "./settings.module.css";

import { Collection } from "./collection";
import { TabooSets } from "./taboo-sets";

export function Settings() {
  const formRef = useRef<HTMLFormElement>(null);
  const initialized = useStore(selectIsInitialized);

  const settings = useStore((state) => state.settings);

  const updateSettings = useStore((state) => state.updateSettings);

  const onSubmit = useCallback(
    (evt: FormEvent<HTMLFormElement>) => {
      evt.preventDefault();

      if (evt.target instanceof HTMLFormElement) {
        updateSettings(new FormData(evt.target));
      }
    },
    [updateSettings],
  );

  if (!initialized) return null;

  return (
    <SettingsLayout>
      <form ref={formRef} className={css["settings"]} onSubmit={onSubmit}>
        <header className={css["settings-header"]}>
          <h1 className={css["settings-title"]}>Settings</h1>
          <Button type="submit">Save settings</Button>
        </header>
        <TabooSets settings={settings} />
        <Collection settings={settings} />
      </form>
    </SettingsLayout>
  );
}
