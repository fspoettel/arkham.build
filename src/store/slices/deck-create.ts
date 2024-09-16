import type { StateCreator } from "zustand";

import { assert } from "@/utils/assert";

import { getCanonicalCardCode } from "@/utils/card-utils";
import type { StoreState } from ".";
import { getDefaultDeckName } from "../lib/deck-factory";
import type { CardSet, DeckCreateSlice } from "./deck-create.types";

export const createDeckCreateSlice: StateCreator<
  StoreState,
  [],
  [],
  DeckCreateSlice
> = (set, get) => ({
  deckCreate: undefined,

  initCreate(code: string, initialInvestigatorChoice?: string) {
    const state = get();

    const investigator = state.metadata.cards[code];

    assert(
      investigator && investigator.type_code === "investigator",
      "Deck configure must be initialized with an investigator card.",
    );

    const canonicalCode = getCanonicalCardCode(investigator);

    const choice = initialInvestigatorChoice
      ? state.metadata.cards[initialInvestigatorChoice]
      : undefined;

    if (initialInvestigatorChoice) {
      assert(
        choice && choice.type_code === "investigator",
        "Deck configure must be initialized with an investigator card.",
      );

      assert(
        choice.real_name === investigator.real_name,
        "Parallel investigator must have the same real name as the investigator.",
      );
    }

    set({
      deckCreate: {
        extraCardQuantities: {},
        investigatorBackCode: choice ? choice.code : canonicalCode,
        investigatorCode: canonicalCode,
        investigatorFrontCode: choice ? choice.code : canonicalCode,
        selections: {},
        sets: ["requiredCards"],
        tabooSetId: state.settings.tabooSetId ?? undefined,
        title: getDefaultDeckName(
          investigator.real_name,
          investigator.faction_code,
        ),
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

  deckCreateChangeExtraCardQuantity(card, quantity) {
    const state = get();
    assert(state.deckCreate, "DeckCreate slice must be initialized.");

    const currentQuantity =
      state.deckCreate.extraCardQuantities[card.code] ?? card.quantity;

    set({
      deckCreate: {
        ...state.deckCreate,
        extraCardQuantities: {
          ...state.deckCreate.extraCardQuantities,
          [card.code]: currentQuantity + quantity,
        },
      },
    });
  },
  deckCreateSetCardPool(value) {
    const state = get();
    assert(state.deckCreate, "DeckCreate slice must be initialized.");

    set({
      deckCreate: {
        ...state.deckCreate,
        cardPool: value,
      },
    });
  },
  deckCreateSetSealed(sealed) {
    const state = get();
    assert(state.deckCreate, "DeckCreate slice must be initialized.");
    set({
      deckCreate: {
        ...state.deckCreate,
        sealed,
      },
    });
  },
});

function isCardSet(value: string): value is CardSet {
  return (
    value === "requiredCards" || value === "advanced" || value === "replacement"
  );
}
