import { useStore } from "@/store";
import {
  selectConnections,
  selectSyncHealthy,
} from "@/store/selectors/connections";
import { cx } from "@/utils/cx";
import { formatProviderName } from "@/utils/formatting";
import { isEmpty } from "@/utils/is-empty";
import { RefreshCcwIcon } from "lucide-react";
import { Button } from "./ui/button";

import { useSync } from "@/store/hooks/use-sync";
import css from "./sync-status.module.css";

export function SyncStatus() {
  const connections = useStore(selectConnections);
  const healthy = useStore(selectSyncHealthy);

  const sync = useSync();
  const syncing = useStore((state) => state.remoting.sync);

  const collectionLabels = connections
    .map((p) => formatProviderName(p.provider))
    .join(" & ");

  if (isEmpty(connections)) return null;

  return (
    <Button
      className={cx(css["sync"], !syncing && !healthy && css["unhealthy"])}
      disabled={syncing}
      onClick={() => sync()}
      tooltip={
        !syncing ? (
          <p>
            {healthy
              ? `Sync ${collectionLabels} decks`
              : "There is a problem with one of your connections. Please refresh it in the settings."}
          </p>
        ) : (
          "Sync in progress..."
        )
      }
      size="sm"
    >
      <RefreshCcwIcon className={cx(syncing && "spin")} /> Sync
    </Button>
  );
}
