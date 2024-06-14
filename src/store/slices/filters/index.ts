import { StateCreator } from "zustand";
import { Filters, FiltersSlice } from "./types";
import { StoreState } from "..";

function getInitialState(): Filters {
  return {
    cardType: "player",
    player: {
      faction: [],
      level: {
        min: undefined,
        max: undefined,
        exceptional: false,
        nonExceptional: false,
      },
      cost: {
        min: undefined,
        max: undefined,
        even: false,
        odd: false,
      },
    },
    encounter: {
      faction: [],
    },
    shared: {},
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
  setCardTypeFilter(cardType) {
    set({
      filters: {
        ...get().filters,
        cardType,
      },
    });
  },
  setFactionFilter(factions) {
    const state = get();
    const cardType = state.filters.cardType;

    set({
      filters: {
        ...state.filters,
        [cardType]: {
          ...state.filters[cardType],
          faction: factions,
        },
      },
    });
  },
});
