import type { StateCreator } from "zustand";

import type { StoreState } from ".";
import type { SearchSlice, SearchState } from "./search.types";

export function getInitialState(): SearchState {
  return {
    search: {
      value: "",
      includeGameText: false,
      includeFlavor: false,
      includeBacks: false,
    },
  };
}

export const createSearchSlice: StateCreator<
  StoreState,
  [],
  [],
  SearchSlice
> = (set, get) => ({
  ...getInitialState(),
  setSearchValue(value) {
    set({ search: { ...get().search, value } });
  },
  setSearchFlag(flag, value) {
    set({ search: { ...get().search, [flag]: value } });
  },
});
