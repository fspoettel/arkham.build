import { StateCreator } from "zustand";
import { CardTypeFilter, Filters, FiltersSlice } from "./types";
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
    skillIcons: {
      agility: null,
      combat: null,
      intellect: null,
      willpower: null,
      wild: null,
      any: null,
    },
    type: {},
    subtype: {},
    trait: {},
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
    set({ filters: resetFilterKeys(get(), type, [path]) });
  },

  resetFilterKeys<C extends CardTypeFilter, P extends keyof Filters[C]>(
    type: C,
    paths: P[],
  ) {
    set({ filters: resetFilterKeys(get(), type, paths) });
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

  toggleComboboxFilter(type, path, key, value) {
    const filters = updateValue(get(), type, path, key, value);
    set({ filters });
  },
});

function resetFilterKeys<C extends CardTypeFilter, P extends keyof Filters[C]>(
  state: StoreState,
  type: C,
  paths: P[],
) {
  const initialState = getInitialState();

  const filterResets = paths.reduce(
    (acc, path) => {
      acc[path] = initialState[type][path];
      return acc;
    },
    {} as Partial<Filters[C]>,
  );

  return {
    ...state.filters,
    [type]: {
      ...state.filters[type],
      ...filterResets,
    },
  };
}

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
