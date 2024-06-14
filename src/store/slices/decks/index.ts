import type { StateCreator } from "zustand";

import type { StoreState } from "..";
import { type DecksSlice, isDeck } from "./types";

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
  async importDecks(files) {
    for (const file of files) {
      try {
        const text = await file.text();
        const json = JSON.parse(text);

        if (!isDeck(json)) {
          throw new TypeError(`file '${file.name}' is not an arkhamdb deck`);
        }

        const state = get();

        if (state.decks.local[json.id]) {
          throw new Error(`Deck '${json.id}' already exists.`);
        }

        set({
          decks: {
            ...state.decks,
            local: {
              ...state.decks.local,
              [json.id]: json,
            },
          },
        });
      } catch (err) {
        console.error(`could not import deck '${file.name}':`, err);
      }
    }
  },
  deleteDeck(id) {
    const state = get();
    const localDecks = { ...state.decks.local };
    delete localDecks[id];
    set({ decks: { ...state.decks, local: localDecks } });
  },
});
