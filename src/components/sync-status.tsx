import { useStore } from "@/store";

import { cx } from "@/utils/cx";
import { formatProviderName } from "@/utils/formatting";
import { isEmpty } from "@/utils/is-empty";
import { CircleAlertIcon, RefreshCcwIcon } from "lucide-react";
import { Button } from "./ui/button";

import { useSync } from "@/store/hooks/use-sync";
import { syncHealthy } from "@/store/selectors/connections";
import { useTranslation } from "react-i18next";
import css from "./sync-status.module.css";

export function SyncStatus() {
  const connections = useStore((state) => state.connections);
  const healthy = syncHealthy(connections);
  const { t } = useTranslation();

  const sync = useSync();
  const syncing = useStore((state) => state.remoting.sync);

  const collectionLabels = Object.values(connections.data)
    .map((p) => formatProviderName(p.provider))
    .join(" & ");

  if (isEmpty(connections)) return null;

  return (
    <Button
      className={cx(css["sync"], !syncing && !healthy && css["unhealthy"])}
      disabled={syncing}
      onClick={() => sync(connections)}
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
      {!syncing && !healthy && (
        <div className={css["unhealthy"]}>
          <CircleAlertIcon />
        </div>
      )}
    </Button>
  );
}
