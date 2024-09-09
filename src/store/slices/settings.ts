import type { StateCreator } from "zustand";

import type { StoreState } from ".";
import { makeLists } from "./lists";
import type { SettingsSlice, SettingsState } from "./settings.types";

export function getInitialListsSetting(): SettingsState["lists"] {
  return {
    player: {
      group: ["subtype", "type", "slot"],
      sort: ["name", "level"],
      showCardText: false,
    },
    encounter: {
      group: ["pack", "encounter_set"],
      sort: ["position"],
      showCardText: false,
    },
    investigator: {
      group: ["cycle"],
      sort: ["name"],
      showCardText: false,
    },
    deck: {
      group: ["type", "slot"],
      sort: ["name", "level"],
      showCardText: false,
    },
  };
}

export function getInitialSettings(): SettingsState {
  return {
    collection: {},
    lists: getInitialListsSetting(),
    hideWeaknessesByDefault: false,
    showAllCards: true,
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
