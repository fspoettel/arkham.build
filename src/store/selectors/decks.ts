import { createSelector } from "reselect";

import { resolveDeck } from "@/store/lib/resolve-deck";

import { time, timeEnd } from "@/utils/time";
import type { DeckValidationResult } from "../lib/deck-validation";
import { validateDeck } from "../lib/deck-validation";
import { sortAlphabetical } from "../lib/sorting";
import type { ResolvedCard, ResolvedDeck } from "../lib/types";
import type { StoreState } from "../slices";
import type { Id } from "../slices/data.types";
import type { EditState } from "../slices/deck-edits.types";
import { selectActiveDeckById } from "./deck-view";

type LocalDeck = {
  deck: ResolvedDeck<ResolvedCard>;
  validation: DeckValidationResult;
};

export const selectLocalDecks = createSelector(
  (state: StoreState) => state.data,
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (data, metadata, lookupTables) => {
    time("select_local_decks");

    const { history } = data;

    const resolvedDecks = Object.keys(history).reduce<LocalDeck[]>(
      (acc, id) => {
        const deck = data.decks[id];

        try {
          if (deck) {
            const resolved = resolveDeck(metadata, lookupTables, deck, false);
            const validation = validateDeck(resolved, {
              metadata,
              lookupTables,
            } as StoreState);
            acc.push({ deck: resolved, validation });
          } else {
            console.warn(`Could not find deck ${id} in local storage.`);
          }
        } catch (err) {
          console.error(`Error resolving deck ${id}: ${err}`);
          return acc;
        }

        return acc;
      },
      [],
    );

    resolvedDecks.sort((a, b) =>
      sortAlphabetical(b.deck.date_update, a.deck.date_update),
    );

    timeEnd("select_local_decks");
    return resolvedDecks;
  },
);

export function selectCurrentCardQuantity(
  state: StoreState,
  deckId: Id,
  code: string,
  key: keyof EditState["quantities"],
) {
  const deck = selectActiveDeckById(state, deckId, true);
  return deck?.[key]?.[code] ?? 0;
}

export function selectCurrentInvestigatorFactionCode(
  state: StoreState,
  deckId: Id,
) {
  const deck = selectActiveDeckById(state, deckId, true);
  return deck?.cards.investigator.card.faction_code;
}
