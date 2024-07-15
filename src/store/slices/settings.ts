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

export function getEmptySettings(): SettingsState {
  return {
    collection: {},
    showAllCards: false,
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
  updateSettings(form) {
    const state = get();

    const settings = parseForm(form);

    state.refreshLookupTables({
      settings,
      lists: makeLists(settings),
    });
  },
});

function parseForm(form: FormData) {
  return Array.from(form.entries()).reduce<SettingsState>((acc, [key, val]) => {
    if (key === "taboo-set") {
      const s = val.toString();
      acc.tabooSetId = s ? Number.parseInt(s, 10) : undefined;
    } else if (key === "show-all-cards") {
      const s = val.toString();
      acc.showAllCards = s === "on";
    } else if (key === "hide-weaknesses-by-default") {
      const s = val.toString();
      acc.hideWeaknessesByDefault = s === "on";
    } else {
      const s = val.toString();
      acc.collection[key] = s === "on" ? 1 : safeInt(s);
    }

    return acc;
  }, getEmptySettings());
}

function safeInt(val: string) {
  const n = Number.parseInt(val, 10);
  return Number.isNaN(n) ? 0 : n;
}
