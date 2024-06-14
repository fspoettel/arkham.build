import type { StateCreator } from "zustand";

import { assert } from "@/utils/assert";
import { getDefaultDeckName } from "@/utils/deck-names";

import type { StoreState } from ".";
import type { CardSet, DeckCreateSlice } from "./deck-create.types";

export const createdeckCreateSlice: StateCreator<
  StoreState,
  [],
  [],
  DeckCreateSlice
> = (set, get) => ({
  deckCreate: undefined,

  initCreate(code: string) {
    const state = get();

    const card = state.metadata.cards[code];
    assert(
      card && card.type_code === "investigator",
      "Deck configure must be initialized with an investigator card.",
    );

    set({
      deckCreate: {
        extraCardQuantities: {},
        investigatorBackCode: code,
        investigatorCode: code,
        investigatorFrontCode: code,
        selections: {},
        sets: ["requiredCards"],
        tabooSetId: state.settings.tabooSetId ?? undefined,
        title: getDefaultDeckName(card.real_name, card.faction_code),
      },
    });
  },

  resetCreate() {
    set({
      deckCreate: undefined,
    });
  },

  deckCreateSetTitle(value: string) {
    const state = get();
    assert(state.deckCreate, "DeckCreate slice must be initialized.");

    set({
      deckCreate: {
        ...state.deckCreate,
        title: value,
      },
    });
  },

  deckCreateSetTabooSet(value: number | undefined) {
    const state = get();
    assert(state.deckCreate, "DeckCreate slice must be initialized.");

    set({
      deckCreate: {
        ...state.deckCreate,
        tabooSetId: value,
      },
    });
  },

  deckCreateSetInvestigatorCode(side: "front" | "back", value: string) {
    const state = get();
    assert(state.deckCreate, "DeckCreate slice must be initialized.");

    const path =
      side === "front" ? "investigatorFrontCode" : "investigatorBackCode";

    set({
      deckCreate: {
        ...state.deckCreate,
        [path]: value,
      },
    });
  },

  deckCreateSetSelection(key, value) {
    const state = get();
    assert(state.deckCreate, "DeckCreate slice must be initialized.");

    set({
      deckCreate: {
        ...state.deckCreate,
        selections: {
          ...state.deckCreate.selections,
          [key]: value,
        },
      },
    });
  },

  deckCreateToggleCardSet(value) {
    const state = get();
    assert(state.deckCreate, "DeckCreate slice must be initialized.");
    assert(isCardSet(value), "Invalid card set value.");

    const sets = state.deckCreate.sets.includes(value)
      ? state.deckCreate.sets.filter((set) => set !== value)
      : [...state.deckCreate.sets, value];

    set({
      deckCreate: {
        ...state.deckCreate,
        sets,
      },
    });
  },

  deckCreateChangeExtraCardQuantity(code, quantity) {
    const state = get();
    assert(state.deckCreate, "DeckCreate slice must be initialized.");

    const card = state.metadata.cards[code];
    const currentQuantity =
      state.deckCreate.extraCardQuantities[code] ?? card.quantity;

    set({
      deckCreate: {
        ...state.deckCreate,
        extraCardQuantities: {
          ...state.deckCreate.extraCardQuantities,
          [code]: currentQuantity + quantity,
        },
      },
    });
  },
});

export function isCardSet(value: string): value is CardSet {
  return (
    value === "requiredCards" || value === "advanced" || value === "replacement"
  );
}
