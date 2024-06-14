export type Deck = {
  id: string | number;
  external_id?: string | number; // external id, i.e. arkhamdb or arkhamcards.
  external_source?: string;
  name: string;
  date_creation: string;
  date_update: string;
  investigator_code: string;
  description_md: string;
  slots: Record<string, number>;
  sideSlots: Record<string, number> | string[]; // NOTE: arkhamdb returns `[]` for empty side slots.
  ignoreDeckLimitSlots?: Record<string, number> | null;
  xp: number | null;
  xp_spent: number | null;
  taboo_id: number | null;
  meta: string;
  tags: string;
  // arkhamdb: deck versions.
  previous_deck?: number | null;
  next_deck?: number | null;
};

export function isDeck(x: unknown): x is Deck {
  return (
    typeof x === "object" && x !== null && "id" in x && "investigator_code" in x
  );
}

export type DecksState = {
  local: Record<string, Deck>;
};

export type DecksSlice = {
  decks: DecksState;
  importDecks(files: FileList): Promise<void>;
  deleteDeck(id: string | number): void;
};
