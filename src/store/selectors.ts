import { createSelector } from "reselect";
import { StoreState } from "./slices";
import { Card, EncounterSet } from "./graphql/types";

export const selectFilteredCards = createSelector(
  (state: StoreState) => state.filters.cardType,
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (type, metadata, luts) => {
    console.time("select_cards");

    if (type === "player") {
      console.timeEnd("select_cards");
      return null;
    } else {
      const encounterSets = Object.values(metadata.encounterSets);
      encounterSets.sort((a, b) => a.name.localeCompare(b.name));

      const groups: EncounterSet[] = [];
      const cards: Card[] = [];
      const groupCounts = [];

      for (const set of encounterSets) {
        const cardsByEncounter = luts.encounter_code[set.code];

        if (!cardsByEncounter) {
          console.debug(`set ${set.code} is empty.`);
          continue;
        }

        groups.push(set);

        const setCards = Object.keys(cardsByEncounter).reduce((acc, code) => {
          const card = metadata.cards[code];

          if (card.linked) {
            return acc;
          }

          acc.push(card);
          return acc;
        }, [] as Card[]);

        setCards.sort(
          (a, b) => (a.encounter_position ?? 0) - (b.encounter_position ?? 0),
        );

        cards.push(...setCards);
        groupCounts.push(setCards.length);
      }

      console.timeEnd("select_cards");
      return { groups, cards, groupCounts };
    }
  },
);
