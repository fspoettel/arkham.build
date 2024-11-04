import type { Deck, Slots } from "@/store/slices/data.types";
import type { LookupTables } from "@/store/slices/lookup-tables.types";
import type { Metadata } from "@/store/slices/metadata.types";
import {
  countExperience,
  decodeExileSlots,
  isSpecialCard,
} from "@/utils/card-utils";
import { range } from "@/utils/range";
import { addCardToDeckCharts, emptyDeckCharts } from "./deck-charts";
import { resolveCardWithRelations } from "./resolve-card";
import type {
  CardWithRelations,
  Customizations,
  DeckCharts,
  DeckMeta,
  ResolvedDeck,
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

  let deckSize = 0;
  let deckSizeTotal = 0;
  let xpRequired = 0;

  const charts: DeckCharts = emptyDeckCharts();

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

      addCardToDeckCharts(card.card, quantity, charts);
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

  return {
    cards,
    deckSize,
    deckSizeTotal,
    xpRequired,
    charts,
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
