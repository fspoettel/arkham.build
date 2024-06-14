import { StateCreator } from "zustand";
import { FiltersSlice } from "./types";
import { StoreState } from "..";

export const createFiltersSlice: StateCreator<
  StoreState,
  [],
  [],
  FiltersSlice
> = (set, get) => ({
  filters: {
    cardType: "player",
  },
  setCardTypeFilter(cardType) {
    set({
      filters: {
        ...get().filters,
        cardType,
      },
    });
  },
});
