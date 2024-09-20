import { FACTION_ORDER } from "@/utils/constants";
import { createSelector } from "reselect";
import type { StoreState } from "../slices";
import { selectLocalDecks } from "./decks";

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

export const selectDeckFilters = createSelector(
  (state: StoreState) => state.data.deckCollection.filters,
  (filters) => filters,
);

export const selectDeckFactionFilters = createSelector(
  selectDeckFilters,
  (deckFilters) => deckFilters.faction,
);
