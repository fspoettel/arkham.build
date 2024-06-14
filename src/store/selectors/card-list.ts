import { createSelector } from "reselect";

import { Card } from "../graphql/types";
import { StoreState } from "../slices";
import {
  selectEncounterFilters,
  selectPlayerCardFilters,
  selectWeaknessFilters,
} from "./filters";
import { selectActiveCardType } from "./filters/shared";
import {
  Grouping,
  getGroupCards,
  groupByEncounterSets,
  groupByPlayerCardType,
  groupByWeakness,
} from "./utils/grouping";
import { sortAlphabetically, sortByEncounterPosition } from "./utils/sorting";

export const selectFilteredCards = createSelector(
  selectActiveCardType,
  selectPlayerCardFilters,
  selectWeaknessFilters,
  selectEncounterFilters,
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (
    activeCardType,
    playerCardFilter,
    weaknessFilter,
    encounterFilters,
    metadata,
    lookupTables,
  ) => {
    if (!Object.keys(metadata.cards).length) {
      console.warn("player cards selected before store is initialized.");
      return undefined;
    }

    const groups: Grouping[] = [];
    const cards: Card[] = [];
    const groupCounts = [];

    if (activeCardType === "player") {
      console.time("select_player_cards");

      for (const grouping of groupByPlayerCardType(metadata, lookupTables)) {
        const groupCards = getGroupCards(
          grouping,
          metadata,
          lookupTables,
          playerCardFilter,
        );

        groupCards.sort(sortAlphabetically(lookupTables));

        if (groupCards.length) {
          groups.push(grouping);
          cards.push(...groupCards);
          groupCounts.push(groupCards.length);
        }
      }

      for (const grouping of groupByWeakness(metadata)) {
        const groupCards = getGroupCards(
          grouping,
          metadata,
          lookupTables,
          weaknessFilter,
        );

        groupCards.sort(sortAlphabetically(lookupTables));

        if (groupCards.length) {
          groups.push(grouping);
          cards.push(...groupCards);
          groupCounts.push(groupCards.length);
        }
      }

      console.timeEnd("select_player_cards");
    } else {
      console.time("select_encounter_cards");

      for (const grouping of groupByEncounterSets(metadata)) {
        const groupCards = getGroupCards(
          grouping,
          metadata,
          lookupTables,
          encounterFilters,
        );

        groupCards.sort(sortByEncounterPosition);

        if (groupCards.length) {
          groups.push(grouping);
          cards.push(...groupCards);
          groupCounts.push(groupCards.length);
        }
      }

      console.timeEnd("select_encounter_cards");
    }

    return {
      key: activeCardType,
      groups,
      cards,
      groupCounts,
    };
  },
);
