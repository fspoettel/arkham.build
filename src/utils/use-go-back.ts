import { useCallback } from "react";
import { useLocation } from "wouter";

export function useGoBack(location?: string) {
  const [, navigate] = useLocation();

  const goBack = useCallback(() => {
    if (location) {
      navigate(location);
    } else if (window.history.length > 1) {
      history.go(-1);
    } else {
      navigate("/");
    }
  }, [navigate, location]);

  return goBack;
}
