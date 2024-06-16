import type { StateCreator } from "zustand";

import { assert } from "@/utils/assert";

import type { StoreState } from ".";
import { resolveDeck } from "../lib/resolve-deck";
import type { EditState } from "./deck-view.types";
import { type DeckViewSlice, isTab, mapTabToSlot } from "./deck-view.types";

export const createDeckViewSlice: StateCreator<
  StoreState,
  [],
  [],
  DeckViewSlice
> = (set, get) => ({
  deckView: null,

  setActiveDeck(activeDeckId, mode) {
    if (!activeDeckId || !mode) {
      set({ deckView: null });
      return;
    }

    if (mode === "view") {
      set({
        deckView: {
          id: activeDeckId,
          mode,
        },
      });
      return;
    }

    set({
      deckView: {
        activeTab: "slots",
        showUnusableCards: false,
        id: activeDeckId,
        dirty: false,
        edits: {
          meta: {},
          quantities: {},
          customizations: {},
        },
        mode,
      },
    });
  },

  updateActiveTab(value) {
    const state = get();

    assertInEditMode(state);
    assert(isTab(value), `invalid tab value: ${value}`);

    set({
      deckView: {
        ...state.deckView,
        activeTab: value,
      },
    });
  },

  updateCardQuantity(code, quantity, tab, mode = "increment") {
    const state = get();
    assertInEditMode(state);

    const targetTab = tab || state.deckView.activeTab || "slots";

    const slot = mapTabToSlot(targetTab);

    const card = state.metadata.cards[code];
    const limit = card.deck_limit ?? card.quantity;

    const slotEdits = state.deckView.edits.quantities[slot];

    const deck = resolveDeck(
      state.metadata,
      state.lookupTables,
      state.data.decks[state.deckView.id],
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
      deckView: {
        ...state.deckView,
        dirty: true,
        edits: {
          ...state.deckView.edits,
          quantities: {
            ...state.deckView.edits.quantities,
            [slot]: {
              ...state.deckView.edits.quantities[slot],
              [code]: newValue,
            },
          },
        },
      },
    });
  },

  updateTabooId(value) {
    const state = get();
    assertInEditMode(state);

    set({
      deckView: {
        ...state.deckView,
        dirty: true,
        edits: {
          ...state.deckView.edits,
          tabooId: value,
        },
      },
    });
  },
  updateDescription(value) {
    const state = get();
    assertInEditMode(state);

    set({
      deckView: {
        ...state.deckView,
        dirty: true,
        edits: {
          ...state.deckView.edits,
          description_md: value,
        },
      },
    });
  },
  updateName(value) {
    const state = get();
    assertInEditMode(state);

    set({
      deckView: {
        ...state.deckView,
        dirty: true,
        edits: {
          ...state.deckView.edits,
          name: value,
        },
      },
    });
  },
  updateMetaProperty(key, value) {
    const state = get();
    assertInEditMode(state);

    set({
      deckView: {
        ...state.deckView,
        dirty: true,
        edits: {
          ...state.deckView.edits,
          meta: {
            ...state.deckView.edits.meta,
            [key]: value,
          },
        },
      },
    });
  },

  updateInvestigatorSide(side, code) {
    const state = get();
    assertInEditMode(state);

    set({
      deckView: {
        ...state.deckView,
        dirty: true,
        edits: {
          ...state.deckView.edits,
          investigatorBack:
            side === "back" ? code : state.deckView.edits.investigatorBack,
          investigatorFront:
            side === "front" ? code : state.deckView.edits.investigatorFront,
        },
      },
    });
  },

  updateCustomization(code, index, edit) {
    const state = get();
    assertInEditMode(state);

    set({
      deckView: {
        ...state.deckView,
        dirty: true,
        edits: {
          ...state.deckView.edits,
          customizations: {
            ...state.deckView.edits.customizations,
            [code]: {
              ...state.deckView.edits.customizations[code],
              [index]: {
                ...state.deckView.edits.customizations[code]?.[index],
                ...edit,
              },
            },
          },
        },
      },
    });
  },

  updateTags(value) {
    const state = get();
    assertInEditMode(state);
    set({
      deckView: {
        ...state.deckView,
        dirty: true,
        edits: {
          ...state.deckView.edits,
          tags: value,
        },
      },
    });
  },

  updateShowUnusableCards(showUnusableCards) {
    const state = get();
    assertInEditMode(state);

    set({
      deckView: {
        ...state.deckView,
        showUnusableCards,
      },
    });
  },
});

function assertInEditMode(state: StoreState): asserts state is StoreState & {
  deckView: EditState;
} {
  assert(
    state.deckView,
    "trying to edit deck, but state does not have an active deck.",
  );

  assert(
    state.deckView.mode === "edit",
    "trying to edit deck, but not in edit mode.",
  );

  assert(
    state.data.decks[state.deckView.id],
    `trying to edit deck, but deck does not exist.`,
  );
}
