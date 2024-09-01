import { createContext, useContext } from "react";

type ToastPayload = {
  children:
    | React.ReactNode
    | ((props: { onClose: () => void }) => React.ReactNode);
  duration?: number;
  variant?: "success" | "error";
};

export type Toast = ToastPayload & {
  id: string;
};

type ToastContextType = {
  show: (msg: ToastPayload) => string;
  dismiss: (id: string) => void;
};

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined,
);

export function useToast() {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
