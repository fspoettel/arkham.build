import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { StoreApi } from "zustand";

import deckExtraSlots from "@/test/fixtures/decks/extra_slots.json";
import { getMockStore } from "@/test/get-mock-store";

import type { StoreState } from ".";
import { selectResolvedDeckById } from "../selectors/deck-view";

describe("deck-view slice", () => {
  let store: StoreApi<StoreState>;

  beforeAll(async () => {
    store = await getMockStore();
  });

  describe("updateCardQuantity", () => {
    beforeEach(() => {
      store.setState({
        deckEdits: {},
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

    it("increments the quantity of a card", () => {
      const state = store.getState();
      state.updateCardQuantity("deck-id", "01000", 1, 2, "slots", "increment");
      expect(
        selectResolvedDeckById(store.getState(), "deck-id", true)?.slots[
          "01000"
        ],
      ).toEqual(2);
    });

    it("decrements the quantity of a card", () => {
      const state = store.getState();

      state.updateCardQuantity("deck-id", "01000", -1, 2, "slots", "increment");

      const resolved = selectResolvedDeckById(
        store.getState(),
        "deck-id",
        true,
      );

      expect(resolved?.slots["01000"]).toEqual(0);
    });

    it("sets the quantity of a card", () => {
      const state = store.getState();
      state.updateCardQuantity("deck-id", "01000", 5, 5, "slots", "set");
      expect(
        selectResolvedDeckById(store.getState(), "deck-id", true)?.slots[
          "01000"
        ],
      ).toEqual(5);
    });

    it("does not set the quantity of a card to a negative value", () => {
      const state = store.getState();
      state.updateCardQuantity("deck-id", "01000", -5, 5, "slots", "set");
      state.updateCardQuantity("deck-id", "01000", -5, 5, "slots", "increment");
      expect(
        selectResolvedDeckById(store.getState(), "deck-id", true)?.slots[
          "01000"
        ],
      ).toEqual(0);
    });

    it("does not set the quantity of a card exceeding the limit", () => {
      const state = store.getState();
      state.updateCardQuantity("deck-id", "06021", 5, 3, "slots", "set");
      state.updateCardQuantity("deck-id", "06021", 5, 3, "slots", "increment");
      expect(
        selectResolvedDeckById(store.getState(), "deck-id", true)?.slots[
          "06021"
        ],
      ).toEqual(3);
    });

    it("adjusts cards in side slots", () => {
      const state = store.getState();
      state.updateCardQuantity(
        "deck-id",
        "06021",
        1,
        2,
        "sideSlots",
        "increment",
      );
      expect(
        selectResolvedDeckById(store.getState(), "deck-id", true)?.sideSlots?.[
          "06021"
        ],
      ).toEqual(1);
    });
  });
});
