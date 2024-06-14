import { ASSET_SLOT_ORDER, PLAYER_TYPE_ORDER } from "@/utils/constants";
import { LookupTables } from "../slices/lookup-tables/types";
import { Metadata } from "../slices/metadata/types";
import { Card } from "../graphql/types";

export type Grouping = {
  code: string;
  name: string;
  grouping_type: string; // TODO: maybe use keyof LookupTables?
};

export function groupBySlot(lookupTables: LookupTables): Grouping[] {
  const slots = Object.keys(lookupTables.slots);

  slots.sort((a, b) => {
    const slotA = ASSET_SLOT_ORDER.indexOf(a);
    const slotB = ASSET_SLOT_ORDER.indexOf(b);

    if (slotA === -1 && slotB === -1) {
      return a.localeCompare(b);
    } else if (slotA === -1) {
      return 1;
    } else if (slotB === -1) {
      return -1;
    } else {
      return slotA - slotB;
    }
  });

  return slots.map((slot) => ({
    name: slot === "Slotless" ? "Asset" : `Asset: ${slot}`,
    code: slot,
    grouping_type: "slot",
  }));
}

export function groupByPlayerCardType(
  metadata: Metadata,
  lookupTables: LookupTables,
): Grouping[] {
  return PLAYER_TYPE_ORDER.flatMap((type) =>
    type === "asset"
      ? groupBySlot(lookupTables)
      : { ...metadata.types[type], grouping_type: "type" },
  );
}

export function groupByWeakness(metadata: Metadata): Grouping[] {
  return Object.keys(metadata.subtypes).map((code) => ({
    code: code,
    name: code === "weakness" ? "Signature Weakness" : "Basic Weakness",
    grouping_type: "subtype",
  }));
}

export function groupByEncounterSets(metadata: Metadata): Grouping[] {
  const encounterSets = Object.values(metadata.encounterSets);

  encounterSets.sort((a, b) => {
    const packA = metadata.packs[a.pack_code];
    const packB = metadata.packs[b.pack_code];

    const cycleA = metadata.cycles[packA.cycle_code];
    const cycleB = metadata.cycles[packB.cycle_code];

    if (cycleA.position !== cycleB.position) {
      return cycleA.position - cycleB.position;
    }

    if (packA.position !== packB.position) {
      return packA.position - packB.position;
    }

    return a.name.localeCompare(b.name);
  });

  return encounterSets.map((e) => ({
    code: e.code,
    name: e.name,
    grouping_type: "encounter_set",
  }));
}

export function resolveGroupingCardCodes(
  grouping: Grouping,
  lookupTables: LookupTables,
): string[] {
  switch (grouping.grouping_type) {
    case "slot":
      return Object.keys(lookupTables.slots[grouping.code]);

    case "subtype":
      return Object.keys(lookupTables.subtype_code[grouping.code]);

    case "type":
      return Object.keys(lookupTables.type_code[grouping.code]);

    case "encounter_set":
      return Object.keys(lookupTables.encounter_code[grouping.code]);

    default:
      return [];
  }
}

export function filterWeaknesses(card: Card) {
  return !card.subtype_code;
}

export function filterPlayerCard(card: Card) {
  return (
    !card.alt_art_investigator &&
    !card.duplicate_of_code &&
    !card.alternate_of_code &&
    !card.encounter_code
  );
}

export function filterPickable(card: Card) {
  return filterPlayerCard(card) && filterWeaknesses(card);
}

export function filterBacksides(card: Card) {
  return !card.linked;
}

export function getGroupCards(
  grouping: Grouping,
  metadata: Metadata,
  lookupTables: LookupTables,
  filter: (c: Card) => boolean,
) {
  return resolveGroupingCardCodes(grouping, lookupTables).reduce(
    (acc, code) => {
      const card = metadata.cards[code];
      if (filter(card)) acc.push(card);
      return acc;
    },
    [] as Card[],
  );
}

export function sortAlphabetically(lookupTables: LookupTables) {
  return (a: Card, b: Card) => {
    if (a.real_name === b.real_name) {
      return (a.xp ?? 0) - (b.xp ?? 0);
    }
    return (
      lookupTables.sort.alphabetical[a.code] -
      lookupTables.sort.alphabetical[b.code]
    );
  };
}

export function sortByEncounterPosition(a: Card, b: Card) {
  return (a.encounter_position ?? 0) - (b.encounter_position ?? 0);
}
