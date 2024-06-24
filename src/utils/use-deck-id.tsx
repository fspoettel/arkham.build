import type React from "react";
import { createContext, useContext, useMemo } from "react";

import type { Id } from "@/store/slices/data.types";

import { assert } from "./assert";

interface DeckContextType {
  deckId?: Id;
  canEdit?: boolean;
}

type DeckContextTypeChecked = {
  deckId: Id;
  canEdit?: boolean;
};

function isDeckContextTypeChecked(
  context: DeckContextType,
): context is DeckContextTypeChecked {
  return context.deckId !== undefined;
}

const DeckIdContext = createContext<DeckContextType | undefined>(undefined);

type Props = DeckContextType & {
  children: React.ReactNode;
};

export function DeckIdProvider({ deckId, canEdit, children }: Props) {
  const value = useMemo(
    () => ({
      deckId,
      canEdit,
    }),
    [deckId, canEdit],
  );

  return (
    <DeckIdContext.Provider value={value}>{children}</DeckIdContext.Provider>
  );
}

export function useDeckId() {
  const context = useContext(DeckIdContext);
  return context ?? { deckId: undefined, canEdit: false };
}

export function useDeckIdChecked(): DeckContextTypeChecked {
  const context = useDeckId();
  assert(
    isDeckContextTypeChecked(context),
    "expected to be defined in a parent DeckIdProvider",
  );
  return context;
}
