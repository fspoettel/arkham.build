import type { StateCreator } from "zustand";

import { assert } from "@/utils/assert";

import type { StoreState } from ".";
import { randomId } from "../lib/deck-factory";
import { queryDeck } from "../services/queries";
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
    deck.id = randomId();

    if (type === "decklist") {
      deck.tags = deck.tags.replaceAll(", ", " ");
    }

    set({
      data: {
        ...state.data,
        decks: {
          ...state.data.decks,
          [deck.id]: deck,
        },
        history: {
          ...state.data.history,
          [deck.id]: [],
        },
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
      id: randomId(),
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
