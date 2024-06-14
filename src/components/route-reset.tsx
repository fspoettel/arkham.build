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
    window.scrollTo(0, 0);
    toggleSidebar(false);
    toggleFilters(false);
  }, [pathname, toggleSidebar, toggleFilters]);

  return null;
}
