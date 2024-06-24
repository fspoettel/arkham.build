import clsx from "clsx";
import { CheckCircle, CircleAlert } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import css from "./toast.module.css";

type Toast = {
  children:
    | React.ReactNode
    | ((props: { handleClose: () => void }) => React.ReactNode);
  displayTime?: number;
  variant?: "success" | "error";
};

const ToastContext = createContext<((msg: Toast) => void) | undefined>(
  undefined,
);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<Toast | undefined>(undefined);

  const showToast = useCallback((value: Toast) => {
    setToast(value);
  }, []);

  useEffect(() => {
    if (!toast?.displayTime) return;

    const timer = setTimeout(() => {
      setToast(undefined);
    }, toast.displayTime);

    return () => clearTimeout(timer);
  }, [toast]);

  const handleClose = useCallback(() => {
    setToast(undefined);
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
          <div>
            {typeof toast.children === "function"
              ? toast.children({ handleClose })
              : toast.children}
          </div>
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
