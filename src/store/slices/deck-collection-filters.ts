import type { StateCreator } from "zustand";
import type { StoreState } from ".";
import type {
  DeckFiltersSlice,
  DeckValidity,
  SortCriteria,
  SortOrder,
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
        expCost: undefined,
      },
      open: {
        tags: false,
        properties: false,
        validity: false,
        expCost: false,
      },
      sort: {
        order: "desc" as SortOrder,
        criteria: "date_updated" as SortCriteria,
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

  setDeckSort(order, criteria) {
    const state = get();
    set({
      deckFilters: {
        ...state.deckFilters,
        sort: {
          order: order,
          criteria: criteria,
        },
      },
    });
  },

  // Set Order-only and Criteria-only funcs are unused for now
  // but the functionality is most likely going to be used in My Decks page
  setDeckSortOrder(order) {
    const state = get();

    set({
      deckFilters: {
        ...state.deckFilters,
        sort: {
          ...state.deckFilters.sort,
          order: order,
        },
      },
    });
  },

  setDeckSortCriteria(criteria) {
    const state = get();

    set({
      deckFilters: {
        ...state.deckFilters,
        sort: {
          ...state.deckFilters.sort,
          criteria: criteria,
        },
      },
    });
  },

  resetDeckFilter(filter) {
    const state = get();
    const initialState = getInitialUIState().deckFilters.filters[filter];

    set({
      deckFilters: {
        ...state.deckFilters,
        open: { ...state.deckFilters.open },
        filters: { ...state.deckFilters.filters, [filter]: initialState },
      },
    });
  },
});
