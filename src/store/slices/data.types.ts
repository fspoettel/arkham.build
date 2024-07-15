export type Slots = {
  [code: string]: number;
};

export type Id = number | string;

export type DeckProblem =
  | "too_few_cards"
  | "too_many_cards"
  | "too_many_copies"
  | "invalid_cards"
  | "deck_options_limit"
  | "investigator";

export type Deck = {
  date_creation: string;
  date_update: string;
  description_md: string;
  id: Id; // local decks: string, arkhamdb: int
  ignoreDeckLimitSlots: Slots | null;
  investigator_code: string;
  meta: string;
  name: string;
  next_deck: Id | null;
  previous_deck: Id | null;
  problem?: DeckProblem | string | null;
  sideSlots: Slots | string[]; // NOTE: arkhamdb returns `[]` for empty side slots.
  slots: Slots;
  taboo_id: number | null;
  tags: string;
  version: string;
  xp_spent: number | null;
  xp: number | null;

  source?: "local" | "arkhamdb"; // addition.
};

export function isDeck(x: unknown): x is Deck {
  return (
    typeof x === "object" && x !== null && "id" in x && "investigator_code" in x
  );
}

export type DataState = {
  decks: Record<string, Deck>;
  history: {
    [id: Id]: Id[];
  };
};

export type DataSlice = {
  data: DataState;
  importDeck(code: string): Promise<void>;
  duplicateDeck(id: Id): Id;

  exportJSON(id: Id): void;
  exportText(id: Id): void;
};
