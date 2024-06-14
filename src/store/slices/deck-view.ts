import type { StateCreator } from "zustand";

import type { StoreState } from ".";
import { type DeckViewSlice, isTab, mapTabToSlot } from "./deck-view.types";

export const createDeckViewSlice: StateCreator<
  StoreState,
  [],
  [],
  DeckViewSlice
> = (set, get) => ({
  deckView: null,

  changeCardQuantity(code, quantity, tab, mode = "increment") {
    const state = get();

    if (!state.deckView) {
      console.warn(
        `trying to edit deck, but state does not have an active deck.`,
      );
      return;
    }

    if (state.deckView.mode !== "edit") {
      console.warn(`trying to edit deck, but not in edit mode.`);
      return;
    }

    const targetTab = tab || state.deckView.activeTab || "slots";

    const slot = mapTabToSlot(targetTab);

    const card = state.metadata.cards[code];
    const limit = card.deck_limit ?? card.quantity;

    const slotEdits = state.deckView.edits.quantities?.[slot];
    const slots = state.data.decks[state.deckView.id]?.slots ?? {};

    const value = slotEdits?.[code] ?? slots?.[code] ?? 0;

    const newValue =
      mode === "increment"
        ? Math.max(value + quantity, 0)
        : Math.min(quantity, limit);

    if (mode === "increment" && value + quantity > limit) return;

    set({
      deckView: {
        ...state.deckView,
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

    if (state.deckView && state.deckView.mode === "edit" && isTab(value)) {
      set({
        deckView: {
          ...state.deckView,
          activeTab: value,
        },
      });
    }
  },

  updateTabooId(value) {
    const state = get();

    if (state.deckView && state.deckView.mode === "edit") {
      set({
        deckView: {
          ...state.deckView,
          edits: {
            ...state.deckView.edits,
            tabooId: value,
          },
        },
      });
    }
  },
  updateDescription(value) {
    const state = get();

    if (state.deckView && state.deckView.mode === "edit") {
      set({
        deckView: {
          ...state.deckView,
          edits: {
            ...state.deckView.edits,
            description_md: value,
          },
        },
      });
    }
  },
  updateName(value) {
    const state = get();

    if (state.deckView && state.deckView.mode === "edit") {
      set({
        deckView: {
          ...state.deckView,
          edits: {
            ...state.deckView.edits,
            name: value,
          },
        },
      });
    }
  },
  updateMetaProperty(key, value) {
    const state = get();

    if (state.deckView && state.deckView.mode === "edit") {
      set({
        deckView: {
          ...state.deckView,
          edits: {
            ...state.deckView.edits,
            meta: {
              ...state.deckView.edits.meta,
              [key]: value,
            },
          },
        },
      });
    }
  },

  updateInvestigatorSide(side, code) {
    const state = get();
    if (state.deckView && state.deckView.mode === "edit") {
      set({
        deckView: {
          ...state.deckView,
          edits: {
            ...state.deckView.edits,
            investigatorBack:
              side === "back" ? code : state.deckView.edits.investigatorBack,
            investigatorFront:
              side === "front" ? code : state.deckView.edits.investigatorFront,
          },
        },
      });
    }
  },

  updateCustomization(code, index, edit) {
    const state = get();
    if (state.deckView && state.deckView.mode === "edit") {
      set({
        deckView: {
          ...state.deckView,
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
    }
  },

  updateTags(value) {
    const state = get();
    if (state.deckView && state.deckView.mode === "edit") {
      set({
        deckView: {
          ...state.deckView,
          edits: {
            ...state.deckView.edits,
            tags: value,
          },
        },
      });
    }
  },

  updateShowUnusableCards(showUnusableCards) {
    const state = get();

    if (state.deckView?.mode !== "edit") return;

    set({
      deckView: {
        ...state.deckView,
        showUnusableCards,
      },
    });
  },
});
