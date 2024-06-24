import clsx from "clsx";
import { Check, FileDown } from "lucide-react";
import { useCallback, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/store";
import {
  queryCards,
  queryDataVersion,
  queryMetadata,
} from "@/store/services/queries";
import { useMutate, useQuery } from "@/utils/use-query";

import css from "./card-data-sync.module.css";

export function CardDataSync() {
  const toast = useToast();
  const init = useStore((state) => state.init);
  const dataVersion = useStore((state) => state.metadata.dataVersion);

  const { data, error, loading } = useQuery(() => queryDataVersion());

  const {
    data: synced,
    error: syncError,
    loading: syncing,
    mutate,
  } = useMutate(() => init(queryMetadata, queryDataVersion, queryCards, true));

  const syncData = useCallback(async () => {
    await mutate().catch(console.error);
  }, [mutate]);

  useEffect(() => {
    if (synced)
      toast({
        children: "Card data was synced successfully.",
        displayTime: 3000,
        variant: "success",
      });
  }, [synced, toast]);

  const enablePersistence = useCallback(() => {
    if (navigator.storage?.persist) {
      navigator.storage
        .persist()
        .then((res) => {
          if (res) {
            toast({
              children: "Persistence enabled successfully.",
              displayTime: 3000,
              variant: "success",
            });
          } else {
            toast({
              children: "Persistence could not be enabled.",
              displayTime: 3000,
              variant: "error",
            });
          }
        })
        .catch((err) => {
          console.error(err);
          toast({
            children: "Persistence could not be enabled (see browser console).",
            displayTime: 3000,
            variant: "error",
          });
        });
    }
  }, [toast]);

  const upToDate =
    data &&
    dataVersion &&
    data.cards_updated_at === dataVersion.cards_updated_at;

  return (
    <>
      <Field
        bordered
        className={clsx(css["sync"], upToDate && css["uptodate"])}
      >
        <Button disabled={loading || !!error} onClick={syncData} type="button">
          Sync card data
        </Button>
        <div className={css["status"]}>
          {(loading || syncing) && <p>Loading latest card data...</p>}
          {(!!error || !!syncError) && <p>Could not sync card data.</p>}
          {!loading &&
            !syncing &&
            data &&
            (upToDate ? (
              <p>
                <Check className={css["status-icon"]} /> Card data is up to
                date.
              </p>
            ) : (
              <p>
                <FileDown className={css["status-icon"]} /> New card data is
                available.
              </p>
            ))}
        </div>
        {dataVersion && (
          <dl className={css["info"]}>
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
        bordered
        helpText={`${import.meta.env.VITE_PAGE_NAME} uses IndexedDB to store decks and settings locally. In some circumstances, your browser may clear stored data without notice. Enabling persistence avoids this. Your browser may ask for your permission.`}
      >
        <Button onClick={enablePersistence} type="button">
          Enable persistent storage
        </Button>
      </Field>
    </>
  );
}
