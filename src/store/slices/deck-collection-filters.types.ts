export type DeckFiltersType = {
  faction: string[];
  search: string;
};
type DeckFiltersKeys = keyof DeckFiltersType;
type DeckFiltersValues<P extends DeckFiltersKeys> = DeckFiltersType[P];

export type DeckFiltersState = {
  deckFilters: DeckFiltersType;
};

export type DeckFiltersSlice = DeckFiltersState & {
  addDecksFilter<F extends DeckFiltersKeys, T extends DeckFiltersValues<F>>(
    type: F,
    value: T,
  ): void;
};
