import type { Deck, Slots } from "@/store/slices/data.types";
import type { LookupTables } from "@/store/slices/lookup-tables.types";
import type { Metadata } from "@/store/slices/metadata.types";
import { countExperience, isSpecialCard } from "@/utils/card-utils";
import { range } from "@/utils/range";

import { resolveCardWithRelations } from "../resolve-card";
import type {
  CardWithRelations,
  Customizations,
  DeckMeta,
  ResolvedCard,
  ResolvedDeck,
} from "../types";

export function decodeSlots<
  T extends boolean,
  S extends T extends true ? CardWithRelations : ResolvedCard,
>(
  deck: Deck,
  extraSlots: ResolvedDeck<S>["extraSlots"],
  metadata: Metadata,
  lookupTables: LookupTables,
  investigator: CardWithRelations,
  customizations: Customizations | undefined,
  withRelations: T,
) {
  const cards: ResolvedDeck<S>["cards"] = {
    investigator: investigator as S,
    slots: {},
    sideSlots: {},
    ignoreDeckLimitSlots: {},
    extraSlots: {},
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
      withRelations,
    );

    if (card) {
      deckSizeTotal += quantity;
      xpRequired += countExperience(card.card, quantity);
      cards.slots[code] = card as S;

      if (!isSpecialCard(card.card, investigator)) {
        deckSize += Math.max(
          quantity - (deck.ignoreDeckLimitSlots?.[code] ?? 0),
          0,
        );
      }
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
        cards.sideSlots[code] = card as S;
      }
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
        cards.extraSlots[code] = card as S;
      }
    }
  }

  return {
    cards,
    deckSize,
    deckSizeTotal,
    xpRequired,
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
  return Object.entries(slots)
    .filter(([, quantity]) => quantity > 0)
    .map(([code, quantity]) =>
      range(0, quantity)
        .map(() => code)
        .join(","),
    )
    .join(",");
}
