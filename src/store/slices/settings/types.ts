export type SettingsState = {
  tabooSetId: number | null;
};

export type SettingsSlice = {
  settings: SettingsState;
} & {
  updateSettings: (partial: Partial<SettingsState>) => void;
};
