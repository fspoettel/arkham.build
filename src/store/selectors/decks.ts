import { createSelector } from "reselect";

import type { StoreState } from "../slices";
import { type CardResolved } from "../utils/card-resolver";
import type { DisplayDeck } from "../utils/deck-grouping";
import { groupDeckCardsByType } from "../utils/deck-grouping";
import type { ResolvedDeck } from "../utils/deck-resolver";
import { resolveDeck } from "../utils/deck-resolver";

export const selectLocalDecks = createSelector(
  (state: StoreState) => state.decks,
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (decks, metadata, lookupTables) => {
    console.time("[performance] select_local_decks");

    const resolvedDecks: ResolvedDeck<CardResolved>[] = Object.values(
      decks.local,
    ).map((deck) => resolveDeck(metadata, lookupTables, deck, false));

    resolvedDecks.sort((a, b) => b.date_update.localeCompare(a.date_update));
    console.timeEnd("[performance] select_local_decks");

    return resolvedDecks;
  },
);

export function selectLocalDeck(
  state: StoreState,
  id: string | undefined,
): DisplayDeck | undefined {
  console.time("[performance] select_local_deck");
  if (!id) return undefined;

  const deck = state.decks.local[id];
  if (!deck) return undefined;

  const resolvedDeck = resolveDeck(
    state.metadata,
    state.lookupTables,
    deck,
    true,
  );

  const displayDeck = resolvedDeck as DisplayDeck;
  displayDeck.groups = groupDeckCardsByType(resolvedDeck);

  console.timeEnd("[performance] select_local_deck");
  return displayDeck;
}
