import type { StateCreator } from "zustand";

import type { StoreState } from ".";
import type { UISlice, UIState } from "./ui.types";

function getInitialUIState(): UIState {
  return {
    ui: {
      hydrated: false,
      initialized: false,
      showUnusableCards: false,
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
});
