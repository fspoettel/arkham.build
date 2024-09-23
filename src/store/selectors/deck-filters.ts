import { createSelector } from "reselect";

import { FACTION_ORDER } from "@/utils/constants";
import { and, or } from "@/utils/fp";
import type { ResolvedDeck } from "../lib/types";
import type { StoreState } from "../slices";
import type {
  DeckCollectionFilter,
  DeckFilterTypes,
} from "../slices/deck-collection-filters.types";
import type { MultiselectFilter } from "../slices/lists.types";
import { selectLocalDecks } from "./decks";

const filterDeckByFaction = (faction: string) => {
  return (deck: ResolvedDeck) => {
    return deck.cards.investigator.card.faction_code === faction;
  };
};

const makeDeckFactionFilter = (values: MultiselectFilter) => {
  return or(values.map((value) => filterDeckByFaction(value)));
};

const makeDeckFilterFunc = (
  userFilters: Record<DeckFilterTypes, DeckCollectionFilter>,
) => {
  const filterFuncs = [];

  for (const filter of Object.keys(userFilters)) {
    switch (filter) {
      case "faction":
        filterFuncs.push(makeDeckFactionFilter(userFilters[filter]));
    }
  }

  return and(filterFuncs);
};

export const selectDeckFilters = createSelector(
  (state: StoreState) => state.deckFilters,
  (filters) => filters,
);

export const selectDeckFactionFilters = createSelector(
  selectDeckFilters,
  (deckFilters) => deckFilters.faction,
);

export const selectDecksFiltered = createSelector(
  selectLocalDecks,
  selectDeckFilters,
  (decks, filters) => {
    const filterFunc = makeDeckFilterFunc(filters);
    const filteredDecks = decks.filter(filterFunc);

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
