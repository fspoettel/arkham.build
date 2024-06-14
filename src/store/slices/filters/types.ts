export type CardTypeFilter = "player" | "encounter";

export type FiltersSlice = {
  filters: {
    cardType: CardTypeFilter;
  };
  setCardTypeFilter(type: CardTypeFilter): void;
};
