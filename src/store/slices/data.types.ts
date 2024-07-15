export type Slots = {
  [code: string]: number;
};

export type Id = number | string;

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
  sideSlots: Slots | string[]; // NOTE: arkhamdb returns `[]` for empty side slots.
  slots: Slots;
  source: "local" | "arkhamdb";
  taboo_id: number | null;
  tags: string;
  version: string;
  xp_spent: number | null;
  xp: number | null;
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
};
