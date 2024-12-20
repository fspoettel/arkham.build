import { useCallback, useEffect } from "react";

export function useVisibilityChange(
  callback: (visibility: DocumentVisibilityState) => void,
) {
  const cb = useCallback(callback, []);

  useEffect(() => {
    const handler = () => cb(document.visibilityState);
    document.addEventListener("visibilitychange", handler);

    return () => document.removeEventListener("visibilitychange", handler);
  }, [cb]);
}
