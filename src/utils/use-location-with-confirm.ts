import { useCallback } from "react";
import type { BaseLocationHook } from "wouter";
import { useBrowserLocation } from "wouter/use-browser-location";

import { useStore } from "@/store";
import { selectNeedsConfirmation } from "@/store/selectors/shared";

export const useBrowserLocationWithConfirmation: BaseLocationHook = () => {
  const [location, setLocation] = useBrowserLocation();
  const needsConfirm = useStore(selectNeedsConfirmation);

  const onLocationChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (newLocation: string, options: any) => {
      const perfomNavigation =
        needsConfirm && !options?.state?.confirm
          ? window.confirm(needsConfirm)
          : true;
      if (perfomNavigation) setLocation(newLocation);
    },
    [needsConfirm, setLocation],
  );

  return [location, onLocationChange];
};
