import { useEffect } from "react";
import { usePathname } from "wouter/use-browser-location";

import { useStore } from "@/store";

export function useSyncActiveDeckId() {
  const pathname = usePathname();

  const setActiveDeckId = useStore((state) => state.setActiveDeckId);

  useEffect(() => {
    if (pathname.startsWith("/deck/")) {
      setActiveDeckId(pathname.split("/deck/")[1].split("/")[0]);
    } else {
      setActiveDeckId(undefined);
    }
  }, [setActiveDeckId, pathname]);
}
