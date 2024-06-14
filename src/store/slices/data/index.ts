import type { StateCreator } from "zustand";

import type { StoreState } from "..";
import type { DataSlice } from "./types";
import { isDeck } from "./types";

export function getInitialDataState() {
  return {
    data: {
      decks: {},
    },
  };
}

export const createDataSlice: StateCreator<StoreState, [], [], DataSlice> = (
  set,
  get,
) => ({
  ...getInitialDataState(),
  async importDecks(files) {
    for (const file of files) {
      try {
        const text = await file.text();
        const json = JSON.parse(text);

        if (!isDeck(json)) {
          throw new TypeError(`file '${file.name}' is not an arkhamdb deck`);
        }

        const state = get();

        if (state.data.decks[json.id]) {
          throw new Error(`Deck '${json.id}' already exists.`);
        }

        set({
          data: {
            ...state.data,
            decks: {
              ...state.data.decks,
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
    const localDecks = { ...state.data.decks };
    delete localDecks[id];
    set({ data: { ...state.data, decks: localDecks } });
  },
});
