import type { StateCreator } from "zustand";

import { capitalize } from "@/utils/formatting";

import { assert } from "@/utils/assert";
import { SPECIAL_CARD_CODES } from "@/utils/constants";
import type { StoreState } from ".";
import { randomBasicWeaknessForDeck } from "../lib/random-basic-weakness";
import { selectCurrentCardQuantity } from "../selectors/decks";
import type { Id } from "./data.types";
import { type DeckEditsSlice, mapTabToSlot } from "./deck-edits.types";

function currentEdits(state: StoreState, deckId: Id) {
  return (
    state.deckEdits[deckId] ?? {
      quantities: {},
      meta: {},
      customizations: {},
    }
  );
}

export const createDeckEditsSlice: StateCreator<
  StoreState,
  [],
  [],
  DeckEditsSlice
> = (set, get) => ({
  deckEdits: {},

  discardEdits(deckId) {
    const state = get();
    const deckEdits = { ...state.deckEdits };
    delete deckEdits[deckId];
    set({ deckEdits });
  },

  updateCardQuantity(deckId, code, quantity, limit, tab, mode = "increment") {
    const state = get();

    const edits = currentEdits(state, deckId);

    const targetTab = tab || "slots";
    const slot = mapTabToSlot(targetTab);

    const current = selectCurrentCardQuantity(state, deckId, code, slot);

    const newValue =
      mode === "increment"
        ? Math.max(current + quantity, 0)
        : Math.max(Math.min(quantity, limit), 0);

    if (mode === "increment" && current + quantity > limit) return;

    set({
      deckEdits: {
        ...state.deckEdits,
        [deckId]: {
          ...edits,
          quantities: {
            ...edits.quantities,
            [slot]: {
              ...edits.quantities[slot],
              [code]: newValue,
            },
          },
        },
      },
    });
  },

  updateTabooId(deckId, value) {
    const state = get();

    set({
      deckEdits: {
        ...state.deckEdits,
        [deckId]: {
          ...currentEdits(state, deckId),
          tabooId: value,
        },
      },
    });
  },
  updateDescription(deckId, value) {
    const state = get();

    set({
      deckEdits: {
        ...state.deckEdits,
        [deckId]: {
          ...currentEdits(state, deckId),
          description_md: value,
        },
      },
    });
  },
  updateName(deckId, value) {
    const state = get();

    set({
      deckEdits: {
        ...state.deckEdits,
        [deckId]: {
          ...currentEdits(state, deckId),
          name: value,
        },
      },
    });
  },
  updateMetaProperty(deckId, key, value) {
    const state = get();
    const edits = currentEdits(state, deckId);

    set({
      deckEdits: {
        ...state.deckEdits,
        [deckId]: {
          ...edits,
          meta: {
            ...edits.meta,
            [key]: value,
          },
        },
      },
    });
  },

  updateInvestigatorSide(deckId, side, code) {
    const state = get();
    const edits = currentEdits(state, deckId);

    set({
      deckEdits: {
        ...state.deckEdits,
        [deckId]: {
          ...edits,
          [`investigator${capitalize(side)}`]: code,
        },
      },
    });
  },

  updateCustomization(deckId, code, index, patch) {
    const state = get();
    const edits = currentEdits(state, deckId);

    set({
      deckEdits: {
        ...state.deckEdits,
        [deckId]: {
          ...edits,
          customizations: {
            ...edits.customizations,
            [code]: {
              ...edits.customizations?.[code],
              [index]: {
                ...edits.customizations?.[code]?.[index],
                ...patch,
              },
            },
          },
        },
      },
    });
  },

  updateTags(deckId, value) {
    const state = get();
    const edits = currentEdits(state, deckId);

    set({
      deckEdits: {
        ...state.deckEdits,
        [deckId]: {
          ...edits,
          tags: value,
        },
      },
    });
  },

  updateXpAdjustment(deckId, value) {
    const state = get();
    const edits = currentEdits(state, deckId);

    set({
      deckEdits: {
        ...state.deckEdits,
        [deckId]: {
          ...edits,
          xpAdjustment: value,
        },
      },
    });
  },

  drawRandomBasicWeakness(deckId) {
    const state = get();

    assert(
      state.data.decks[deckId],
      "Tried to draw a random basic weakness for a deck that does not exist.",
    );

    const weakness = randomBasicWeaknessForDeck(state, deckId);
    assert(weakness, "Could not find a random basic weakness to draw.");

    const rbwQuantity = selectCurrentCardQuantity(
      state,
      deckId,
      SPECIAL_CARD_CODES.RANDOM_BASIC_WEAKNESS,
      "slots",
    );

    const weaknessQuantity = selectCurrentCardQuantity(
      state,
      deckId,
      weakness,
      "slots",
    );

    set({
      deckEdits: {
        ...state.deckEdits,
        [deckId]: {
          ...currentEdits(state, deckId),
          quantities: {
            ...currentEdits(state, deckId).quantities,
            slots: {
              ...currentEdits(state, deckId).quantities.slots,
              [SPECIAL_CARD_CODES.RANDOM_BASIC_WEAKNESS]: Math.max(
                rbwQuantity - 1,
                0,
              ),
              [weakness]: weaknessQuantity + 1,
            },
          },
        },
      },
    });
  },
});
