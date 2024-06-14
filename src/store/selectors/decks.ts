import { createSelector } from "reselect";

import type { DisplayDeck } from "@/store/lib/deck-grouping";
import { groupDeckCardsByType } from "@/store/lib/deck-grouping";
import { resolveDeck } from "@/store/lib/deck-resolver";

import type { ForbiddenCardError } from "../lib/deck-validation";
import { validateDeck } from "../lib/deck-validation";
import type { ResolvedCard, ResolvedDeck } from "../lib/types";
import type { StoreState } from "../slices";
import { getSlotForTab } from "../slices/deck-view";

export const selectLocalDecks = createSelector(
  (state: StoreState) => state.data,
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (data, metadata, lookupTables) => {
    console.time("[perf] select_local_decks");

    const resolvedDecks: ResolvedDeck<ResolvedCard>[] = Object.values(
      data.decks,
    ).map((deck) => resolveDeck(metadata, lookupTables, deck, false));

    resolvedDecks.sort((a, b) => b.date_update.localeCompare(a.date_update));
    console.timeEnd("[perf] select_local_decks");

    return resolvedDecks;
  },
);

export const selectResolvedDeck = createSelector(
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (state: StoreState) => state.data.decks,
  (state: StoreState) => state.deckView,
  (metadata, lookupTables, decks, deckView) => {
    if (!deckView) return undefined;

    console.time("[perf] select_resolved_deck");
    const deck = decks[deckView.id]
      ? structuredClone(decks[deckView.id])
      : undefined;
    if (!deck) return undefined;

    // adjust quantities based on deck edits.
    if (deckView.mode === "edit") {
      for (const [key, edits] of Object.entries(deckView.edits)) {
        for (const edit of edits) {
          const slotKey = key as "slots";

          deck[slotKey] ??= {};

          const current = deck[slotKey]?.[edit.code];

          (deck[slotKey] as Record<string, number>)[edit.code] = Math.max(
            (current ?? 0) + edit.quantity,
            0,
          );
        }
      }

      for (const [key, val] of Object.entries(deck.slots)) {
        if (!val) delete deck.slots[key];
      }

      if (deck.sideSlots && !Array.isArray(deck.sideSlots)) {
        for (const [key, val] of Object.entries(deck.sideSlots)) {
          if (!val) delete deck.sideSlots[key];
        }
      }
    }

    const resolvedDeck = resolveDeck(metadata, lookupTables, deck, true);
    console.timeEnd("[perf] select_resolved_deck");
    return resolvedDeck;
  },
);

export const selectActiveDeck = createSelector(
  selectResolvedDeck,
  (resolvedDeck) => {
    if (!resolvedDeck) return undefined;
    const displayDeck = resolvedDeck as DisplayDeck;
    const { groupings, bonded } = groupDeckCardsByType(resolvedDeck);
    displayDeck.groups = groupings;
    displayDeck.bondedSlots = bonded.reduce<Record<string, number>>(
      (acc, curr) => {
        acc[curr.code] = curr.quantity;
        return acc;
      },
      {},
    );
    return displayDeck;
  },
);

export const selectDeckValid = createSelector(
  selectResolvedDeck,
  (state: StoreState) => state.lookupTables,
  (state: StoreState) => state.metadata,
  (deck, lookupTables, metadata) =>
    deck
      ? validateDeck(deck, { lookupTables, metadata } as StoreState)
      : { valid: false, errors: [] },
);

export const selectForbiddenCards = createSelector(
  selectDeckValid,
  (deckValidation) => {
    const forbidden = deckValidation.errors.find((x) => x.type === "FORBIDDEN");
    if (!forbidden) return [];
    return (forbidden as ForbiddenCardError).details.map((x) => x.code);
  },
);

export function selectCardQuantities(state: StoreState) {
  if (!state.deckView) return undefined;

  const activeDeck = selectActiveDeck(state);
  if (!activeDeck) return undefined;

  const slot =
    state.deckView.mode === "view"
      ? "slots"
      : getSlotForTab(state.deckView.activeTab);

  return activeDeck[slot];
}

export const selectCurrentTab = (state: StoreState) => {
  if (!state.deckView || state.deckView.mode === "view") return "slots";
  return state.deckView.activeTab;
};
