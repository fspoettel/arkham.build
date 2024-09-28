export type DeckFiltersType = {
  faction: string[];
  search: string;
  tags: string[];
  properties: Record<DeckPropertyName, boolean>;
};

export type DeckFiltersKeys = keyof DeckFiltersType;
type DeckFiltersValues<P extends DeckFiltersKeys> = DeckFiltersType[P];

type CollapsibleFilters = Exclude<DeckFiltersKeys, "faction" | "search">;

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
  resetDeckFilter(filter: DeckFiltersKeys): void;
};

export type DeckPropertyName = "parallel";
