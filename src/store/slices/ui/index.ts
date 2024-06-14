import { StateCreator } from "zustand";

import { StoreState } from "..";
import { UISlice, UIState } from "./types";

export function getInitialUIState(): UIState {
  return {
    ui: {
      listScrollRestore: undefined,
    },
  };
}

export const createUISlice: StateCreator<StoreState, [], [], UISlice> = (
  set,
  get,
) => ({
  ...getInitialUIState(),
  setInitialized() {
    set({ ui: { ...get().ui, initialized: true } });
  },
  setListScrollRestore(snapshot) {
    set({ ui: { listScrollRestore: snapshot } });
  },
});
