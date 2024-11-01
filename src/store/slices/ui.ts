import { MQ_FLOATING_FILTERS, MQ_FLOATING_SIDEBAR } from "@/utils/constants";
import type { StateCreator } from "zustand";
import type { StoreState } from ".";
import type { UISlice, UIState } from "./ui.types";

function getInitialUIState(): UIState {
  return {
    ui: {
      hydrated: false,
      initialized: false,
      showUnusableCards: false,
      sidebarOpen: !window.matchMedia(MQ_FLOATING_SIDEBAR).matches,
      filtersOpen: !window.matchMedia(MQ_FLOATING_FILTERS).matches,
      usingDeckTools: false,
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
  setShowUnusableCards(showUnusableCards: boolean) {
    set({ ui: { ...get().ui, showUnusableCards } });
  },
  setSidebarOpen(sidebarOpen: boolean) {
    set({ ui: { ...get().ui, sidebarOpen } });
  },
  setFiltersOpen(filtersOpen: boolean) {
    set({ ui: { ...get().ui, filtersOpen } });
  },
  setUsingDeckTools(usingDeckTools: boolean) {
    set({
      ui: {
        ...get().ui,
        usingDeckTools,
        sidebarOpen: !window.matchMedia(MQ_FLOATING_SIDEBAR).matches,
      },
    });
  },
});
