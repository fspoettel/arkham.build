import { useCallback, useEffect } from "react";

export function useVisibilityChange(
  callback: (visibility: DocumentVisibilityState) => void,
) {
  const cb = useCallback(callback, []);

  useEffect(() => {
    const handler = () => cb(document.visibilityState);
    const focusHandler = () => cb("visible");
    const blurHandler = () => cb("hidden");

    document.addEventListener("visibilitychange", handler);

    window.addEventListener("focus", focusHandler);
    window.addEventListener("blur", blurHandler);

    return () => {
      document.removeEventListener("visibilitychange", handler);
      window.removeEventListener("focus", focusHandler);
      window.removeEventListener("blur", blurHandler);
    };
  }, [cb]);
}
