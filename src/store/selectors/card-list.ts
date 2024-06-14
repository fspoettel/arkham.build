import { createSelector } from "reselect";
import { StoreState } from "../slices";
import { Card } from "../graphql/types";
import {
  Grouping,
  getGroupCards,
  groupByEncounterSets,
  groupByPlayerCardType,
  groupByWeakness,
} from "./utils/grouping";
import { sortAlphabetically, sortByEncounterPosition } from "./utils/sorting";
import {
  selectActiveCardType,
  selectActiveFactions,
  selectActiveLevels,
} from "./filters";
import {
  and,
  filterBacksides,
  filterExceptional,
  filterFactions,
  filterLevel,
  filterPlayerCard,
  filterWeaknesses,
  or,
} from "./utils/filtering";

export const selectFilteredCards = createSelector(
  selectActiveCardType,
  selectActiveFactions,
  selectActiveLevels,
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (activeCardType, activeFactions, activeLevels, metadata, lookupTables) => {
    if (!Object.keys(metadata.cards).length) {
      console.warn("player cards selected before store is initialized.");
      return undefined;
    }

    const groups: Grouping[] = [];
    const cards: Card[] = [];
    const groupCounts = [];

    if (activeCardType === "player") {
      console.time("select_player_cards");

      const weaknessFilters = and([filterFactions(activeFactions)]);

      const playerFilters = and([
        filterPlayerCard,
        filterFactions(activeFactions),
        filterWeaknesses,
        filterLevel(activeLevels.value),
        or([
          filterExceptional(activeLevels.exceptional),
          filterExceptional(!activeLevels.nonexceptional),
        ]),
      ]);

      for (const grouping of groupByPlayerCardType(metadata, lookupTables)) {
        const groupCards = getGroupCards(
          grouping,
          metadata,
          lookupTables,
          playerFilters,
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
          weaknessFilters,
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
          filterBacksides,
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
