import { createSelector } from "reselect";
import { StoreState } from "./slices";
import { Indexes } from "./slices/indexes/types";
import { Card, EncounterSet } from "./graphql/types";

function alphabetical(indexes: Indexes, ids: string[]) {
  ids.sort(
    (a, b) => indexes.sort.alphabetical[a] - indexes.sort.alphabetical[b],
  );
}

export const selectFilteredCards = createSelector(
  (state: StoreState) => state.filters.cardType,
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.indexes,
  (type, metadata, indexes) => {
    console.time("select_cards");

    if (type === "player") {
      return null;
    } else {
      const encounterSets = Object.values(metadata.encounterSets);
      encounterSets.sort((a, b) => a.name.localeCompare(b.name));

      const groups: EncounterSet[] = [];
      const cards: Card[] = [];
      const groupCounts = [];

      for (const set of encounterSets) {
        const cardsByEncounter = indexes.encounter_code[set.code];

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

          if (card.encounter_position == null) {
            console.debug(card);
          }

          acc.push(card);
          return acc;
        }, [] as Card[]);

        setCards.sort((a, b) => a.encounter_position - b.encounter_position);

        cards.push(...setCards);
        groupCounts.push(setCards.length);
      }

      console.timeEnd("select_cards");
      return { groups, cards, groupCounts };
    }
  },
);
