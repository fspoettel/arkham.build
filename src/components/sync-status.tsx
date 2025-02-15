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
import { useTranslation } from "react-i18next";
import css from "./sync-status.module.css";

export function SyncStatus() {
  const connections = useStore(selectConnections);
  const healthy = useStore(selectSyncHealthy);
  const { t } = useTranslation();

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
              ? t("settings.connections.sync_all", { collectionLabels })
              : t("settings.connections.disconnected_all")}
          </p>
        ) : (
          t("settings.connections.syncing")
        )
      }
      size="sm"
    >
      <RefreshCcwIcon className={cx(syncing && "spin")} />{" "}
      {t("settings.connections.sync")}
    </Button>
  );
}
