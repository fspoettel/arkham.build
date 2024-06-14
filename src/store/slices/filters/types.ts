export type CardTypeFilter = "player" | "encounter";

export type Filters = {
  cardType: CardTypeFilter;
  player: {
    faction: string[];
    level: {
      min: number | undefined;
      max: number | undefined;
      exceptional: boolean;
      nonExceptional: boolean;
    };
    cost: {
      min: number | undefined;
      max: number | undefined;
      even: boolean | undefined;
      odd: boolean | undefined;
    };
  };
  encounter: {
    faction: string[];
  };
  shared: {};
};

export type FiltersSlice = {
  filters: Filters;
  setCardTypeFilter(type: CardTypeFilter): void;
  setFactionFilter(factions: string[]): void;
  resetFilters(): void;
};
