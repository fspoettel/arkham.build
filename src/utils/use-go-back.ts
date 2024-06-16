import { useCallback } from "react";
import { useLocation } from "wouter";

export function useGoBack() {
  const [, setLocation] = useLocation();

  const goBack = useCallback(() => {
    if (window.history.length > 1) {
      history.go(-1);
    } else {
      setLocation("/");
    }
  }, [setLocation]);

  return goBack;
}
