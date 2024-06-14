import { StateCreator } from "zustand";
import { StoreState } from "..";
import { IndexesSlice } from "./types";
import { addCardToIndexes } from "./utils";

export const createIndexesSlice: StateCreator<
  StoreState,
  [],
  [],
  IndexesSlice
> = (set) => ({
  indexes: {
    byAction: {},
    byCost: {},
    byEncounterCode: {},
    byFactionCode: {},
    byHealth: {},
    byIcons: {},
    byPackCode: {},
    bySlot: {},
    bySubtypeCode: {},
    byProperties: {},
    bySanity: {},
    bySkillBoost: {},
    byTrait: {},
    byTypeCode: {},
    byUses: {},
    byXp: {},
  },
  createIndexes(cards) {
    const indexes = {};

    cards.forEach((card) => {
      addCardToIndexes(indexes, card);
    });

    set({ indexes });
  },
});
