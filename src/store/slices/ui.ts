import type { StateCreator } from "zustand";
import type { StoreState } from ".";
import type { UISlice, UIState } from "./ui.types";

function getInitialUIState(): UIState {
  return {
    ui: {
      initialized: false,
      showUnusableCards: false,
      showLimitedAccess: true,
    },
  };
}

export const createUISlice: StateCreator<StoreState, [], [], UISlice> = (
  set,
  get,
) => ({
  ...getInitialUIState(),
  setShowUnusableCards(showUnusableCards: boolean) {
    set({ ui: { ...get().ui, showUnusableCards } });
  },
  setShowLimitedAccess(showLimitedAccess: boolean) {
    set({ ui: { ...get().ui, showLimitedAccess } });
  },
});
