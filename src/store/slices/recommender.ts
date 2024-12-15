import type { StateCreator } from "zustand";
import type { StoreState } from ".";
import type { RecommenderSlice, RecommenderState } from "./recommender.types";

function getInitialRecommenderState(): RecommenderState {
  return {
    recommender: {
      includeSideDeck: true,
      isRelative: false,
    },
  };
}

export const createRecommenderSlice: StateCreator<
  StoreState,
  [],
  [],
  RecommenderSlice
> = (set, get) => ({
  ...getInitialRecommenderState(),
  setIncludeSideDeck(value: boolean) {
    set({
      recommender: {
        ...get().recommender,
        includeSideDeck: value,
      },
    });
  },
  setIsRelative(value: boolean) {
    set({
      recommender: {
        ...get().recommender,
        isRelative: value,
      },
    });
  },
});
