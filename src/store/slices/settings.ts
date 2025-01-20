import type { StateCreator } from "zustand";
import type { StoreState } from ".";
import { makeLists } from "./lists";
import type {
  DecklistConfig,
  ListConfig,
  SettingsSlice,
  SettingsState,
} from "./settings.types";

export const PLAYER_DEFAULTS: ListConfig = {
  group: ["subtype", "type", "slot"],
  sort: ["name", "level", "position"],
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

export const DECK_DEFAULTS: DecklistConfig = {
  group: ["type", "slot"],
  sort: ["name", "level"],
};

export const DECK_SCANS_DEFAULTS: DecklistConfig = {
  group: ["type"],
  sort: ["slot", "name", "level", "position"],
};

export function getInitialListsSetting(): SettingsState["lists"] {
  return {
    player: structuredClone(PLAYER_DEFAULTS),
    encounter: structuredClone(ENCOUNTER_DEFAULTS),
    investigator: structuredClone(INVESTIGATOR_DEFAULTS),
    deck: structuredClone(DECK_DEFAULTS),
    deckScans: structuredClone(DECK_SCANS_DEFAULTS),
  };
}

export function getInitialSettings(): SettingsState {
  return {
    collection: {},
    lists: getInitialListsSetting(),
    fontSize: 100,
    hideWeaknessesByDefault: false,
    showAllCards: true,
    showPreviews: false,
    tabooSetId: undefined,
    useLimitedPoolForWeaknessDraw: true,
    flags: {},
  };
}

export const createSettingsSlice: StateCreator<
  StoreState,
  [],
  [],
  SettingsSlice
> = (set, get) => ({
  settings: getInitialSettings(),
  // TODO: extract to `shared` since this touches other state slices.
  updateSettings(settings) {
    const state = get();

    state.refreshLookupTables({
      settings,
      lists: makeLists(settings),
    });
  },
  toggleFlag(key) {
    set((state) => ({
      settings: {
        ...state.settings,
        flags: {
          ...state.settings.flags,
          [key]: !state.settings.flags?.[key],
        },
      },
    }));
  },
});
