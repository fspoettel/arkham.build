import { Loader } from "@/components/ui/loader";
import { useToast } from "@/components/ui/toast.hooks";
import { AppLayout } from "@/layouts/app-layout";
import { useStore } from "@/store";
import { getSession } from "@/store/services/queries";
import type { Provider } from "@/store/slices/connections.types";
import { useQuery } from "@/utils/use-query";
import { useEffect } from "react";
import { useLocation, useSearch } from "wouter";

export function Connect() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const toast = useToast();
  const params = new URLSearchParams(search);

  const createConnection = useStore((state) => state.createConnection);

  const session = useQuery(getSession);

  const provider = params.get("provider")?.toString() || "arkhamdb";
  const loginState = params.get("login_state")?.toString();
  const error = params.get("error")?.toString();

  useEffect(() => {
    if (session.loading) return;

    if (!error && !session.error && loginState === "success") {
      createConnection(provider as Provider, {});
    } else {
      const errorMessage =
        error || (session.error as Error)?.message || "Unknown error";
      toast.show({
        children: `Error occured during connection: ${errorMessage}`,
        variant: "error",
      });
    }

    navigate("~/settings");
  }, [loginState, error, toast, session, navigate, createConnection, provider]);

  return (
    <AppLayout title={`Connecting ${provider}...`}>
      <Loader show message={`Connecting ${provider}...`} />
    </AppLayout>
  );
}
