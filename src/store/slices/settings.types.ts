export type SettingsState = {
  tabooSetId: number | undefined;
  showAllCards: boolean;
  hideWeaknessesByDefault: boolean;
  collection: Record<string, number>; // track as "quantity" owned to accomodate the core set.
};

export type SettingsSlice = {
  settings: SettingsState;
} & {
  updateSettings: (payload: SettingsState) => void;
};
