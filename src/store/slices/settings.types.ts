import type { GroupingType, SortingType, ViewMode } from "./lists.types";

export type ListConfig = {
  group: GroupingType[];
  sort: SortingType[];
  viewMode: ViewMode;
};

export type DecklistConfig = {
  group: GroupingType[];
  sort: SortingType[];
};

export type SettingsState = {
  cardLevelDisplay: "icon-only" | "dots" | "text";
  collection: Record<string, number>; // track as "quantity" owned to accomodate the core set.
  fontSize: number;
  hideWeaknessesByDefault: boolean;
  showMoveToSideDeck: boolean;
  lists: {
    encounter: ListConfig;
    investigator: ListConfig;
    player: ListConfig;
    deck: DecklistConfig;
    deckScans: DecklistConfig;
  };
  showPreviews: boolean;
  showAllCards: boolean;
  useLimitedPoolForWeaknessDraw: boolean;
  tabooSetId: number | undefined;
  flags?: Record<string, boolean>;
};

export type SettingsSlice = {
  settings: SettingsState;
} & {
  toggleFlag(key: string): void;
  updateSettings: (payload: SettingsState) => void;
};
