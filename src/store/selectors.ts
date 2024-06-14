import { createSelector } from "reselect";
import { StoreState } from "./slices";
import { Card } from "./graphql/types";
import {
  Grouping,
  filterBacksides,
  filterPickable,
  filterPlayerCard,
  getGroupCards,
  groupByEncounterSets,
  groupByPlayerCardType,
  groupByWeakness,
  sortAlphabetically,
  sortByEncounterPosition,
} from "./selectors/utils";

export const selectFilteredCards = createSelector(
  (state: StoreState) => state.filters.cardType,
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (type, metadata, lookupTables) => {
    if (!Object.keys(metadata.cards).length) {
      console.warn("player cards selected before store is initialized.");
      return undefined;
    }

    const groups: Grouping[] = [];
    const cards: Card[] = [];
    const groupCounts = [];

    if (type === "player") {
      console.time("select_player_cards");

      for (const grouping of groupByPlayerCardType(metadata, lookupTables)) {
        const groupCards = getGroupCards(
          grouping,
          metadata,
          lookupTables,
          filterPickable,
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
          filterPlayerCard,
        );

        groupCards.sort(sortAlphabetically(lookupTables));

        if (groupCards.length) {
          groups.push(grouping);
          cards.push(...groupCards);
          groupCounts.push(groupCards.length);
        }
      }

      console.timeEnd("select_player_cards");
      return { cards, groups, groupCounts };
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
      return { groups, cards, groupCounts };
    }
  },
);
