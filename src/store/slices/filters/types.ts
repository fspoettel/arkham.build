export type CardTypeFilter = "player" | "encounter";

type CostFilter = {
  value: undefined | [number, number];
  even: boolean | undefined;
  odd: boolean | undefined;
};

type LevelFilter = {
  value: undefined | [number, number];
  exceptional: boolean;
  nonexceptional: boolean;
};

export type Filters = {
  cardType: CardTypeFilter;
  player: {
    faction: string[];
    level: LevelFilter;
    cost: CostFilter;
  };
  encounter: {
    faction: string[];
    cost: CostFilter;
  };
};

export type FiltersSlice = {
  filters: Filters;
  setCardTypeFilter(type: CardTypeFilter): void;

  setFactionFilter(factions: string[]): void;

  setActiveLevelValue(value: [number, number]): void;
  setActiveLevelFlag(
    key: "exceptional" | "nonexceptional",
    value: boolean,
  ): void;

  resetFilters(): void;
};
