import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast.hooks";
import { useStore } from "@/store";
import {
  queryCards,
  queryDataVersion,
  queryMetadata,
} from "@/store/services/queries";
import { cx } from "@/utils/cx";
import { useMutate, useQuery } from "@/utils/use-query";
import { CheckIcon, FileDownIcon } from "lucide-react";
import { useCallback, useEffect } from "react";
import css from "./card-data-sync.module.css";

type Props = {
  onSyncComplete?: () => void;
  showDetails?: boolean;
};

export function CardDataSync(props: Props) {
  const { onSyncComplete, showDetails } = props;

  const toast = useToast();
  const init = useStore((state) => state.init);

  const dataVersion = useStore((state) => state.metadata.dataVersion);

  const { data, error, loading } = useQuery(queryDataVersion);

  const initStore = useCallback(
    () => init(queryMetadata, queryDataVersion, queryCards),
    [init],
  );

  const {
    data: synced,
    error: syncError,
    loading: syncing,
    mutate,
  } = useMutate(initStore);

  useEffect(() => {
    if (synced) {
      toast.show({
        children: "Card data sync successful.",
        duration: 3000,
        variant: "success",
      });

      onSyncComplete?.();
    }
  }, [onSyncComplete, synced, toast.show]);

  const upToDate =
    data &&
    dataVersion &&
    data.cards_updated_at === dataVersion.cards_updated_at;

  return (
    <>
      <Field
        bordered={showDetails}
        className={cx(css["sync"], upToDate && css["uptodate"])}
      >
        <div className={css["status"]}>
          {(loading || syncing) && <p>Loading latest card data...</p>}
          {(!!error || !!syncError) && <p>Could not sync card data.</p>}
          {!loading &&
            !syncing &&
            data &&
            (upToDate ? (
              <p>
                <CheckIcon className={css["status-icon"]} /> Card data is up to
                date.
              </p>
            ) : (
              <p>
                <FileDownIcon className={css["status-icon"]} /> New card data is
                available.
              </p>
            ))}
        </div>
        <Button
          disabled={loading || !!error}
          onClick={mutate}
          type="button"
          size="sm"
        >
          Sync card data
        </Button>
        {showDetails && dataVersion && (
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
    </>
  );
}
