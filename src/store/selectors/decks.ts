import { createSelector } from "reselect";

import type { DisplayDeck } from "@/store/lib/deck-grouping";
import { groupDeckCardsByType } from "@/store/lib/deck-grouping";
import { resolveDeck } from "@/store/lib/resolve-deck";

import { applyDeckEdits } from "../lib/deck-edits";
import type { ForbiddenCardError } from "../lib/deck-validation";
import { validateDeck } from "../lib/deck-validation";
import type { ResolvedCard, ResolvedDeck } from "../lib/types";
import type { StoreState } from "../slices";
import { type Slot, mapTabToSlot } from "../slices/deck-view.types";

export const selectLocalDecks = createSelector(
  (state: StoreState) => state.data,
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (data, metadata, lookupTables) => {
    console.time("[perf] select_local_decks");

    const { upgrades } = data;

    const resolvedDecks = Object.keys(upgrades).reduce<
      ResolvedDeck<ResolvedCard>[]
    >((acc, id) => {
      const deck = data.decks[id];
      if (deck) {
        acc.push(resolveDeck(metadata, lookupTables, deck, false));
      } else {
        console.warn(`Could not find deck ${id} in local storage.`);
      }

      return acc;
    }, []);

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
    if (!deckView || !decks[deckView.id]) return undefined;

    console.time("[perf] select_resolved_deck");

    const deck = applyDeckEdits(decks[deckView.id], deckView, metadata);
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

export const selectCanEditDeck = (state: StoreState) =>
  state.deckView?.mode === "edit";

export const selectForbiddenCards = createSelector(
  selectDeckValid,
  (deckValidation) => {
    const forbidden = deckValidation.errors.find((x) => x.type === "FORBIDDEN");
    if (!forbidden) return [];
    return (forbidden as ForbiddenCardError).details;
  },
);

export function selectCardQuantitiesForSlot(state: StoreState, slot: Slot) {
  if (!state.deckView) return undefined;

  const activeDeck = selectActiveDeck(state);
  if (!activeDeck) return undefined;

  return activeDeck[slot];
}

export function selectCardQuantities(state: StoreState) {
  if (!state.deckView) return undefined;

  const slot =
    state.deckView.mode === "view"
      ? "slots"
      : mapTabToSlot(state.deckView.activeTab);

  return selectCardQuantitiesForSlot(state, slot);
}

export const selectCurrentTab = (state: StoreState) => {
  if (!state.deckView || state.deckView.mode === "view") return "slots";
  return state.deckView.activeTab;
};
