import { StateCreator } from "zustand";
import { Filters, FiltersSlice } from "./types";
import { StoreState } from "..";

function getInitialState(): Filters {
  return {
    cardType: "player",
    player: {
      faction: [],
      level: {
        value: undefined,
        exceptional: false,
        nonexceptional: false,
      },
      cost: {
        value: undefined,
        even: false,
        odd: false,
      },
    },
    encounter: {
      faction: [],
      cost: {
        value: undefined,
        even: false,
        odd: false,
      },
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
  setActiveLevelValue(value) {
    const state = get();
    set({
      filters: {
        ...state.filters,
        player: {
          ...state.filters.player,
          level: {
            ...state.filters.player.level,
            value,
          },
        },
      },
    });
  },
  setActiveLevelFlag(key, value) {
    const state = get();
    set({
      filters: {
        ...state.filters,
        player: {
          ...state.filters.player,
          level: {
            ...state.filters.player.level,
            [key]: value,
          },
        },
      },
    });
  },
});
