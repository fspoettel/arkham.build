import { afterEach } from "node:test";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { StoreApi } from "zustand";

import deckExtraSlots from "@/test/fixtures/decks/extra_slots.json";
import { getMockStore } from "@/test/get-mock-store";

import type { StoreState } from ".";
import { selectActiveDeck } from "../selectors/decks";

describe("deck-view slice", () => {
  let store: StoreApi<StoreState>;

  beforeAll(async () => {
    store = await getMockStore();
  });

  describe("updateCardQuantity", () => {
    beforeEach(() => {
      store.setState({
        data: {
          decks: {
            "deck-id": deckExtraSlots,
          },
          history: {
            "deck-id": [],
          },
        },
      });
    });

    afterEach(async () => {
      store = await getMockStore();
    });

    it("throws an error if there is no active deck", () => {
      store.setState({
        deckView: null,
      });

      expect(() => {
        store.getState().updateCardQuantity("01000", 1, "slots");
      }).toThrowErrorMatchingInlineSnapshot(
        `[Error: assertion failed: trying to edit deck, but state does not have an active deck.]`,
      );
    });

    it("throws an error if the active deck does not exist", () => {
      store.getState().setActiveDeck("non-existent-deck");

      expect(() => {
        store.getState().updateCardQuantity("01000", 1, "slots");
      }).toThrowErrorMatchingInlineSnapshot(
        `[Error: assertion failed: trying to edit deck, but deck does not exist.]`,
      );
    });

    it("increments the quantity of a card", () => {
      const state = store.getState();
      state.setActiveDeck("deck-id");
      state.updateCardQuantity("01000", 1, "slots", "increment");
      expect(selectActiveDeck(store.getState())?.slots["01000"]).toEqual(2);
    });

    it("decrements the quantity of a card", () => {
      const state = store.getState();
      state.setActiveDeck("deck-id");
      state.updateCardQuantity("01000", -1, "slots", "increment");
      expect(selectActiveDeck(store.getState())?.slots["01000"]).toEqual(0);
    });

    it("sets the quantity of a card", () => {
      const state = store.getState();
      state.setActiveDeck("deck-id");
      state.updateCardQuantity("01000", 5, "slots", "set");
      expect(selectActiveDeck(store.getState())?.slots["01000"]).toEqual(5);
    });

    it("does not set the quantity of a card to a negative value", () => {
      const state = store.getState();
      state.setActiveDeck("deck-id");
      state.updateCardQuantity("01000", -5, "slots", "set");
      state.updateCardQuantity("01000", -5, "slots", "increment");
      expect(selectActiveDeck(store.getState())?.slots["01000"]).toEqual(0);
    });

    it("does not set the quantity of a card exceeding the limit", () => {
      const state = store.getState();
      state.setActiveDeck("deck-id");
      state.updateCardQuantity("06021", 5, "slots", "set");
      state.updateCardQuantity("06021", 5, "slots", "increment");
      expect(selectActiveDeck(store.getState())?.slots["06021"]).toEqual(3);
    });

    it("adjusts cards in side slots", () => {
      const state = store.getState();
      state.setActiveDeck("deck-id");
      state.updateCardQuantity("06021", 1, "sideSlots", "increment");
      expect(selectActiveDeck(store.getState())?.sideSlots?.["06021"]).toEqual(
        1,
      );
    });
  });
});
