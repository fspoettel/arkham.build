import { useEffect } from "react";
import { usePathname } from "wouter/use-browser-location";

import { useCardModalContext } from "@/components/card-modal/card-modal-context";
import { useStore } from "@/store";

export function useSyncActiveDeckId() {
  const pathname = usePathname();
  const modalContext = useCardModalContext();

  const setActiveDeck = useStore((state) => state.setActiveDeck);

  useEffect(() => {
    modalContext.setClosed();

    if (pathname.startsWith("/deck/view/")) {
      const id = pathname.split("/").at(-1);
      setActiveDeck(id, "view");
    } else if (pathname.startsWith("/deck/edit/")) {
      const id = pathname.split("/").at(-1);
      setActiveDeck(id, "edit");
    } else {
      setActiveDeck(undefined);
    }
  }, [setActiveDeck, pathname, modalContext]);
}
