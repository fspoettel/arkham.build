import type { StateCreator } from "zustand";

import { assert } from "@/utils/assert";

import { download } from "@/utils/download";
import type { StoreState } from ".";
import { randomId } from "../lib/deck-factory";
import {
  formatDeckAsText,
  formatDeckExport,
  formatDeckImport,
} from "../lib/serialization/deck-io";
import {
  selectActiveDeckById,
  selectDeckValidById,
} from "../selectors/deck-view";
import { queryDeck } from "../services/queries";
import { type DataSlice, type Deck, type Id, isDeck } from "./data.types";

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

    const { data, type } = await queryDeck(input);
    const deck = formatDeckImport(state, data, type);

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

  async importFromFiles(files) {
    const state = get();
    const decks = [];

    for (const file of files) {
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);

        assert(isDeck(parsed), `file '${file.name}' is not an arkhamdb deck`);
        const deck = formatDeckImport(state, parsed, "deck");

        decks.push(deck);
      } catch (err) {
        console.error(`could not import deck '${file.name}':`, err);
      }
    }

    set({
      data: {
        ...state.data,
        decks: {
          ...state.data.decks,
          ...decks.reduce<Record<Id, Deck>>((acc, deck) => {
            acc[deck.id] = deck;
            return acc;
          }, {}),
        },
        history: {
          ...state.data.history,
          ...decks.reduce<Record<Id, string[]>>((acc, deck) => {
            acc[deck.id] = [];
            return acc;
          }, {}),
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
      source: "local",
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

  exportJSON(id) {
    const state = get();

    const deck = state.data.decks[id];
    assert(deck, `Deck ${id} does not exist.`);

    const validationResult = selectDeckValidById(state, id);

    const deckExport = formatDeckExport(deck, validationResult);

    download(
      JSON.stringify(deckExport, null, 2),
      `arkhambuild-${deck.id}.json`,
      "application/json",
    );
  },
  exportText(id) {
    const state = get();

    const deck = selectActiveDeckById(state, id);
    assert(deck, `Deck ${id} does not exist.`);

    download(
      formatDeckAsText(state, deck),
      `arkhambuild-${deck.id}.md`,
      "text/markdown",
    );
  },
});
