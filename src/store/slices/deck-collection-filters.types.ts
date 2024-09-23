export type DeckFilterTypes = "faction";
export type DeckCollectionFilter = string[];

export type DeckFiltersState = {
  deckFilters: Record<DeckFilterTypes, DeckCollectionFilter>;
};

export type DeckFiltersSlice = DeckFiltersState & {
  addDecksFilter(type: DeckFilterTypes, value: DeckCollectionFilter): void;
};
