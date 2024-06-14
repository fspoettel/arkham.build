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

  changeCardQuantity(code, quantity, tab) {
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

    const current = state.deckView.edits.quantities?.[slot] ?? [];

    set({
      deckView: {
        ...state.deckView,
        edits: {
          ...state.deckView.edits,
          quantities: {
            ...state.deckView.edits.quantities,
            [slot]: [...current, { code, quantity }],
          },
        },
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
