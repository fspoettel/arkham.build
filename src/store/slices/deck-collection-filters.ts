import type { StateCreator } from "zustand";
import type { StoreState } from ".";
import type {
  DeckFiltersSlice,
  DeckFiltersState,
} from "./deck-collection-filters.types";

function getInitialUIState(): DeckFiltersState {
  return {
    filters: {
      faction: [],
      search: "",
      tags: [],
      properties: {
        parallel: false,
      },
      validity: "all",
      expCost: undefined,
    },
    open: {
      tags: false,
      properties: false,
      validity: false,
      expCost: false,
    },
    sort: {
      order: "desc",
      criteria: "date_updated",
    },
  };
}

export const createDeckFiltersSlice: StateCreator<
  StoreState,
  [],
  [],
  DeckFiltersSlice
> = (set, get) => ({
  deckFilters: getInitialUIState(),
  addDecksFilter(type, value) {
    const state = get();
    const filterValues = structuredClone(state.deckFilters.filters);
    filterValues[type] = value;

    set({
      deckFilters: {
        ...state.deckFilters,
        filters: filterValues,
      },
    });
  },

  setDeckFilterOpen(filter, value) {
    const state = get();

    set({
      deckFilters: {
        ...state.deckFilters,
        open: { ...state.deckFilters.open, [filter]: value },
      },
    });
  },

  setDeckSort(payload) {
    const state = get();
    set({
      deckFilters: {
        ...state.deckFilters,
        sort: {
          ...state.deckFilters.sort,
          ...payload,
        },
      },
    });
  },

  resetDeckFilter(filter) {
    const state = get();
    const initialState = getInitialUIState().filters[filter];

    set({
      deckFilters: {
        ...state.deckFilters,
        open: { ...state.deckFilters.open },
        filters: { ...state.deckFilters.filters, [filter]: initialState },
      },
    });
  },
});
