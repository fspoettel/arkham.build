import type { StateCreator } from "zustand";

import type { StoreState } from "..";
import type { UISlice, UIState } from "./types";

export function getInitialUIState(): UIState {
  return {
    ui: {
      activeDeckId: undefined,
      hydrated: false,
      initialized: false,
      listScrollRestore: undefined,
      searchOpen: false,
      sidebarOpen: false,
    },
  };
}

export const createUISlice: StateCreator<StoreState, [], [], UISlice> = (
  set,
  get,
) => ({
  ...getInitialUIState(),
  setActiveDeckId(activeDeckId) {
    set({ ui: { ...get().ui, activeDeckId } });
  },
  setHydrated() {
    set({ ui: { ...get().ui, hydrated: true } });
  },
  setListScrollRestore(snapshot) {
    set({ ui: { ...get().ui, listScrollRestore: snapshot } });
  },
  toggleSearch() {
    const state = get();
    set({ ui: { ...state.ui, searchOpen: !state.ui.searchOpen } });
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
