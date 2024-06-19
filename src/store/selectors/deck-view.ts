import { createSelector } from "reselect";

import type { DisplayDeck } from "../lib/deck-grouping";
import { groupDeckCardsByType } from "../lib/deck-grouping";
import { validateDeck } from "../lib/deck-validation";
import { resolveDeck } from "../lib/resolve-deck";
import type { StoreState } from "../slices";

export const selectResolvedDeckById = createSelector(
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (state: StoreState) => state.data.decks,
  (_: StoreState, id: string) => id,
  (metadata, lookupTables, decks, id) => {
    const deck = decks[id];
    if (!deck) return undefined;

    console.time("[perf] select_resolved_deck");
    const resolvedDeck = resolveDeck(metadata, lookupTables, deck, true);
    console.timeEnd("[perf] select_resolved_deck");

    return resolvedDeck;
  },
);

export const selectActiveDeckById = createSelector(
  (state: StoreState, id: string) => selectResolvedDeckById(state, id),
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (state: StoreState) => state.settings.collection,
  (state: StoreState) => state.settings.showAllCards,
  (resolvedDeck, metadata, lookupTables, collectionSetting, showAllSetting) => {
    if (!resolvedDeck) return undefined;

    const displayDeck = resolvedDeck as DisplayDeck;
    const { groupings, bonded, ownershipCounts } = groupDeckCardsByType(
      resolvedDeck,
      metadata,
      lookupTables,
      collectionSetting,
      showAllSetting,
    );

    displayDeck.ownershipCounts = ownershipCounts;
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

export const selectDeckValidById = createSelector(
  (state: StoreState, id: string) => selectResolvedDeckById(state, id),
  (state: StoreState) => state.lookupTables,
  (state: StoreState) => state.metadata,
  (deck, lookupTables, metadata) => {
    return deck
      ? validateDeck(deck, { lookupTables, metadata } as StoreState)
      : { valid: false, errors: [] };
  },
);
