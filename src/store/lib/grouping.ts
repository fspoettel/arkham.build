import type { Card } from "../services/queries.types";
import type { LookupTables } from "../slices/lookup-tables.types";
import type { Metadata } from "../slices/metadata.types";

export type Grouping = {
  code: string;
  name: string;
  grouping_type: string; // maybe use keyof LookupTables?
};

export function resolveGroupingCardCodes(
  grouping: Grouping,
  lookupTables: LookupTables,
): string[] {
  switch (grouping.grouping_type) {
    case "slot": {
      return Object.keys(lookupTables.slots[grouping.code]).filter(
        (code) =>
          !lookupTables.properties.multislot[code] ||
          grouping.code.includes("."),
      );
    }

    case "subtype":
      return Object.keys(lookupTables.subtypeCode[grouping.code]);

    case "type":
      return Object.keys(lookupTables.typeCode[grouping.code]);

    case "encounter_set":
      return Object.keys(lookupTables.encounterCode[grouping.code]);

    default:
      return [];
  }
}

export function getGroupCards(
  grouping: Grouping,
  metadata: Metadata,
  lookupTables: LookupTables,
  filter: (c: Card) => boolean,
  mapper?: (c: Card) => Card,
) {
  return resolveGroupingCardCodes(grouping, lookupTables).reduce<Card[]>(
    (acc, code) => {
      const card = mapper ? mapper(metadata.cards[code]) : metadata.cards[code];
      if (filter(card)) acc.push(card);
      return acc;
    },
    [],
  );
}
