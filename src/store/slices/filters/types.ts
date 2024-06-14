import { Coded } from "@/store/services/types";

export type CardTypeFilter = "player" | "encounter";

export type Trait = Coded;

type FilterObject<T> = {
  open: boolean;
  value: T;
};

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
}>;

export type ComboboxFilter = FilterObject<Record<string, boolean>>;

export type SelectFilter<T = string> = FilterObject<T | undefined>;

export type OwnershipFilter = FilterObject<"unowned" | "owned" | "all">;

type SharedState = {
  ownership: OwnershipFilter;
  cost: CostFilter;
  faction: FilterObject<string[]>;
  action: ComboboxFilter;
  properties: PropertiesFilter;
  skillIcons: SkillIconsFilter;
  subtype: ComboboxFilter;
  trait: ComboboxFilter;
  type: ComboboxFilter;
};

export type Filters = {
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

  setActiveFilter<
    C extends CardTypeFilter,
    P extends keyof Filters[C],
    K extends keyof Filters[C][P],
  >(
    type: C,
    path: P,
    key: K,
    value: Filters[C][P][K],
  ): void;

  setActiveNestedFilter<C extends CardTypeFilter, P extends keyof Filters[C]>(
    type: C,
    path: P,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    item: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
  ): void;

  setActiveLevelShortcut(value: string): void;
};
