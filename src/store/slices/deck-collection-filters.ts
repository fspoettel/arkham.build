import type { StateCreator } from "zustand";
import type { StoreState } from ".";
import type {
  DeckFiltersSlice,
  DeckValidity,
} from "./deck-collection-filters.types";

function getInitialUIState() {
  return {
    deckFilters: {
      filters: {
        faction: [],
        search: "",
        tags: [],
        properties: {
          parallel: false,
        },
        validity: "all" as DeckValidity,
      },
      open: {
        tags: false,
        properties: false,
        validity: false,
      },
    },
  };
}

export const createDeckFiltersSlice: StateCreator<
  StoreState,
  [],
  [],
  DeckFiltersSlice
> = (set, get) => ({
  ...getInitialUIState(),
  addDecksFilter(type, value) {
    const state = get();
    const filterValues = structuredClone(state.deckFilters.filters);

    filterValues[type] = value;

    set({
      deckFilters: {
        ...state.deckFilters,
        open: { ...state.deckFilters.open },
        filters: filterValues,
      },
    });
  },

  setDeckFilterOpen(filter, value) {
    const state = get();

    set({
      deckFilters: {
        ...state.deckFilters,
        filters: structuredClone(state.deckFilters.filters),
        open: { ...state.deckFilters.open, [filter]: value },
      },
    });
  },

  resetDeckFilter(filter) {
    const state = get();
    const cleanState = getInitialUIState().deckFilters.filters[filter];
    const filterValues = structuredClone(state.deckFilters.filters);

    set({
      deckFilters: {
        ...state.deckFilters,
        open: { ...state.deckFilters.open },
        filters: { ...filterValues, [filter]: cleanState },
      },
    });
  },
});
