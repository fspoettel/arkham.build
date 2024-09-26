export type DeckFiltersType = {
  faction: string[];
  search: string;
  tags: string[];
};
export type DeckFiltersKeys = keyof DeckFiltersType;
type DeckFiltersValues<P extends DeckFiltersKeys> = DeckFiltersType[P];

type CollapsibleFilters = "tags";

export type DeckFiltersState = {
  filters: DeckFiltersType;
  open: Record<CollapsibleFilters, boolean>;
};

export type DeckFiltersSlice = {
  deckFilters: DeckFiltersState;
  addDecksFilter<F extends DeckFiltersKeys, T extends DeckFiltersValues<F>>(
    type: F,
    value: T,
  ): void;
  setDeckFilterOpen(filter: CollapsibleFilters, status: boolean): void;
  resetFilter(filter: DeckFiltersKeys): void;
};
