import type { StateCreator } from "zustand";

import type { StoreState } from ".";
import { makeLists } from "./lists";
import type { SettingsSlice, SettingsState } from "./settings.types";

export function getInitialSettings(): SettingsState {
  return {
    collection: {},
    showAllCards: true,
    hideWeaknessesByDefault: false,
    tabooSetId: undefined,
  };
}

export const createSettingsSlice: StateCreator<
  StoreState,
  [],
  [],
  SettingsSlice
> = (_, get) => ({
  settings: getInitialSettings(),
  // TODO: extract to `shared` since this touches other state slices.
  updateSettings(settings) {
    const state = get();

    state.refreshLookupTables({
      settings,
      lists: makeLists(settings),
    });
  },
});
