import type { StateCreator } from "zustand";

import { capitalize } from "@/utils/formatting";

import type { StoreState } from ".";
import { resolveDeck } from "../lib/resolve-deck";
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

  updateCardQuantity(deckId, code, quantity, tab, mode = "increment") {
    const state = get();

    const edits = currentEdits(state, deckId);

    const targetTab = tab || "slots";
    const slot = mapTabToSlot(targetTab);

    const card = state.metadata.cards[code];
    const limit = card.deck_limit ?? card.quantity;

    const slotEdits = edits.quantities[slot];

    const deck = resolveDeck(
      state.metadata,
      state.lookupTables,
      state.data.decks[deckId],
      false,
    );
    const slots = deck[slot] ?? {};

    const value = slotEdits?.[code] ?? slots?.[code] ?? 0;

    const newValue =
      mode === "increment"
        ? Math.max(value + quantity, 0)
        : Math.max(Math.min(quantity, limit), 0);

    if (mode === "increment" && value + quantity > limit) return;

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
});
