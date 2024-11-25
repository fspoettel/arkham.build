import { Collection } from "@/components/collection/collection";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast.hooks";
import { AppLayout } from "@/layouts/app-layout";
import { useStore } from "@/store";
import { useGoBack } from "@/utils/use-go-back";
import {
  DatabaseBackupIcon,
  LibraryIcon,
  SlidersVerticalIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useSearch } from "wouter";
import { BackupRestore } from "./backup-restore";
import { CardDataSync } from "./card-data-sync";
import { Connections } from "./connections";
import { HideWeaknessSetting } from "./hide-weakness";
import { ListSettings } from "./list-settings";
import { Section } from "./section";
import css from "./settings.module.css";
import { ShowAllCards } from "./show-all-cards";
import { TabooSet } from "./taboo-set";
import { Theme } from "./theme";

function Settings() {
  const search = useSearch();
  const toast = useToast();
  const goBack = useGoBack(search.includes("login_state") ? "/" : undefined);

  const updateStoredSettings = useStore((state) => state.updateSettings);

  const storedSettings = useStore((state) => state.settings);
  const [settings, updateSettings] = useState(structuredClone(storedSettings));

  useEffect(() => {
    updateSettings(storedSettings);
  }, [storedSettings]);

  const onSubmit = useCallback(
    (evt: React.FormEvent) => {
      evt.preventDefault();
      updateStoredSettings(settings);
      toast.show({
        children: "Settings save successful.",
        duration: 3000,
        variant: "success",
      });
    },
    [updateStoredSettings, settings, toast.show],
  );

  return (
    <AppLayout title="Settings">
      <form className={css["settings"]} onSubmit={onSubmit}>
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
          <div className={css["row"]}>
            <Section title="Connected accounts">
              <Connections />
            </Section>
            <Section title="Card data">
              <CardDataSync showDetails />
            </Section>
          </div>
          <Tabs defaultValue="general">
            <TabsList>
              <TabsTrigger data-testid="tab-general" value="general">
                <SlidersVerticalIcon />
                <span>General</span>
              </TabsTrigger>
              <TabsTrigger data-testid="tab-collection" value="collection">
                <LibraryIcon />
                <span>Collection</span>
              </TabsTrigger>
              <TabsTrigger data-testid="tab-backup" value="backup">
                <DatabaseBackupIcon />
                <span>Backup & Restore</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="general" forceMount>
              <Section title="General">
                <Theme />
                <TabooSet settings={settings} updateSettings={updateSettings} />
                <HideWeaknessSetting
                  settings={settings}
                  updateSettings={updateSettings}
                />
              </Section>
              <Section title="Lists">
                <div className={css["lists"]}>
                  <ListSettings
                    listKey="player"
                    title="Player cards"
                    settings={settings}
                    updateSettings={updateSettings}
                  />
                  <ListSettings
                    listKey="encounter"
                    title="Encounter cards"
                    settings={settings}
                    updateSettings={updateSettings}
                  />
                </div>
              </Section>
            </TabsContent>
            <TabsContent value="collection" forceMount>
              <Section title="Collection">
                <ShowAllCards
                  settings={settings}
                  updateSettings={updateSettings}
                />
                <Collection
                  settings={settings}
                  updateSettings={updateSettings}
                />
              </Section>
            </TabsContent>
            <TabsContent value="backup" forceMount>
              <Section title="Backup & Restore">
                <BackupRestore />
              </Section>
            </TabsContent>
          </Tabs>
        </div>
      </form>
    </AppLayout>
  );
}

export default Settings;
