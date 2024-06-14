import { ASSET_SLOT_ORDER } from "@/utils/constants";

import type { Card } from "../services/types";
import type { LookupTables } from "../slices/lookup-tables.types";
import type { Metadata } from "../slices/metadata.types";

export function sortAlphabetically(lookupTables: LookupTables) {
  return (a: Card, b: Card) => {
    if (a.real_name === b.real_name) {
      if (a.xp === b.xp) {
        return +(a.parallel ?? false) - +(b.parallel ?? false);
      }

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

export function sortedEncounterSets(metadata: Metadata) {
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

  return encounterSets;
}

export function sortBySlots(a: string, b: string) {
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
}

export function sortedBySlots(slotsTable: LookupTables["slots"]) {
  const slots = Object.keys(slotsTable);
  slots.sort(sortBySlots);
  return slots;
}
