import type { StateCreator } from "zustand";
import type { StoreState } from ".";
import type { Id } from "./data.types";
import type { RecommenderSlice, RecommenderState } from "./recommender.types";

function toStartOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth());
}

export function deckDateRange(): [Date, Date] {
  const minDate = new Date(2016, 8);
  const maxDate = toStartOfMonth(new Date());
  return [minDate, maxDate];
}

export function deckTickToString(tick: number): string {
  const [min, _] = deckDateRange();
  const date = new Date(min.getFullYear(), min.getMonth() + tick);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
}

export function deckDateTickRange(): [number, number] {
  const [minDate, maxDate] = deckDateRange();
  const monthsBetween =
    (maxDate.getFullYear() - minDate.getFullYear()) * 12 +
    maxDate.getMonth() -
    minDate.getMonth();
  return [0, monthsBetween];
}

function getInitialRecommenderState(): RecommenderState {
  return {
    recommender: {
      includeSideDeck: true,
      isRelative: false,
      deckFilter: deckDateTickRange(),
      coreCards: {},
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
  setRecommenderDeckFilter(value: [number, number]) {
    set({
      recommender: {
        ...get().recommender,
        deckFilter: value,
      },
    });
  },
  addCoreCard(deckId: Id, value: string) {
    const state = get();

    const currentState = state.recommender.coreCards[deckId] ?? [];

    set({
      recommender: {
        ...state.recommender,
        coreCards: {
          ...state.recommender.coreCards,
          [deckId]: [...currentState, value],
        },
      },
    });
  },
  removeCoreCard(deckId: Id, value: string) {
    const state = get();

    const currentState = state.recommender.coreCards[deckId] ?? [];

    set({
      recommender: {
        ...state.recommender,
        coreCards: {
          ...state.recommender.coreCards,
          [deckId]: currentState.filter((v) => v !== value),
        },
      },
    });
  },
});
