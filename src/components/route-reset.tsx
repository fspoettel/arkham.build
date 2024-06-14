import { useEffect } from "react";
import { useLocation } from "wouter";

import { useStore } from "@/store";

export default function RouteReset() {
  const [pathname] = useLocation();
  const toggleSidebar = useStore((state) => state.toggleSidebar);

  useEffect(() => {
    window.scrollTo(0, 0);
    toggleSidebar(false);
  }, [pathname, toggleSidebar]);

  return null;
}
