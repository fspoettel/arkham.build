import { useEffect } from "react";
import { usePathname } from "wouter/use-browser-location";

import { useStore } from "@/store";

export function useSyncActiveDeckId() {
  const pathname = usePathname();

  const setActiveDeck = useStore((state) => state.setActiveDeck);

  useEffect(() => {
    if (pathname.startsWith("/deck/")) {
      const id = pathname.split("/deck/")[1].split("/").at(-1);
      const mode = pathname.includes("edit") ? "edit" : "view";
      setActiveDeck(id, mode);
    } else {
      setActiveDeck(undefined);
    }
  }, [setActiveDeck, pathname]);
}
