import type { StateCreator } from "zustand";

import type { StoreState } from ".";
import type { List } from "./lists.types";
import type { SettingsSlice, SettingsState } from "./settings.types";

export function getInitialSettings(): SettingsState {
  return {
    collection: {},
    showAllCards: false,
    tabooSetId: undefined,
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
  updateSettings(form) {
    const state = get();

    const settings = parseForm(form);

    const nextSize = Object.values(settings.collection).some((x) => x);
    const ownership = nextSize && !settings.showAllCards ? "owned" : "all";

    const lists = Object.entries({ ...state.lists }).reduce<
      Record<string, List>
    >((acc, [id, list]) => {
      const ownershipIndex = list.filters.indexOf("ownership");

      if (ownershipIndex !== -1) {
        const filterValue = list.filterValues[ownershipIndex];
        filterValue.value = ownership;
      }

      acc[id] = list;
      return acc;
    }, {});

    state.refreshLookupTables({ settings, lists });
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
