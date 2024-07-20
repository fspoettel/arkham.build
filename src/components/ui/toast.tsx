import { cx } from "@/utils/cx";
import { CheckCircle, CircleAlert, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { randomId } from "@/utils/crypto";
import { Button } from "./button";
import css from "./toast.module.css";

type ToastPayload = {
  children:
    | React.ReactNode
    | ((props: { onClose: () => void }) => React.ReactNode);
  duration?: number;
  variant?: "success" | "error";
};

type Toast = ToastPayload & {
  id: string;
};

export type ToastContext = {
  show: (msg: ToastPayload) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContext | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((value: ToastPayload) => {
    const id = randomId();
    setToasts((prev) => [...prev, { ...value, id }]);
    return id;
  }, []);

  const ctx = useMemo(
    () => ({ show: showToast, dismiss: dismissToast }),
    [showToast, dismissToast],
  );

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <section className={css["toast-container"]}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            id={toast.id}
            onRemove={dismissToast}
          />
        ))}
      </section>
    </ToastContext.Provider>
  );
}

function Toast(props: {
  toast: Toast;
  id: string;
  onRemove: (id: string) => void;
}) {
  const { toast, id, onRemove } = props;

  const [isExiting, setIsExiting] = useState(false);

  const toastRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const removeToast = useCallback(() => {
    return new Promise<void>((resolve) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      if (!toastRef.current) {
        onRemove(id);
        return resolve();
      }

      setIsExiting(true);

      const afterExit = () => {
        toastRef.current?.removeEventListener("animationend", afterExit);
        onRemove(id);
        setIsExiting(false);
        return resolve();
      };

      toastRef.current.addEventListener("animationend", afterExit);
    });
  }, [id, onRemove]);

  useEffect(() => {
    if (!toast?.duration) return;

    timeoutRef.current = setTimeout(() => {
      removeToast();
    }, toast.duration);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [toast, removeToast]);

  return (
    <div
      className={cx(
        css["toast"],
        toast.variant && css[toast.variant],
        isExiting && css["exiting"],
        !toast.duration && css["closable"],
      )}
      data-testid="toast"
      ref={toastRef}
      role="status"
    >
      {toast.variant === "success" && <CheckCircle className={css["icon"]} />}
      {toast.variant === "error" && <CircleAlert className={css["icon"]} />}
      <div>
        {typeof toast.children === "function"
          ? toast.children({ onClose: removeToast })
          : toast.children}
        {!toast.duration && (
          <Button
            aria-label="Dismiss"
            className={css["toast-dismiss"]}
            iconOnly
            onClick={removeToast}
            type="button"
            variant="bare"
            size="sm"
          >
            <X />
          </Button>
        )}
      </div>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
