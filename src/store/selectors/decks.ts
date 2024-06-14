import { createSelector } from "reselect";

import type { DisplayDeck } from "@/store/lib/deck-grouping";
import { groupDeckCardsByType } from "@/store/lib/deck-grouping";
import { resolveDeck } from "@/store/lib/deck-resolver";

import type { ForbiddenCardError } from "../lib/deck-validation";
import { validateDeck } from "../lib/deck-validation";
import type { ResolvedCard, ResolvedDeck } from "../lib/types";
import type { StoreState } from "../slices";

export const selectLocalDecks = createSelector(
  (state: StoreState) => state.decks,
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (decks, metadata, lookupTables) => {
    console.time("[perf] select_local_decks");

    const resolvedDecks: ResolvedDeck<ResolvedCard>[] = Object.values(
      decks.local,
    ).map((deck) => resolveDeck(metadata, lookupTables, deck, false));

    resolvedDecks.sort((a, b) => b.date_update.localeCompare(a.date_update));
    console.timeEnd("[perf] select_local_decks");

    return resolvedDecks;
  },
);

const selectResolvedDeck = createSelector(
  (state: StoreState) => state.decks,
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (state: StoreState) => state.ui.activeDeckId,
  (decks, metadata, lookupTables, id) => {
    if (!id) return undefined;

    console.time("[perf] select_resolved_deck");
    const deck = decks.local[id];
    if (!deck) return undefined;

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
    displayDeck.groups = groupDeckCardsByType(resolvedDeck);
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
