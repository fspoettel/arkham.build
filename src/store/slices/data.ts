import type { StateCreator } from "zustand";

import type { StoreState } from ".";
import { queryDeck, queryUpgrades } from "../services/queries";
import type { DataSlice } from "./data.types";

export function getInitialDataState() {
  return {
    data: {
      decks: {},
      upgrades: {},
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
    }

    if (state.data.decks[deck.id]) {
      throw new Error(`Deck ${deck.id} already exists.`);
    }

    const upgrades =
      type === "deck" && deck.previous_deck
        ? await queryUpgrades(deck.previous_deck)
        : [];

    set({
      data: {
        ...state.data,
        decks: {
          ...state.data.decks,
          [deck.id]: deck,
          ...upgrades.reduce(
            (acc, upgrade) => ({ ...acc, [upgrade.id]: upgrade }),
            {},
          ),
        },
        upgrades: {
          ...state.data.upgrades,
          [deck.id]: upgrades.map((upgrade) => upgrade.id),
        },
      },
    });
  },
  deleteDeck(id) {
    const state = get();
    const localDecks = { ...state.data.decks };
    delete localDecks[id];

    const upgrades = { ...state.data.upgrades };

    if (upgrades[id]) {
      for (const upgrade of upgrades[id]) {
        delete localDecks[upgrade];
      }
    }

    delete upgrades[id];

    set({ data: { ...state.data, decks: localDecks, upgrades } });
  },
});
