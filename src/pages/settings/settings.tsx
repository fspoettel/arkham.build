import type { FormEvent } from "react";
import { useCallback, useRef } from "react";
import { Link } from "wouter";

import { AppLayout } from "@/components/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Scroller } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/store";
import { selectIsInitialized } from "@/store/selectors";

import css from "./settings.module.css";

import { CardDataSync } from "./card-data-sync";
import { Collection } from "./collection";
import { TabooSets } from "./taboo-sets";

export function Settings() {
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
    <AppLayout title="Settings">
      <Scroller>
        <form ref={formRef} className={css["settings"]} onSubmit={onSubmit}>
          <header className={css["settings-header"]}>
            <h1 className={css["settings-title"]}>Settings</h1>
            <div className={css["settings-header-actions"]}>
              <Link href="/">
                <Button as="a" type="button" variant="bare">
                  Back
                </Button>
              </Link>
              <Button type="submit">Save settings</Button>
            </div>
          </header>
          <CardDataSync />
          <TabooSets settings={settings} />
          <Collection settings={settings} />
        </form>
      </Scroller>
    </AppLayout>
  );
}
