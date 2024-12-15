import { useToast } from "@/components/ui/toast.hooks";
import { isEmpty } from "@/utils/is-empty";
import { useCallback } from "react";
import { useStore } from "..";
import { selectConnections, selectSyncHealthy } from "../selectors/connections";

export function useSync() {
  const toast = useToast();

  const sync = useStore((state) => state.sync);

  const connections = useStore(selectConnections);
  const connectionsEmpty = isEmpty(connections);
  const syncHealthy = useStore(selectSyncHealthy);

  const onSync = useCallback(async () => {
    if (!syncHealthy || connectionsEmpty) return;

    const toastId = toast.show({
      children: "Syncing with ArkhamDB...",
      variant: "loading",
    });

    try {
      await sync();
      toast.dismiss(toastId);

      toast.show({
        children: "ArkhamDB sync successful",
        duration: 3000,
        variant: "success",
      });
    } catch (err) {
      console.error(err);
      toast.dismiss(toastId);
      toast.show({
        children: `Error syncing with ArkhamDB: ${(err as Error).message || "Unknown error"}`,
        duration: 3000,
        variant: "error",
      });
      throw err;
    }
  }, [connectionsEmpty, sync, syncHealthy, toast]);

  return onSync;
}
