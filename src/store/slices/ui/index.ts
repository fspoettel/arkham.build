import type { StateCreator } from "zustand";

import type { StoreState } from "..";
import type { UISlice, UIState } from "./types";

export function getInitialUIState(): UIState {
  return {
    ui: {
      hydrated: false,
      initialized: false,
      listScrollRestore: undefined,
      filtersOpen: false,
      sidebarOpen: false,
    },
  };
}

export const createUISlice: StateCreator<StoreState, [], [], UISlice> = (
  set,
  get,
) => ({
  ...getInitialUIState(),
  setHydrated() {
    set({ ui: { ...get().ui, hydrated: true } });
  },
  setListScrollRestore(snapshot) {
    set({ ui: { ...get().ui, listScrollRestore: snapshot } });
  },
  toggleFilters(val?: boolean) {
    const state = get();
    set({
      ui: {
        ...state.ui,
        filtersOpen: val != null ? val : !state.ui.filtersOpen,
      },
    });
  },
  toggleSidebar(val?: boolean) {
    const state = get();
    set({
      ui: {
        ...state.ui,
        sidebarOpen: val != null ? val : !state.ui.sidebarOpen,
      },
    });
  },
});
