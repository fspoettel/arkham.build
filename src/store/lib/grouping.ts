import { assert } from "@/utils/assert";

import { capitalize } from "@/utils/formatting";
import type { Card } from "../services/queries.types";
import type { GroupingType } from "../slices/lists.types";
import type { Metadata } from "../slices/metadata.types";
import {
  type SortFunction,
  sortByEncounterSet,
  sortByFactionOrder,
  sortBySlots,
  sortNumerical,
  sortTypesByOrder,
} from "./sorting";

export const NONE = "none";

const LEVEL_0 = "level0";
const UPGRADE = "upgrade";

type Key = string | number;

type Grouping<K extends Key = string> = {
  data: Record<K, Card[]>;
  groupings: K[];
  type: GroupingType;
};

type GroupingResult = {
  cards: Card[];
  key: string;
  type: string;
};

function toGroupingResult<K extends Key>(
  grouping: Grouping<K>,
): GroupingResult[] {
  return grouping.groupings.map((key) => ({
    cards: grouping.data[key],
    key: typeof key === "number" ? key.toString() : (key as string),
    type: grouping.type,
  }));
}

function omitEmptyGroupings<K extends Key>(grouping: Grouping<K>) {
  for (let i = 0; i < grouping.groupings.length; i++) {
    const key = grouping.groupings[i];

    if (!grouping.data[key].length) {
      delete grouping.data[key];
      grouping.groupings.splice(i, 1);
    } else {
      i++;
    }
  }
}

function groupByTypeCode(cards: Card[]) {
  const result = cards.reduce<Grouping>(
    (acc, card) => {
      const code = card.type_code;

      if (!acc.data[code]) {
        acc.data[code] = [card];
        acc.groupings.push(code);
      } else {
        acc.data[code].push(card);
      }

      return acc;
    },
    { data: {}, groupings: [], type: "type" },
  );

  omitEmptyGroupings(result);
  result.groupings.sort(sortTypesByOrder);

  return toGroupingResult(result);
}

function groupBySlots(cards: Card[]) {
  const result = cards.reduce<Grouping>(
    (acc, card) => {
      const slot = card.permanent ? "permanent" : card.real_slot ?? NONE;

      if (!acc.data[slot]) {
        acc.data[slot] = [card];
        acc.groupings.push(slot);
      } else {
        acc.data[slot].push(card);
      }

      return acc;
    },
    { data: {}, groupings: [], type: "slot" },
  );

  omitEmptyGroupings(result);
  result.groupings.sort(sortBySlots);

  return toGroupingResult(result);
}

function groupByLevel(cards: Card[]) {
  const results = cards.reduce<Grouping<number | string>>(
    (acc, card) => {
      const level = card.xp ?? NONE;

      if (!acc.data[level]) {
        acc.data[level] = [card];
        acc.groupings.push(level);
      } else {
        acc.data[level].push(card);
      }

      return acc;
    },
    { data: {}, groupings: [], type: "level" },
  );

  omitEmptyGroupings(results);

  results.groupings.sort((a, b) =>
    a === NONE ? -1 : b === NONE ? 1 : sortNumerical(a as number, b as number),
  );

  return toGroupingResult(results);
}

function groupByLevel0VsUpgrade(cards: Card[]) {
  const results = cards.reduce<Grouping>(
    (acc, card) => {
      if (!card.xp) {
        acc.data[LEVEL_0].push(card);
      } else {
        acc.data[UPGRADE].push(card);
      }

      return acc;
    },
    {
      data: { [LEVEL_0]: [], [UPGRADE]: [] },
      groupings: [LEVEL_0, UPGRADE],
      type: "base_upgrades",
    },
  );

  omitEmptyGroupings(results);

  return toGroupingResult(results);
}

function groupByFaction(cards: Card[]) {
  const results = cards.reduce<Grouping>(
    (acc, card) => {
      const faction = card.faction2_code ? "multiclass" : card.faction_code;

      if (!acc.data[faction]) {
        acc.data[faction] = [card];
        acc.groupings.push(faction);
      } else {
        acc.data[faction].push(card);
      }

      return acc;
    },
    { data: {}, groupings: [], type: "faction" },
  );

  omitEmptyGroupings(results);
  results.groupings.sort(sortByFactionOrder);

  return toGroupingResult(results);
}

function groupByEncounterSet(cards: Card[], metadata: Metadata) {
  const results = cards.reduce<Grouping>(
    (acc, card) => {
      const code = card.encounter_code ?? NONE;

      if (!acc.data[code]) {
        acc.data[code] = [card];
        acc.groupings.push(code);
      } else {
        acc.data[code].push(card);
      }

      return acc;
    },
    { data: {}, groupings: [], type: "encounter_set" },
  );

  omitEmptyGroupings(results);
  results.groupings.sort(sortByEncounterSet(metadata));

  return toGroupingResult(results);
}

function groupByCost(cards: Card[]) {
  const results = cards.reduce<Grouping<number | string>>(
    (acc, card) => {
      const cost = card.cost ?? NONE;

      if (!acc.data[cost]) {
        acc.data[cost] = [card];
        acc.groupings.push(cost);
      } else {
        acc.data[cost].push(card);
      }

      return acc;
    },
    { data: {}, groupings: [], type: "cost" },
  );

  omitEmptyGroupings(results);

  results.groupings.sort((a, b) =>
    a === NONE ? -1 : b === NONE ? 1 : sortNumerical(a as number, b as number),
  );

  return toGroupingResult(results);
}

function groupByCycle(cards: Card[], metadata: Metadata) {
  const results = cards.reduce<Grouping>(
    (acc, card) => {
      const pack = metadata.packs[card.pack_code];
      const cycle = metadata.cycles[pack.cycle_code].code;

      if (!acc.data[cycle]) {
        acc.data[cycle] = [card];
        acc.groupings.push(cycle);
      } else {
        acc.data[cycle].push(card);
      }

      return acc;
    },
    { data: {}, groupings: [], type: "cycle" },
  );

  omitEmptyGroupings(results);
  results.groupings.sort(
    (a, b) => metadata.cycles[a].position - metadata.cycles[b].position,
  );

  return toGroupingResult(results);
}

function groupBySubtypeCode(cards: Card[]) {
  const results = cards.reduce<Grouping>(
    (acc, card) => {
      const subtype = card.subtype_code ?? NONE;

      if (acc.data[subtype]) {
        acc.data[subtype].push(card);
      }

      return acc;
    },
    {
      data: { [NONE]: [], weakness: [], basicweakness: [] },
      groupings: [NONE, "weakness", "basicweakness"],
      type: "subtype",
    },
  );

  omitEmptyGroupings(results);

  return toGroupingResult(results);
}

function applyGrouping(
  cards: Card[],
  grouping: GroupingType,
  metadata: Metadata,
): GroupingResult[] {
  switch (grouping) {
    case "subtype":
      return groupBySubtypeCode(cards);
    case "type":
      return groupByTypeCode(cards);
    case "slot":
      return groupBySlots(cards);
    case "level":
      return groupByLevel(cards);
    case "base_upgrades":
      return groupByLevel0VsUpgrade(cards);
    case "faction":
      return groupByFaction(cards);
    case "encounter_set":
      return groupByEncounterSet(cards, metadata);
    case "cost":
      return groupByCost(cards);
    case "cycle":
      return groupByCycle(cards, metadata);
  }
}

export function getGroupedCards(
  groupings: GroupingType[],
  cards: Card[],
  sortFunction: SortFunction,
  metadata: Metadata,
) {
  assert(groupings.length > 0, "At least one grouping needs to be provided.");

  const groups = applyGrouping(cards, groupings[0], metadata);

  if (groupings.length > 1) {
    for (let i = 1; i < groupings.length; i++) {
      const grouping = groupings[i];

      let j = 0;

      while (j < groups.length) {
        const group = groups[j];
        const newGroups = applyGrouping(group.cards, grouping, metadata);

        for (const g of newGroups) {
          g.key = `${group.key}|${g.key}`;
          g.type = `${group.type}|${g.type}`;
        }

        groups.splice(j, 1, ...newGroups);
        j += newGroups.length;
      }
    }
  }

  for (const group of groups) {
    group.cards.sort(sortFunction);
  }

  return groups;
}

export function getGroupingKeyLabel(
  type: string,
  segment: string,
  metadata: Metadata,
) {
  switch (type) {
    case "subtype": {
      if (segment === "weakness") return "Weakness";
      if (segment === "basicweakness") return "Basic Weakness";
      return "";
    }

    case "type": {
      return capitalize(segment);
    }

    case "cycle": {
      return metadata.cycles[segment]?.real_name ?? "";
    }

    case "encounter_set": {
      return metadata.encounterSets[segment]?.name ?? "";
    }

    case "slot": {
      if (segment === NONE) return "No Slot";
      if (segment === "permanent") return "Permanent";
      return capitalize(segment);
    }

    case "level": {
      if (segment === NONE) return "No level";
      return `Level ${segment}`;
    }

    case "cost": {
      if (segment === NONE) return "No cost";
      if (segment === "-2") return "Cost X";
      return `Cost ${segment}`;
    }

    case "faction": {
      return segment === "multiclass"
        ? "Multiclass"
        : metadata.factions[segment]?.name ?? "";
    }

    case "default": {
      return segment;
    }
  }

  return "";
}
