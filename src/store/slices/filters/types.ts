import type { Coded } from "@/store/services/types";

export type CardTypeFilter = "player" | "encounter";

export type Trait = Coded;

export type FilterObject<T> = {
  open: boolean;
  value: T;
};

export type MultiselectFilter = FilterObject<Record<string, boolean>>;

export type SelectFilter<T = string> = FilterObject<T | undefined>;

export type OwnershipFilter = FilterObject<"unowned" | "owned" | "all">;

export type CostFilter = FilterObject<{
  range: undefined | [number, number];
  even: boolean;
  odd: boolean;
  x: boolean;
}>;

export type LevelFilter = FilterObject<{
  range: undefined | [number, number];
  exceptional: boolean;
  nonexceptional: boolean;
}>;

export type SkillIconsFilter = FilterObject<{
  agility: number | null;
  combat: number | null;
  intellect: number | null;
  willpower: number | null;
  wild: number | null;
  any: number | null;
}>;

export type PropertiesFilter = FilterObject<{
  bonded: boolean;
  customizable: boolean;
  seal: boolean;
  unique: boolean;
  fast: boolean;
  permanent: boolean;
  exile: boolean;
  heals_damage: boolean;
  heals_horror: boolean;
  victory: boolean;
  succeedBy: boolean;
}>;

type SharedState = {
  ownership: OwnershipFilter;
  cost: CostFilter;
  faction: FilterObject<string[]>;
  action: MultiselectFilter;
  properties: PropertiesFilter;
  skillIcons: SkillIconsFilter;
  subtype: MultiselectFilter;
  trait: MultiselectFilter;
  type: MultiselectFilter;
};

export type Filters = {
  touched: boolean;
  cardType: CardTypeFilter;
  player: SharedState & {
    level: LevelFilter;
    investigator: SelectFilter;
    tabooSet: SelectFilter<number>;
  };
  encounter: SharedState;
};

export type FiltersSlice = {
  filters: Filters;

  setFilterOpen<C extends CardTypeFilter, P extends keyof Filters[C]>(
    type: C,
    path: P,
    val: boolean,
  ): void;

  setActiveCardType(type: CardTypeFilter): void;

  resetFilters(): void;

  resetFilterKey<C extends CardTypeFilter, P extends keyof Filters[C]>(
    type: C,
    path: P,
  ): void;

  setFilter<
    T,
    C extends CardTypeFilter,
    P extends keyof Filters[C],
    K extends keyof FilterObject<T>,
  >(
    type: C,
    path: P,
    key: K,
    value: T,
  ): void;

  setNestedFilter<C extends CardTypeFilter, P extends keyof Filters[C], T>(
    type: C,
    path: P,
    item: string,
    value: T,
  ): void;

  applyLevelShortcut(value: string): void;
};
