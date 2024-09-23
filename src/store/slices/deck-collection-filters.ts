import type { StateCreator } from "zustand";
import type { StoreState } from ".";
import type {
  DeckFiltersSlice,
  DeckFiltersState,
} from "./deck-collection-filters.types";

function getInitialUIState(): DeckFiltersState {
  return {
    deckFilters: {
      faction: [],
      search: "",
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
    const filterValues = structuredClone(state.deckFilters);

    filterValues[type] = value;

    set({
      deckFilters: filterValues,
    });
  },
});
