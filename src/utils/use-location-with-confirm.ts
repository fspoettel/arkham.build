import { useCallback } from "react";
import type { BaseLocationHook } from "wouter";
import { useBrowserLocation } from "wouter/use-browser-location";

import { useStore } from "@/store";
import { selectNeedsConfirmation } from "@/store/selectors/shared";

export const useBrowserLocationWithConfirmation: BaseLocationHook = () => {
  const [location, setLocation] = useBrowserLocation();
  const needsConfirm = useStore(selectNeedsConfirmation);

  const onLocationChange = useCallback(
    (newLocation: string) => {
      const perfomNavigation = needsConfirm
        ? window.confirm(needsConfirm)
        : true;
      if (perfomNavigation) setLocation(newLocation);
    },
    [needsConfirm, setLocation],
  );

  return [location, onLocationChange];
};
