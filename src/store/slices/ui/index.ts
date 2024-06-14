import type { StateCreator } from "zustand";

import type { StoreState } from "..";
import type { UISlice, UIState } from "./types";

export function getInitialUIState(): UIState {
  return {
    ui: {
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
  setHydrated() {
    set({ ui: { ...get().ui, hydrated: true } });
  },
  setListScrollRestore(snapshot) {
    set({ ui: { ...get().ui, listScrollRestore: snapshot } });
  },
  toggleSearch() {
    set({ ui: { ...get().ui, searchOpen: !get().ui.searchOpen } });
  },
  toggleSidebar() {
    set({ ui: { ...get().ui, sidebarOpen: !get().ui.sidebarOpen } });
  },
});
