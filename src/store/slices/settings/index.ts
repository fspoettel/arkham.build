import { StateCreator } from "zustand";

import { StoreState } from "..";
import { SettingsSlice, SettingsState } from "./types";

export function getInitialSettings(): SettingsState {
  return {
    collection: {},
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

    set({
      settings: parseForm(form),
    });

    state.refreshLookupTables();
  },
});

function parseForm(form: FormData) {
  return Array.from(form.entries()).reduce<SettingsState>((acc, [key, val]) => {
    if (key === "taboo-set") {
      const s = val.toString();
      acc.tabooSetId = s ? Number.parseInt(s, 10) : null;
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
