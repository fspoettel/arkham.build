import type { StateCreator } from "zustand";

import { assert } from "@/utils/assert";

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
  deleteDeck(id) {
    const state = get();
    const decks = { ...state.data.decks };

    const deck = decks[id];
    assert(deck.next_deck == null, "Cannot delete a deck that has upgrades.");

    delete decks[id];
    const history = { ...state.data.history };

    if (history[id]) {
      for (const prevId of history[id]) {
        delete decks[prevId];
      }
    }

    delete history[id];
    set({ data: { ...state.data, decks, history } });
  },
});
