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
) => ({
  ...getInitialUIState(),
  setListScrollRestore(snapshot) {
    set({ ui: { listScrollRestore: snapshot } });
  },
});
