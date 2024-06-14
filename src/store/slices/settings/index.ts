import { StateCreator } from "zustand";

import { StoreState } from "..";
import { SettingsSlice, SettingsState } from "./types";

export function getInitialSettings(): SettingsState {
  return {
    tabooSetId: null,
  };
}

export const createSettingsSlice: StateCreator<
  StoreState,
  [],
  [],
  SettingsSlice
> = (set, get) => ({
  settings: getInitialSettings(),
  updateSettings(partial) {
    const state = get();
    set({ settings: { ...state.settings, ...partial } });
    state.refreshLookupTables();
  },
});
