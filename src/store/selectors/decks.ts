import type { StoreState } from "../slices";
import { type CardResolved } from "../utils/card-resolver";
import type { DisplayDeck } from "../utils/deck-grouping";
import { groupDeckCardsByType } from "../utils/deck-grouping";
import type { ResolvedDeck } from "../utils/deck-resolver";
import { resolveDeck } from "../utils/deck-resolver";

export function selectLocalDecks(state: StoreState) {
  console.time("[performance] select_local_decks");

  const decks: ResolvedDeck<CardResolved>[] = Object.values(
    state.decks.local,
  ).map((deck) => resolveDeck(state, deck, false));

  decks.sort((a, b) => b.date_update.localeCompare(a.date_update));
  console.timeEnd("[performance] select_local_decks");

  return decks;
}

export function selectLocalDeck(
  state: StoreState,
  id: string | undefined,
): DisplayDeck | undefined {
  console.time("[performance] select_local_deck");
  if (!id) return undefined;

  const deck = state.decks.local[id];
  if (!deck) return undefined;

  const resolvedDeck = resolveDeck(state, deck, true);

  const displayDeck = resolvedDeck as DisplayDeck;
  displayDeck.groups = groupDeckCardsByType(resolvedDeck);

  console.timeEnd("[performance] select_local_deck");
  return displayDeck;
}
