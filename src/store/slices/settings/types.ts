export type SettingsState = {
  tabooSetId: number | null;
  collection: Record<string, number>; // track as "quantity" owned to accomodate the core set.
};

export type SettingsSlice = {
  settings: SettingsState;
} & {
  updateSettings: (partial: FormData) => void;
};
