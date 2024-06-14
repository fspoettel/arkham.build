import type { StateCreator } from "zustand";

import type { StoreState } from ".";
import { queryDeck, queryHistory } from "../services/queries";
import type { DataSlice } from "./data.types";

export function getInitialDataState() {
  return {
    data: {
      decks: {},
      history: {},
    },
  };
}

export const createDataSlice: StateCreator<StoreState, [], [], DataSlice> = (
  set,
  get,
) => ({
  ...getInitialDataState(),
  async importDeck(input) {
    const state = get();

    const { data: deck, type } = await queryDeck(input);

    if (type === "decklist") {
      deck.id = window.crypto.randomUUID();
      deck.tags = deck.tags.replaceAll(", ", " ");
    }

    if (state.data.decks[deck.id]) {
      throw new Error(`Deck ${deck.id} already exists.`);
    }

    const deckHistory =
      type === "deck" && deck.previous_deck
        ? await queryHistory(deck.previous_deck)
        : [];

    const historyIds = deckHistory.map(({ id }) => id);

    const nextUpgrades = {
      ...state.data.history,
      [deck.id]: historyIds,
    };

    for (const id of historyIds) {
      delete nextUpgrades[id];
    }

    set({
      data: {
        ...state.data,
        decks: {
          ...state.data.decks,
          [deck.id]: deck,
          ...deckHistory.reduce(
            (acc, history) => ({ ...acc, [history.id]: history }),
            {},
          ),
        },
        history: nextUpgrades,
      },
    });
  },
  deleteDeck(deckId) {
    const state = get();
    const decks = { ...state.data.decks };
    delete decks[deckId];

    const history = { ...state.data.history };

    if (history[deckId]) {
      for (const id of history[deckId]) {
        delete decks[id];
      }
    }

    delete history[deckId];

    set({ data: { ...state.data, decks, history } });
  },
});
