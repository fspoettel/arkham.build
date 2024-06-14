import { StateCreator } from "zustand";

import { StoreState } from "..";
import { SearchSlice, SearchState } from "./types";

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
