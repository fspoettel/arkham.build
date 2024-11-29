import type { StateCreator } from "zustand";
import type { StoreState } from ".";
import { makeLists } from "./lists";
import type {
  ListConfig,
  SettingsSlice,
  SettingsState,
} from "./settings.types";

export const PLAYER_DEFAULTS: ListConfig = {
  group: ["subtype", "type", "slot"],
  sort: ["name", "level"],
  viewMode: "compact",
};

export const ENCOUNTER_DEFAULTS: ListConfig = {
  group: ["pack", "encounter_set"],
  sort: ["position"],
  viewMode: "compact",
};

const INVESTIGATOR_DEFAULTS: ListConfig = {
  group: ["cycle"],
  sort: ["position"],
  viewMode: "compact",
};

const DECK_DEFAULTS: ListConfig = {
  group: ["type", "slot"],
  sort: ["name", "level"],
  viewMode: "compact",
};

export function getInitialListsSetting(): SettingsState["lists"] {
  return {
    player: structuredClone(PLAYER_DEFAULTS),
    encounter: structuredClone(ENCOUNTER_DEFAULTS),
    investigator: structuredClone(INVESTIGATOR_DEFAULTS),
    deck: structuredClone(DECK_DEFAULTS),
  };
}

export function getInitialSettings(): SettingsState {
  return {
    collection: {},
    lists: getInitialListsSetting(),
    fontSize: 100,
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
