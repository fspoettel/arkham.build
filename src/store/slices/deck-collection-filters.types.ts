export type DeckFilters = {
  faction: string[];
  search: string;
};
type DeckFiltersKeys = keyof DeckFilters;
type DeckFiltersValues<P extends DeckFiltersKeys> = DeckFilters[P];

export type DeckFiltersState = {
  deckFilters: DeckFilters;
};

export type DeckFiltersSlice = DeckFiltersState & {
  addDecksFilter<F extends DeckFiltersKeys, T extends DeckFiltersValues<F>>(
    type: F,
    value: T,
  ): void;
};
