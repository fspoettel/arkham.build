import { useEffect } from "react";
import { useLocation } from "wouter";

import { useStore } from "@/store";
import { useSyncActiveDeckId } from "@/utils/use-sync-active-deck-id";

export default function RouteReset() {
  const [pathname] = useLocation();

  const toggleFilters = useStore((state) => state.toggleFilters);
  const toggleSidebar = useStore((state) => state.toggleSidebar);

  useSyncActiveDeckId();

  useEffect(() => {
    toggleSidebar(false);
    toggleFilters(false);

    if (window.location.hash) {
      // HACK: this enables hash-based deep links to work when a route is loaded async.
      const el = document.querySelector(window.location.hash);

      if (el) {
        el.scrollIntoView();
        return;
      }
    }

    window.scrollTo(0, 0);
  }, [pathname, toggleSidebar, toggleFilters]);

  return null;
}
