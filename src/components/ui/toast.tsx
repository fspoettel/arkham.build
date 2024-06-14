import clsx from "clsx";
import { CheckCircle, CircleAlert } from "lucide-react";
import { createContext, useCallback, useContext, useState } from "react";

import css from "./toast.module.css";

type Toast = {
  children: React.ReactNode;
  variant?: "success" | "error";
};

const ToastContext = createContext<((msg: Toast) => void) | undefined>(
  undefined,
);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<Toast | undefined>(undefined);

  const showToast = useCallback((value: Toast) => {
    setToast(value);
    setTimeout(() => setToast(undefined), 3000);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast && (
        <div
          className={clsx(css["toast"], toast.variant && css[toast.variant])}
          role="status"
        >
          {toast.variant === "success" && (
            <CheckCircle className={css["icon"]} />
          )}
          {toast.variant === "error" && <CircleAlert className={css["icon"]} />}
          <div>{toast.children}</div>
        </div>
      )}
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
