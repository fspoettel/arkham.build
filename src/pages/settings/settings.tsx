import type { FormEvent } from "react";
import { useCallback, useRef } from "react";
import { Link } from "wouter";

import { Masthead } from "@/components/masthead";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/store";
import { selectIsInitialized } from "@/store/selectors";

import css from "./settings.module.css";

import { CardDataSync } from "./card-data-sync";
import { Collection } from "./collection";
import { TabooSets } from "./taboo-sets";

function Settings() {
  const toast = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const initialized = useStore(selectIsInitialized);
  const settings = useStore((state) => state.settings);
  const updateSettings = useStore((state) => state.updateSettings);

  const onSubmit = useCallback(
    (evt: FormEvent<HTMLFormElement>) => {
      evt.preventDefault();

      if (evt.target instanceof HTMLFormElement) {
        updateSettings(new FormData(evt.target));
        toast("Settings saved successfully.");
      }
    },
    [updateSettings, toast],
  );

  if (!initialized) return null;

  return (
    <div className={css["container"]}>
      <Masthead />
      <form ref={formRef} className={css["settings"]} onSubmit={onSubmit}>
        <header className={css["settings-header"]}>
          <h1 className={css["settings-title"]}>Settings</h1>
          <div className={css["settings-header-actions"]}>
            <Link href="/" asChild>
              <Button as="a" type="button" variant="bare">
                Back
              </Button>
            </Link>
            <Button type="submit">Save settings</Button>
          </div>
        </header>
        <div className={css["settings-container"]}>
          <CardDataSync />
          <TabooSets settings={settings} />
          <Collection settings={settings} />
        </div>
      </form>
    </div>
  );
}

export default Settings;
