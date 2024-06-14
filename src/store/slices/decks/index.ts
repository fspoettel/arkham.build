/* eslint-disable @typescript-eslint/no-unused-vars */
import type { StateCreator } from "zustand";

import type { StoreState } from "..";
import type { DecksSlice } from "./types";

export function getInitialDecksState() {
  return {
    decks: {
      local: {},
    },
  };
}

export const createDecksSlice: StateCreator<StoreState, [], [], DecksSlice> = (
  set,
  get,
) => ({
  ...getInitialDecksState(),
});
