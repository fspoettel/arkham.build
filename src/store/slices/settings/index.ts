import type { StateCreator } from "zustand";

import type { StoreState } from "..";
import type { SettingsSlice, SettingsState } from "./types";

export function getInitialSettings(): SettingsState {
  return {
    collection: {},
    showAllCards: false,
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
  updateSettings(form) {
    const state = get();

    const settings = parseForm(form);

    const partial: Partial<StoreState> = {};

    const nextSize = Object.values(settings.collection).some((x) => x);

    const ownership = nextSize && !settings.showAllCards ? "owned" : "all";

    partial.filters = {
      ...state.filters,
      player: {
        ...state.filters.player,
        ownership: { value: ownership, open: false },
      },
      encounter: {
        ...state.filters.encounter,
        ownership: { value: ownership, open: false },
      },
    };

    set({ ...partial, settings });
    state.refreshLookupTables();
  },
});

function parseForm(form: FormData) {
  return Array.from(form.entries()).reduce<SettingsState>((acc, [key, val]) => {
    if (key === "taboo-set") {
      const s = val.toString();
      acc.tabooSetId = s ? Number.parseInt(s, 10) : null;
    } else if (key === "show-all-cards") {
      const s = val.toString();
      acc.showAllCards = s === "on";
    } else {
      const s = val.toString();
      acc.collection[key] = s === "on" ? 1 : safeInt(s);
    }

    return acc;
  }, getInitialSettings());
}

function safeInt(val: string) {
  const n = Number.parseInt(val, 10);
  return Number.isNaN(n) ? 0 : n;
}
