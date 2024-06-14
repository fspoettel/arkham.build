import { createSelector } from "reselect";

import type { DisplayDeck } from "@/store/lib/deck-grouping";
import { groupDeckCardsByType } from "@/store/lib/deck-grouping";
import { resolveDeck } from "@/store/lib/deck-resolver";

import type { ResolvedCard, ResolvedDeck } from "../lib/types";
import type { StoreState } from "../slices";

export const selectLocalDecks = createSelector(
  (state: StoreState) => state.decks,
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (decks, metadata, lookupTables) => {
    console.time("[performance] select_local_decks");

    const resolvedDecks: ResolvedDeck<ResolvedCard>[] = Object.values(
      decks.local,
    ).map((deck) => resolveDeck(metadata, lookupTables, deck, false));

    resolvedDecks.sort((a, b) => b.date_update.localeCompare(a.date_update));
    console.timeEnd("[performance] select_local_decks");

    return resolvedDecks;
  },
);

export const selectActiveDeck = createSelector(
  (state: StoreState) => state.decks,
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (state: StoreState) => state.ui.activeDeckId,
  (decks, metadata, lookupTables, id) => {
    if (!id) return undefined;
    console.time("[performance] select_active_deck");

    const deck = decks.local[id];
    if (!deck) return undefined;

    const resolvedDeck = resolveDeck(metadata, lookupTables, deck, true);

    const displayDeck = resolvedDeck as DisplayDeck;
    displayDeck.groups = groupDeckCardsByType(resolvedDeck);

    console.timeEnd("[performance] select_active_deck");
    return displayDeck;
  },
);
