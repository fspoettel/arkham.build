export type DeckFiltersType = {
  faction: string[];
  search: string;
  tags: string[];
  properties: Record<DeckPropertyName, boolean>;
  validity: DeckValidity;
  expCost: RangeMinMax;
};

export type RangeMinMax = undefined | [number, number];
export type DeckValidity = "valid" | "invalid" | "all";

export type DeckFiltersKey = keyof DeckFiltersType;
type DeckFiltersValue<P extends DeckFiltersKey> = DeckFiltersType[P];

type CollapsibleFilter = Exclude<DeckFiltersKey, "faction" | "search">;

export type DeckFiltersState = {
  filters: DeckFiltersType;
  open: Record<CollapsibleFilter, boolean>;
};

export type DeckFiltersSlice = {
  deckFilters: DeckFiltersState;
  addDecksFilter<F extends DeckFiltersKey, T extends DeckFiltersValue<F>>(
    type: F,
    value: T,
  ): void;
  setDeckFilterOpen(filter: CollapsibleFilter, status: boolean): void;
  resetDeckFilter(filter: DeckFiltersKey): void;
};

export type DeckPropertyName = "parallel";
