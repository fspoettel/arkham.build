import type { Deck, Slots } from "@/store/slices/data.types";
import type { LookupTables } from "@/store/slices/lookup-tables.types";
import type { Metadata } from "@/store/slices/metadata.types";
import {
  countExperience,
  decodeExileSlots,
  getCardChartableData,
  isSpecialCard,
} from "@/utils/card-utils";
import { range } from "@/utils/range";

import { resolveCardWithRelations } from "./resolve-card";
import type {
  CardWithRelations,
  ChartableData,
  Customizations,
  DeckMeta,
  DecksChartInfo,
  Factions,
  ResolvedDeck,
  SkillIcon,
  UnformattedChartInfo,
} from "./types";

export function decodeSlots(
  deck: Deck,
  extraSlots: ResolvedDeck["extraSlots"],
  metadata: Metadata,
  lookupTables: LookupTables,
  investigator: CardWithRelations,
  customizations: Customizations | undefined,
) {
  const cards: ResolvedDeck["cards"] = {
    investigator: investigator,
    slots: {},
    sideSlots: {},
    ignoreDeckLimitSlots: {},
    extraSlots: {},
    exileSlots: {},
  };

  const chartableInfo: UnformattedChartInfo = {
    costCurve: [],
    skillIcons: {
      skill_agility: 0,
      skill_combat: 0,
      skill_intellect: 0,
      skill_willpower: 0,
      skill_wild: 0,
    },
    factions: {
      guardian: 0,
      seeker: 0,
      rogue: 0,
      mystic: 0,
      survivor: 0,
      neutral: 0,
    },
  };

  let deckSize = 0;
  let deckSizeTotal = 0;
  let xpRequired = 0;

  for (const [code, quantity] of Object.entries(deck.slots)) {
    const card = resolveCardWithRelations(
      metadata,
      lookupTables,
      code,
      deck.taboo_id,
      customizations,
      true,
    );

    if (card) {
      deckSizeTotal += quantity;
      xpRequired += countExperience(card.card, quantity);
      cards.slots[code] = card;

      if (deck.ignoreDeckLimitSlots?.[code]) {
        cards.ignoreDeckLimitSlots[code] = card;
      }

      if (!isSpecialCard(card.card, investigator)) {
        deckSize += Math.max(
          quantity - (deck.ignoreDeckLimitSlots?.[code] ?? 0),
          0,
        );
      }

      getCardChartableData(card.card, quantity, chartableInfo);
    }
  }

  if (deck.sideSlots && !Array.isArray(deck.sideSlots)) {
    for (const [code] of Object.entries(deck.sideSlots)) {
      const card = resolveCardWithRelations(
        metadata,
        lookupTables,
        code,
        deck.taboo_id,
        customizations,
        false,
      ); // SAFE! we do not need relations for side deck.

      if (card) {
        cards.sideSlots[code] = card;
      }
    }
  }

  const exileSlots = decodeExileSlots(deck.exile_string);

  for (const [code] of Object.entries(exileSlots)) {
    const card = resolveCardWithRelations(
      metadata,
      lookupTables,
      code,
      deck.taboo_id,
      customizations,
      false,
    ); // SAFE! we do not need relations for exile deck.

    if (card) {
      cards.exileSlots[code] = card;
    }
  }

  if (extraSlots && !Array.isArray(extraSlots)) {
    for (const [code, quantity] of Object.entries(extraSlots)) {
      const card = resolveCardWithRelations(
        metadata,
        lookupTables,
        code,
        deck.taboo_id,
        customizations,
        false,
      ); // SAFE! we do not need relations for extra deck.

      if (card) {
        xpRequired += countExperience(card.card, quantity);
        deckSizeTotal += quantity;
        cards.extraSlots[code] = card;
      }
    }
  }

  const chartInfo: DecksChartInfo = formatChartInfo(chartableInfo);

  return {
    cards,
    deckSize,
    deckSizeTotal,
    xpRequired,
    chartInfo,
  };
}

/**
 * Decodes extra slots from a parsed deck meta JSON.
 */
export function decodeExtraSlots(deckMeta: DeckMeta): Slots {
  if (deckMeta.extra_deck) {
    const extraSlots: Record<string, number> = {};

    for (const code of deckMeta.extra_deck.split(",")) {
      extraSlots[code] = (extraSlots[code] ?? 0) + 1;
    }

    return extraSlots;
  }

  return {};
}

/**
 * Encodes extra slots into a deck meta field.
 */
export function encodeExtraSlots(slots: Record<string, number>) {
  const entries = Object.entries(slots).reduce<string[]>(
    (acc, [code, quantity]) => {
      if (quantity > 0) {
        for (const _ in range(0, quantity)) {
          acc.push(code);
        }
      }

      return acc;
    },
    [],
  );

  return entries.length ? entries.join(",") : undefined;
}

function formatChartInfo(info: UnformattedChartInfo): DecksChartInfo {
  const {
    costCurve,
    skillIcons: unformattedSkillIcons,
    factions: unformattedFactions,
  } = info;

  // Account for gaps in card costs.
  for (const [index, costColumn] of costCurve.entries()) {
    if (!costColumn) info.costCurve[index] = { x: index, y: 0 };
  }

  const skillIcons = Object.keys(unformattedSkillIcons).map((skill) => {
    return {
      x: skill as SkillIcon,
      y: unformattedSkillIcons[skill as SkillIcon],
    };
  });

  const factions: ChartableData<Factions> = [];

  for (const faction of Object.keys(unformattedFactions)) {
    const val =
      unformattedFactions[faction as keyof UnformattedChartInfo["factions"]];
    if (val !== 0) {
      factions.push({
        x: faction as Factions,
        y: val,
      });
    }
  }

  return { costCurve, skillIcons, factions };
}
