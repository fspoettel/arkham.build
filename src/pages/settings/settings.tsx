import { useCallback, useRef } from "react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { AppLayout } from "@/layouts/app-layout";
import { useStore } from "@/store";
import { selectIsInitialized } from "@/store/selectors/shared";
import { useGoBack } from "@/utils/use-go-back";

import css from "./settings.module.css";

import { Collection } from "@/components/collection/collection";
import { CardDataSync } from "./card-data-sync";
import { General } from "./general";
import { Section } from "./section";
import { ShowAllCards } from "./show-all-cards";
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
        toast.show({
          children: "Settings save successful.",
          duration: 3000,
          variant: "success",
        });
      }
    },
    [updateSettings, toast.show],
  );

  if (!initialized) return null;

  return (
    <AppLayout title="Settings">
      <form className={css["settings"]} onSubmit={onSubmit} ref={formRef}>
        <header className={css["header"]}>
          <h1 className={css["title"]}>Settings</h1>
          <div className={css["header-actions"]}>
            <Button
              data-testid="settings-back"
              onClick={goBack}
              type="button"
              variant="bare"
            >
              Back
            </Button>
            <Button data-testid="settings-save" type="submit" variant="primary">
              Save settings
            </Button>
          </div>
        </header>
        <div className={css["container"]}>
          <Section title="Card data">
            <CardDataSync />
          </Section>
          <Section title="General">
            <TabooSets settings={settings} />
            <General settings={settings} />
          </Section>
          <Section title="Collection">
            <ShowAllCards settings={settings} />
            <Collection canEdit settings={settings} />
          </Section>
        </div>
      </form>
    </AppLayout>
  );
}

export default Settings;
