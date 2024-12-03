import { Loader } from "@/components/ui/loader";
import { useToast } from "@/components/ui/toast.hooks";
import { AppLayout } from "@/layouts/app-layout";
import { useStore } from "@/store";
import { useSync } from "@/store/hooks/use-sync";
import type { Provider } from "@/store/slices/connections.types";
import { formatProviderName } from "@/utils/formatting";
import { useEffect, useRef } from "react";
import { useLocation, useSearch } from "wouter";

export function Connect() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const toast = useToast();
  const params = new URLSearchParams(search);

  const createConnection = useStore((state) => state.createConnection);
  const sync = useSync();

  const provider = params.get("provider")?.toString() || "arkhamdb";
  const loginState = params.get("login_state")?.toString();
  const error = params.get("error")?.toString();

  const lock = useRef(false);

  useEffect(() => {
    async function initializeConnection() {
      if (lock.current) return;

      try {
        if (loginState === "success") {
          createConnection(provider as Provider, {});
          lock.current = true;
          await sync();
        } else {
          const errorMessage = error || "Unknown error";
          toast.show({
            children: `Error occured during connection: ${errorMessage}`,
            variant: "error",
          });
        }
      } finally {
        navigate(`~/settings?${search}`, { replace: true });
      }
    }

    initializeConnection().catch(console.error);
  }, [
    loginState,
    error,
    toast,
    navigate,
    createConnection,
    provider,
    search,
    sync,
  ]);

  const message = lock
    ? `Syncing ${formatProviderName(provider)}...`
    : `Connecting ${provider}...`;

  return (
    <AppLayout title={`Connecting ${provider}...`}>
      <Loader show message={message} />
    </AppLayout>
  );
}
