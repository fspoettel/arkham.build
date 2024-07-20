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
  exile_string: string | null;
  description_md: string;
  ignoreDeckLimitSlots: Slots | null;
  id: Id;
  investigator_code: string;
  meta: string;
  name: string;
  next_deck: Id | null;
  previous_deck: Id | null;
  problem?: DeckProblem | string | null;
  sideSlots: Slots | string[]; // NOTE: arkhamdb returns `[]` for empty side slots.
  slots: Slots;
  source?: "arkhamdb" | "local" | undefined;
  taboo_id: number | null;
  tags: string;
  version: string;
  xp_adjustment: number | null;
  xp_spent: number | null;
  xp: number | null;
};

export function isDeck(x: unknown): x is Deck {
  return (
    typeof x === "object" && x !== null && "id" in x && "investigator_code" in x
  );
}

export function isLocalDeck(x: unknown): x is Deck & { id: string } {
  return isDeck(x) && x.source === "local";
}

export function isArkhamDbDeck(x: unknown): x is Deck & { id: number } {
  return isDeck(x) && x.source === "arkhamdb";
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
  importFromFiles(files: FileList): Promise<void>;

  duplicateDeck(id: Id): Id;

  exportJSON(id: Id): void;
  exportText(id: Id): void;
};
