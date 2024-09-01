import type { Card } from "../services/queries.types";

export type CardSet = "requiredCards" | "advanced" | "replacement";

type DeckCreateState = {
  title: string;
  tabooSetId: number | undefined;
  investigatorCode: string;
  investigatorFrontCode: string;
  investigatorBackCode: string;
  extraCardQuantities: Record<string, number>;
  sets: CardSet[];
  selections: {
    [key: string]: string;
  };
};

export type DeckCreateSlice = {
  deckCreate: DeckCreateState | undefined;

  initCreate: (code: string) => void;
  resetCreate: () => void;

  deckCreateChangeExtraCardQuantity: (card: Card, quantity: number) => void;

  deckCreateSetSelection(key: string, value: string): void;
  deckCreateSetTabooSet: (value: number | undefined) => void;
  deckCreateSetTitle: (value: string) => void;
  deckCreateToggleCardSet: (value: string) => void;
  deckCreateSetInvestigatorCode: (
    side: "front" | "back",
    value: string,
  ) => void;
};
