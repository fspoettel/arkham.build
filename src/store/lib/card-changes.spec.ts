import { beforeAll, describe, expect, it } from "vitest";
import type { StoreApi } from "zustand";

import { getMockStore } from "@/test/get-mock-store";

import type { StoreState } from "../slices";
import { applyCardChanges } from "./card-changes";

describe("applyCardChanges", () => {
  let store: StoreApi<StoreState>;

  beforeAll(async () => {
    store = await getMockStore();
  });

  describe("taboo", () => {
    it("should return the original card if tabooSetId is nul-ish", () => {
      const state = store.getState();
      const card = state.metadata.cards["02002"];
      const result = applyCardChanges(card, state.metadata, null, undefined);
      expect(result).toEqual(card);
    });

    it("should return the original card if tabooSetId is 0", () => {
      const state = store.getState();
      const card = state.metadata.cards["02002"];
      const result = applyCardChanges(card, state.metadata, 0, undefined);
      expect(result).toEqual(card);
    });

    it("should return the original card if tabooSetId was not found", () => {
      const state = store.getState();
      const card = state.metadata.cards["02002"];
      const result = applyCardChanges(card, state.metadata, 8, undefined);
      expect(result).toEqual(card);
    });

    it("should return a tabood card if tabooSetId is present", () => {
      const state = store.getState();
      const card = state.metadata.cards["02002"];
      const result = applyCardChanges(card, state.metadata, 1, undefined);
      expect(result.real_taboo_text_change).toBeDefined();
    });

    it("should apply taboos for the latest taboo set", () => {
      const state = store.getState();
      const card = state.metadata.cards["02002"];
      const result = applyCardChanges(card, state.metadata, 6, undefined);
      expect(result.real_text).not.toEqual(card.real_text);
    });
  });
});
