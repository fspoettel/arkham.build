/* eslint-disable @typescript-eslint/no-unused-vars */
import type { StateCreator } from "zustand";

import data from "@/store/services/data/stubs/decks.json";

import type { StoreState } from "..";
import type { DecksSlice } from "./types";

export function getInitialDecksState() {
  return {
    decks: {
      local: data.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {}),
    },
  };
}

export const createDecksSlice: StateCreator<StoreState, [], [], DecksSlice> = (
  set,
  get,
) => ({
  ...getInitialDecksState(),
});
