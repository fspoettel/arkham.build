import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useState } from "react";

import css from "./toast.module.css";

const ToastContext = createContext<((msg: ReactNode) => void) | undefined>(
  undefined,
);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<ReactNode>(null);

  const showToast = useCallback((msg: ReactNode) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {message && <div className={css["toast"]}>{message}</div>}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
