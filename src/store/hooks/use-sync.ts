import { useToast } from "@/components/ui/toast.hooks";
import { isEmpty } from "@/utils/is-empty";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "..";
import { selectConnections, selectSyncHealthy } from "../selectors/connections";

export function useSync() {
  const toast = useToast();
  const { t } = useTranslation();

  const sync = useStore((state) => state.sync);

  const connections = useStore(selectConnections);
  const connectionsEmpty = isEmpty(connections);
  const syncHealthy = useStore(selectSyncHealthy);

  const onSync = useCallback(async () => {
    if (!syncHealthy || connectionsEmpty) return;

    const provider = "ArkhamDB";

    const toastId = toast.show({
      children: t("settings.connections.provider_syncing", { provider }),
      variant: "loading",
    });

    try {
      await sync();
      toast.dismiss(toastId);

      toast.show({
        children: t("settings.connections.provider_success", { provider }),
        duration: 3000,
        variant: "success",
      });
    } catch (err) {
      console.error(err);
      toast.dismiss(toastId);
      toast.show({
        children: t("settings.connections.provider_error", {
          provider,
          error: (err as Error).message || "Unknown error",
        }),
        duration: 3000,
        variant: "error",
      });
      throw err;
    }
  }, [connectionsEmpty, sync, syncHealthy, toast, t]);

  return onSync;
}
