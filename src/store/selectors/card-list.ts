import { createSelector } from "reselect";

import { Card } from "../services/types";
import { StoreState } from "../slices";
import {
  Grouping,
  getGroupCards,
  groupByEncounterSets,
  groupByPlayerCardType,
  groupByWeakness,
} from "../utils/grouping";
import { applySearch } from "../utils/searching";
import { sortAlphabetically, sortByEncounterPosition } from "../utils/sorting";
import { applyTaboo } from "../utils/taboos";
import {
  selectEncounterFilters,
  selectPlayerCardFilters,
  selectWeaknessFilters,
} from "./filters";
import { selectActiveCardType } from "./filters/shared";
import { selectCanonicalTabooSetId } from "./filters/tabooSet";

export const selectFilteredCards = createSelector(
  selectActiveCardType,
  selectPlayerCardFilters,
  selectWeaknessFilters,
  selectEncounterFilters,
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (state: StoreState) => state.search,
  selectCanonicalTabooSetId,
  (
    activeCardType,
    playerCardFilter,
    weaknessFilter,
    encounterFilters,
    metadata,
    lookupTables,
    search,
    tabooSetId,
  ) => {
    if (!Object.keys(metadata.cards).length) {
      console.warn("player cards selected before store is initialized.");
      return undefined;
    }

    const groups: Grouping[] = [];
    const cards: Card[] = [];
    const groupCounts = [];

    if (activeCardType === "player") {
      console.time("[performance] select_player_cards");

      for (const grouping of groupByPlayerCardType(metadata, lookupTables)) {
        const groupCards = applySearch(
          search,
          getGroupCards(
            grouping,
            metadata,
            lookupTables,
            playerCardFilter,
            tabooSetId ? (c) => applyTaboo(c, tabooSetId, metadata) : undefined,
          ),
          metadata,
        );

        if (groupCards.length) {
          groupCards.sort(sortAlphabetically(lookupTables));
          groups.push(grouping);
          cards.push(...groupCards);
          groupCounts.push(groupCards.length);
        }
      }

      for (const grouping of groupByWeakness(metadata)) {
        const groupCards = applySearch(
          search,
          getGroupCards(grouping, metadata, lookupTables, weaknessFilter),
          metadata,
        );

        if (groupCards.length) {
          groupCards.sort(sortAlphabetically(lookupTables));
          groups.push(grouping);
          cards.push(...groupCards);
          groupCounts.push(groupCards.length);
        }
      }

      console.timeEnd("[performance] select_player_cards");
    } else {
      console.time("[performance] select_encounter_cards");

      for (const grouping of groupByEncounterSets(metadata)) {
        const groupCards = applySearch(
          search,
          getGroupCards(grouping, metadata, lookupTables, encounterFilters),
          metadata,
        );

        if (groupCards.length) {
          groupCards.sort(sortByEncounterPosition);
          groups.push(grouping);
          cards.push(...groupCards);
          groupCounts.push(groupCards.length);
        }
      }

      console.timeEnd("[performance] select_encounter_cards");
    }

    return {
      key: activeCardType,
      groups,
      cards,
      groupCounts,
    };
  },
);
