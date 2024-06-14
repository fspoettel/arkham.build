export type Slots = {
  [code: string]: number;
};

type Id = number | string;

export type Deck = {
  id: Id;
  external_id?: string | number; // external id, i.e. arkhamdb or arkhamcards.
  external_source?: string;
  name: string;
  date_creation: string;
  date_update: string;
  investigator_code: string;
  description_md: string;
  slots: Slots;
  sideSlots: Slots | string[]; // NOTE: arkhamdb returns `[]` for empty side slots.
  ignoreDeckLimitSlots?: Slots | null;
  xp: number | null;
  xp_spent: number | null;
  taboo_id: number | null;
  meta: string;
  tags: string;
  version?: string;

  previous_deck?: Id | null;
  next_deck?: Id | null;
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
  deleteDeck(id: string | number): void;
};
