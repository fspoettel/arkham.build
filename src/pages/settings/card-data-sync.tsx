import { CheckIcon, DoubleArrowUpIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/store";
import { queryDataVersion } from "@/store/services/queries";
import { useQuery } from "@/utils/use-query";

import css from "./card-data-sync.module.css";

export function CardDataSync() {
  const [paused, setPaused] = useState(true);

  const toast = useToast();
  const init = useStore((state) => state.init);
  const dataVersion = useStore((state) => state.metadata.dataVersion);

  const { data, error, loading } = useQuery(() => queryDataVersion());

  const {
    data: synced,
    error: syncError,
    loading: syncing,
  } = useQuery(() => init(true), paused);

  const syncData = useCallback(() => {
    setPaused(false);
  }, []);

  useEffect(() => {
    if (synced) toast("Card data was synced successfully.");
  }, [synced, toast]);

  const enablePersistence = useCallback(() => {
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage
        .persist()
        .then((res) => {
          if (res) {
            toast("Persistence enabled successfully.");
          } else {
            toast("Persistence could not be enabled.");
          }
        })
        .catch((err) => {
          console.error(err);
          toast("Persistence could not be enabled (see browser console).");
        });
    }
  }, [toast]);

  const upToDate =
    data &&
    dataVersion &&
    data.cards_updated_at === dataVersion.cards_updated_at;

  return (
    <>
      <Field className={css["sync"]}>
        <Button
          onClick={syncData}
          // disabled={loading || !!error || upToDate}
          className={css["sync-action"]}
          type="button"
        >
          Sync card data
        </Button>
        <div className={css["sync-status"]}>
          {(loading || syncing) && <p>Loading latest card data...</p>}
          {(!!error || !!syncError) && <p>Could not sync card data.</p>}
          {!loading &&
            !syncing &&
            data &&
            (upToDate ? (
              <p>
                <CheckIcon /> Card data is up to date.
              </p>
            ) : (
              <p>
                <DoubleArrowUpIcon /> New card data is available.
              </p>
            ))}
        </div>
        {dataVersion && (
          <dl className={css["sync-info"]}>
            <dt>Data version:</dt>
            <dd>{dataVersion.cards_updated_at}</dd>
            <dt>Locale:</dt>
            <dd>{dataVersion.locale}</dd>
            <dt>Card count:</dt>
            <dd>{dataVersion.card_count}</dd>
          </dl>
        )}
      </Field>
      <Field
        helpText={`${import.meta.env.VITE_PAGE_NAME} uses IndexedDB to store decks and settings locally. In some circumstances, your browser may clear stored data without notice. Enabling persistence avoids this. Your browser may ask for your permission.`}
      >
        <Button onClick={enablePersistence} type="button">
          Enable persistent storage
        </Button>
      </Field>
    </>
  );
}
