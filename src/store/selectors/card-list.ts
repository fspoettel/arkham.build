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
import { selectActiveCardType, selectActiveFactions } from "./filters";
import {
  and,
  filterBacksides,
  filterFactions,
  filterPlayerCard,
  filterWeaknesses,
} from "./utils/filtering";

export const selectFilteredCards = createSelector(
  selectActiveCardType,
  selectActiveFactions,
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (activeCardType, activeFactions, metadata, lookupTables) => {
    if (!Object.keys(metadata.cards).length) {
      console.warn("player cards selected before store is initialized.");
      return undefined;
    }

    const groups: Grouping[] = [];
    const cards: Card[] = [];
    const groupCounts = [];

    const factionsFilter = filterFactions(activeFactions);

    if (activeCardType === "player") {
      console.time("select_player_cards");

      for (const grouping of groupByPlayerCardType(metadata, lookupTables)) {
        const groupCards = getGroupCards(
          grouping,
          metadata,
          lookupTables,
          and(filterPlayerCard, filterWeaknesses, factionsFilter),
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
          and(filterPlayerCard, factionsFilter),
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
      activeCardType,
      activeFactionsLength: activeFactions.length,
      groups,
      cards,
      groupCounts,
    };
  },
);
