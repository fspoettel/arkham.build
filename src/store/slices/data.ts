import type { StateCreator } from "zustand";

import { assert } from "@/utils/assert";

import type { StoreState } from ".";
import { queryDeck, queryHistory } from "../services/queries";
import type { DataSlice, Deck } from "./data.types";

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

    assert(!state.data.decks[deck.id], `Deck ${deck.id} already exists.`);

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
          ...deckHistory.reduce<Record<string, Deck>>((acc, history) => {
            acc[history.id] = history;
            return acc;
          }, {}),
        },
        history: nextUpgrades,
      },
    });
  },

  duplicateDeck(id) {
    const state = get();

    const deck = state.data.decks[id];
    assert(deck, `Deck ${id} does not exist.`);

    const now = new Date().toISOString();

    const newDeck: Deck = {
      ...structuredClone(deck),
      id: window.crypto.randomUUID(),
      name: `(Copy) ${deck.name}`,
      date_creation: now,
      date_update: now,
      next_deck: null,
      previous_deck: null,
      version: "0.1",
      xp: null,
    };

    set({
      data: {
        ...state.data,
        decks: {
          ...state.data.decks,
          [newDeck.id]: newDeck,
        },
        history: {
          ...state.data.history,
          [newDeck.id]: [],
        },
      },
    });

    return newDeck.id;
  },
});
