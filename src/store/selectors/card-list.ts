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
  selectActiveCost,
  selectActiveFactions,
  selectActiveLevel,
} from "./filters";
import {
  and,
  filterBacksides,
  filterCost,
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
  selectActiveLevel,
  selectActiveCost,
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (
    activeCardType,
    activeFactions,
    activeLevel,
    activeCost,
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

      const levelFilter = filterLevel(activeLevel.value);
      const costFilter = filterCost(
        activeCost.value,
        activeCost.even,
        activeCost.odd,
        activeCost.x,
      );

      const weaknessFilters = and([
        filterFactions(activeFactions.value),
        levelFilter,
        costFilter,
      ]);

      const playerFilters = and([
        filterPlayerCard,
        filterFactions(activeFactions.value),
        filterWeaknesses,
        levelFilter,
        or([
          filterExceptional(activeLevel.exceptional),
          filterExceptional(!activeLevel.nonexceptional),
        ]),
        costFilter,
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
