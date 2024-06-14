import type { StateCreator } from "zustand";

import type { StoreState } from "..";
import type { DecksSlice } from "./types";

// import deck from "@/test/fixtures/decks/parallal_jim.json";

export function getInitialDecksState() {
  return {
    decks: {
      local: {},
    },
  };
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export const createDecksSlice: StateCreator<StoreState, [], [], DecksSlice> = (
  set,
  get,
) => ({
  ...getInitialDecksState(),
});
