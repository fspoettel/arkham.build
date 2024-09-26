import { createSelector } from "reselect";

import { assert } from "@/utils/assert";
import { FACTION_ORDER } from "@/utils/constants";
import { and, or } from "@/utils/fp";
import uFuzzy from "@leeoniya/ufuzzy";
import type { ResolvedDeck } from "../lib/types";
import type { StoreState } from "../slices";
import type { MultiselectFilter } from "../slices/lists.types";
import { selectLocalDecks } from "./decks";

// Arbitrarily chosen for now
const MATCHING_MAX_TOKEN_DISTANCE_DECKS = 4;

const filterDeckByFaction = (faction: string) => {
  return (deck: ResolvedDeck) => {
    return deck.cards.investigator.card.faction_code === faction;
  };
};

const makeDeckFactionFilter = (values: MultiselectFilter) => {
  return or(values.map((value) => filterDeckByFaction(value)));
};

export const selectDeckFilters = (state: StoreState) =>
  state.deckFilters.filters;
export const selectDeckSearchTerm = (state: StoreState) =>
  state.deckFilters.filters.search;
export const selectDeckFactionFilter = (state: StoreState) =>
  state.deckFilters.filters.faction;

const selectFilteringFunc = createSelector(selectDeckFilters, (filters) => {
  const filterFuncs = [];

  for (const filter of Object.keys(filters)) {
    switch (filter) {
      case "faction":
        filterFuncs.push(makeDeckFactionFilter(filters[filter]));
    }
  }

  return and(filterFuncs);
});

export const selectSearchableTextInDecks = createSelector(
  selectLocalDecks,
  (decks) => {
    // deck.investigator_name doesn't work for imported decks?
    return decks.map(
      (deck) =>
        `${deck.name}|${deck.investigator_name || deck.cards.investigator.card.real_name}`,
    );
  },
);

export const selectDecksFiltered = createSelector(
  selectLocalDecks,
  selectDeckSearchTerm,
  selectSearchableTextInDecks,
  selectFilteringFunc,
  (decks, searchTerm, searchableText, filterFunc) => {
    let decksToFilter: ResolvedDeck[];

    if (searchTerm) {
      const finder = new uFuzzy({
        intraMode: 0,
        interIns: MATCHING_MAX_TOKEN_DISTANCE_DECKS,
      });

      const results = finder.search(searchableText, searchTerm);

      decksToFilter = [];

      if (results[0]) {
        for (const result of results[0]) {
          assert(decks[result], "Searching outside of bounds");
          decksToFilter.push(decks[result]);
        }
      }
    } else {
      decksToFilter = [...decks];
    }

    const filteredDecks = decksToFilter.filter(filterFunc);

    return filteredDecks ?? decks;
  },
);

export const selectFactionsInLocalDecks = createSelector(
  selectLocalDecks,
  (state: StoreState) => state.metadata.factions,
  (decks, factionMeta) => {
    if (!decks) return [];

    const factionsSet = new Set<string>();

    for (const deck of decks) {
      factionsSet.add(deck.cards.investigator.card.faction_code);
    }

    const factions = Array.from(factionsSet).map((code) => factionMeta[code]);

    return factions.sort(
      (a, b) => FACTION_ORDER.indexOf(a.code) - FACTION_ORDER.indexOf(b.code),
    );
  },
);
