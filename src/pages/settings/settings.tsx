import { Info } from "lucide-react";
import { useCallback, useRef } from "react";
import { Link } from "wouter";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { AppLayout } from "@/layouts/app-layout";
import { useStore } from "@/store";
import { selectIsInitialized } from "@/store/selectors/shared";
import { useGoBack } from "@/utils/useBack";

import css from "./settings.module.css";

import { CardDataSync } from "./card-data-sync";
import { Collection } from "./collection/collection";
import { TabooSets } from "./taboo-sets";

function Settings() {
  const toast = useToast();
  const goBack = useGoBack();
  const formRef = useRef<HTMLFormElement>(null);

  const initialized = useStore(selectIsInitialized);
  const settings = useStore((state) => state.settings);
  const updateSettings = useStore((state) => state.updateSettings);

  const onSubmit = useCallback(
    (evt: React.FormEvent) => {
      evt.preventDefault();
      if (evt.target instanceof HTMLFormElement) {
        updateSettings(new FormData(evt.target));
        toast({ children: "Settings saved successfully.", variant: "success" });
      }
    },
    [updateSettings, toast],
  );

  if (!initialized) return null;

  return (
    <AppLayout title="Settings">
      <form className={css["settings"]} onSubmit={onSubmit} ref={formRef}>
        <header className={css["settings-header"]}>
          <h1 className={css["settings-title"]}>Settings</h1>
          <div className={css["settings-header-actions"]}>
            <Button onClick={goBack} type="button" variant="bare">
              Back
            </Button>
            <Button type="submit">Save settings</Button>
          </div>
        </header>
        <div className={css["settings-container"]}>
          <Link to="/about">
            <Button as="a">
              <Info />
              About this site
            </Button>
          </Link>
          <CardDataSync />
          <TabooSets settings={settings} />
          <Collection settings={settings} />
        </div>
      </form>
    </AppLayout>
  );
}

export default Settings;
