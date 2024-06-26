import type { Filter } from "@/utils/fp";

export type AssetFilter = {
  health: undefined | [number, number];
  sanity: undefined | [number, number];
  skillBoosts: string[];
  slots: string[];
  uses: string[];
  healthX: boolean;
};

export type CostFilter = {
  range: undefined | [number, number];
  even: boolean;
  odd: boolean;
  x: boolean;
};

export type LevelFilter = {
  range: undefined | [number, number];
  exceptional: boolean;
  nonexceptional: boolean;
};

export type MultiselectFilter = string[];

export type OwnershipFilter = "unowned" | "owned" | "all";

export type PropertiesFilter = {
  bonded: boolean;
  customizable: boolean;
  seal: boolean;
  unique: boolean;
  fast: boolean;
  permanent: boolean;
  exile: boolean;
  healsDamage: boolean;
  healsHorror: boolean;
  victory: boolean;
  succeedBy: boolean;
};

export type SelectFilter = string | number | undefined;

export type SkillIconsFilter = {
  agility: number | undefined;
  combat: number | undefined;
  intellect: number | undefined;
  willpower: number | undefined;
  wild: number | undefined;
  any: number | undefined;
};

export type FilterMapping = {
  action: MultiselectFilter;
  asset: AssetFilter;
  cost: CostFilter;
  encounterSet: MultiselectFilter;
  faction: MultiselectFilter;
  investigator: SelectFilter;
  level: LevelFilter;
  ownership: OwnershipFilter;
  pack: MultiselectFilter;
  properties: PropertiesFilter;
  skillIcons: SkillIconsFilter;
  subtype: MultiselectFilter;
  tabooSet: SelectFilter;
  trait: MultiselectFilter;
  type: MultiselectFilter;
};

export type FilterKey = keyof FilterMapping;

export type FilterObject<K extends FilterKey> = {
  open: boolean;
  type: K;
  value: FilterMapping[K];
};

export type Search = {
  value: string;
  includeGameText: boolean;
  includeFlavor: boolean;
  includeBacks: boolean;
};

export type GroupingType =
  | "cost"
  | "cycle"
  | "encounter_set"
  | "faction"
  | "base_upgrades"
  | "level"
  | "slot"
  | "subtype"
  | "type";

export type SortingType =
  | "position"
  | "name"
  | "level"
  | "cycle"
  | "faction"
  | "type";

export type List = {
  cardType: "player" | "encounter";
  filters: FilterKey[];
  filtersEnabled: boolean;
  filterValues: {
    [id: number]: FilterObject<FilterKey>;
  };
  grouping: GroupingType[];
  key: string;
  sorting: SortingType[];
  systemFilter?: Filter;
  search: Search;
};

type Lists = {
  [key: string]: List;
};

export type ListsSlice = {
  activeList?: string;
  lists: Lists;

  changeList(value: string, path: string): void;

  setFiltersEnabled(value: boolean): void;

  setFilterValue<T>(id: number, payload: T): void;
  setFilterOpen(id: number, open: boolean): void;

  setActiveList(value: string): void;
  setSearchValue(value: string): void;
  setSearchFlag(flag: keyof Omit<Search, "value">, value: boolean): void;

  resetFilter(id: number): void;
  resetFilters(): void;
};
