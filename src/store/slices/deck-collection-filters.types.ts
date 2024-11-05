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

export type SortOrder = "asc" | "desc";

export type DeckFiltersState = {
  filters: DeckFiltersType;
  open: Record<CollapsibleFilter, boolean>;
  sort: {
    order: SortOrder;
    criteria: SortCriteria;
  };
};

export type DeckSortPayload = {
  order: SortOrder;
  criteria: SortCriteria;
};

export type DeckFiltersSlice = {
  deckFilters: DeckFiltersState;
  addDecksFilter<F extends DeckFiltersKey, T extends DeckFiltersValue<F>>(
    type: F,
    value: T,
  ): void;
  setDeckFilterOpen(filter: CollapsibleFilter, status: boolean): void;
  setDeckSort(payload: Partial<DeckSortPayload>): void;
  resetDeckFilter(filter: DeckFiltersKey): void;
};

export type DeckPropertyName = "parallel";

export type SortCriteria =
  | "date_updated"
  | "date_created"
  | "alphabetical"
  | "xp";
