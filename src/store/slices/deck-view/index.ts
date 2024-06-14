import type { StateCreator } from "zustand";

import type { StoreState } from "..";
import type { DeckViewSlice, Slot, Tab } from "./types";

export function getInitialDeckViewState() {
  return undefined;
}

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
        id: activeDeckId,
        edits: {},
        mode,
      },
    });
  },

  changeCardQuantity(code, quantity, tab) {
    const state = get();

    if (!state.deckView) {
      console.warn(`try edit deck, but state does not have an active deck.`);
      return;
    }

    if (state.deckView.mode !== "edit") {
      console.warn(`try edit deck, but not in edit mode.`);
      return;
    }

    const targetTab = tab || state.deckView.activeTab || "slots";

    const slot = getSlotForTab(targetTab);

    const current = state.deckView.edits?.[slot] ?? [];

    set({
      deckView: {
        ...state.deckView,
        edits: {
          ...state.deckView.edits,
          [slot]: [...current, { code, quantity }],
        },
      },
    });
  },

  updateActiveTab(value) {
    const state = get();

    if (state.deckView && state.deckView.mode === "edit") {
      set({
        deckView: {
          ...state.deckView,
          activeTab: value as Tab, // TODO: typeguard
        },
      });
    }
  },
});

export function getSlotForTab(tab: Tab): Slot {
  switch (tab) {
    case "extraSlots":
      return "extraSlots";
    case "sideSlots":
      return "sideSlots";
    default:
      return "slots";
  }
}
