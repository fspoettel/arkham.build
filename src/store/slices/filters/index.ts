import { StateCreator } from "zustand";
import { Filters, FiltersSlice } from "./types";
import { StoreState } from "..";

function getInitialState(): Filters {
  const shared = {
    faction: {
      value: [],
    },
    cost: {
      value: undefined,
      even: false,
      odd: false,
      x: true,
    },
  };

  return {
    cardType: "player",
    player: {
      ...structuredClone(shared),
      level: {
        value: undefined,
        exceptional: false,
        nonexceptional: false,
      },
    },
    encounter: {
      ...structuredClone(shared),
    },
  };
}

export const createFiltersSlice: StateCreator<
  StoreState,
  [],
  [],
  FiltersSlice
> = (set, get) => ({
  filters: getInitialState(),
  resetFilters() {
    set({ filters: getInitialState() });
  },
  setActiveFilter(slice, path, key, value) {
    set({
      filters: updateValue(get(), slice, path, key, value),
    });
  },
  setActivePlayerFilter(path, key, value) {
    set({
      filters: updateValue(get(), "player", path, key, value),
    });
  },
  setActiveEncounterFilter(path, key, value) {
    set({
      filters: updateValue(get(), "encounter", path, key, value),
    });
  },

  resetFilterKey(type, path) {
    const state = get();
    set({
      filters: {
        ...state.filters,
        [type]: {
          ...state.filters[type],
          [path]: getInitialState()[type][path],
        },
      },
    });
  },

  setActiveCardType(cardType) {
    set({
      filters: {
        ...get().filters,
        cardType,
      },
    });
  },
  setActiveLevelShortcut(value) {
    if (value === "0") {
      const filters = updateValue(get(), "player", "level", "value", [0, 0]);
      set({ filters });
    } else if (value === "1-5") {
      const filters = updateValue(get(), "player", "level", "value", [1, 5]);
      set({ filters });
    } else {
      const filters = updateValue(get(), "player", "level", "value", undefined);
      set({ filters });
    }
  },
});

function updateValue<
  C extends "player" | "encounter",
  P extends keyof StoreState["filters"][C],
  K extends keyof StoreState["filters"][C][P],
>(
  state: StoreState,
  slice: C,
  path: P,
  key: K,
  value: StoreState["filters"][C][P][K],
) {
  return {
    ...state.filters,
    [slice]: {
      ...state.filters[slice],
      [path]: {
        ...state.filters[slice][path],
        [key]: value,
      },
    },
  };
}
