import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";

import { Dialog, DialogContent } from "../ui/dialog";
import { CardModal } from "./card-modal";

type CardModalContextConfig = {
  code: string;
};

type CardModalContextState =
  | {
      isOpen: true;
      config: CardModalContextConfig;
    }
  | {
      isOpen: false;
      config: undefined;
    };

type CardModalContext = {
  setClosed: () => void;
  setOpen: (config: CardModalContextConfig) => void;
};

export const CardModalContext = createContext<CardModalContext>({
  setClosed: () => {},
  setOpen: () => {},
});

export function useCardModalContext() {
  const context = useContext(CardModalContext);

  if (!context) {
    throw new Error(
      "useCardModalContext must be used within a CardModalProvider.",
    );
  }
  return context;
}

type Props = {
  children: ReactNode;
};

export function CardModalProvider({ children }: Props) {
  const [state, setState] = useState<CardModalContextState>({
    isOpen: false,
    config: undefined,
  });

  const value: CardModalContext = useMemo(
    () => ({
      setClosed: () => {
        setState({ config: undefined, isOpen: false });
      },
      setOpen: (config: CardModalContextConfig) => {
        setState({ config, isOpen: true });
      },
    }),
    [],
  );

  return (
    <CardModalContext.Provider value={value}>
      {children}
      <Dialog onOpenChange={value.setClosed} open={state.isOpen}>
        <DialogContent>
          {state.isOpen && <CardModal code={state.config.code} />}
        </DialogContent>
      </Dialog>
    </CardModalContext.Provider>
  );
}
