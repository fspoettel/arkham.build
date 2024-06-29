import clsx from "clsx";
import { CheckCircle, CircleAlert } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import css from "./toast.module.css";

type Toast = {
  children:
    | React.ReactNode
    | ((props: { onClose: () => void }) => React.ReactNode);
  duration?: number;
  variant?: "success" | "error";
};

const ToastContext = createContext<((msg: Toast) => void) | undefined>(
  undefined,
);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toastRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState<Toast | undefined>(undefined);
  const [isExiting, setIsExiting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const removeToast = useCallback(() => {
    return new Promise<void>((resolve) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      if (!toastRef.current) {
        setToast(undefined);
        return resolve();
      }

      setIsExiting(true);

      const afterExit = () => {
        toastRef.current?.removeEventListener("animationend", afterExit);
        setToast(undefined);
        setIsExiting(false);
        return resolve();
      };

      toastRef.current.addEventListener("animationend", afterExit);
    });
  }, []);

  useEffect(() => {
    if (!toast?.duration) return;

    timeoutRef.current = setTimeout(() => {
      removeToast();
    }, toast.duration);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [toast, removeToast]);

  const onClose = useCallback(() => {
    removeToast();
  }, [removeToast]);

  const showToast = useCallback(
    async (value: Toast) => {
      await removeToast();
      setToast(value);
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast && (
        <div
          className={clsx(
            css["toast"],
            toast.variant && css[toast.variant],
            isExiting && css["exiting"],
          )}
          data-testid="toast"
          ref={toastRef}
          role="status"
        >
          {toast.variant === "success" && (
            <CheckCircle className={css["icon"]} />
          )}
          {toast.variant === "error" && <CircleAlert className={css["icon"]} />}
          <div>
            {typeof toast.children === "function"
              ? toast.children({ onClose })
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
