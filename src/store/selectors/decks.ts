import { createSelector } from "reselect";

import { resolveDeck } from "@/store/lib/resolve-deck";

import type { DeckValidationResult } from "../lib/deck-validation";
import { validateDeck } from "../lib/deck-validation";
import { sortAlphabetical } from "../lib/sorting";
import type { ResolvedCard, ResolvedDeck } from "../lib/types";
import type { StoreState } from "../slices";

type LocalDeck = {
  deck: ResolvedDeck<ResolvedCard>;
  validation: DeckValidationResult;
};

export const selectLocalDecks = createSelector(
  (state: StoreState) => state.data,
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (data, metadata, lookupTables) => {
    console.time("[perf] select_local_decks");

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

    console.timeEnd("[perf] select_local_decks");
    return resolvedDecks;
  },
);
