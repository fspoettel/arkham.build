import type { GroupingType, SortingType } from "./lists.types";

export type ListConfig = {
  group: GroupingType[];
  sort: SortingType[];
  showCardText: boolean;
};

export type SettingsState = {
  collection: Record<string, number>; // track as "quantity" owned to accomodate the core set.
  hideWeaknessesByDefault: boolean;
  lists: {
    encounter: ListConfig;
    investigator: ListConfig;
    player: ListConfig;
    deck: ListConfig;
  };
  showAllCards: boolean;
  tabooSetId: number | undefined;
};

export type SettingsSlice = {
  settings: SettingsState;
} & {
  updateSettings: (payload: SettingsState) => void;
};
