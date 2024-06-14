import type { PlayerType } from "@/utils/constants";

import type { Card } from "../services/types";
import type { CardWithRelations } from "./card-resolver";
import type { ResolvedDeck } from "./deck-resolver";
import { isSpecialCard } from "./deck-resolver";

export type DeckCard = Card & {
  quantity: number;
};

export type Grouping = {
  [K in Exclude<PlayerType, "asset">]?: DeckCard[];
} & {
  asset?: Record<string, DeckCard[]>;
  event?: DeckCard[];
  skill?: DeckCard[];
};

export type Groupings = {
  main: Grouping;
  special: Grouping;
  side?: Grouping;
  bonded?: Grouping;
};

export type DisplayDeck = ResolvedDeck<CardWithRelations> & {
  groups: Groupings;
};

export function groupDeckCardsByType(deck: ResolvedDeck<CardWithRelations>) {
  const groupings: Groupings = {
    main: {
      asset: {},
      event: [],
      skill: [],
    },
    special: {},
  };

  for (const { card } of Object.values(deck.cards.sideSlots)) {
    const deckCard = { ...card, quantity: deck.sideSlots?.[card.code] };
    addCardToGrouping(groupings, "side", deckCard);
  }

  for (const resolvedCard of Object.values(deck.cards.slots)) {
    const card = resolvedCard.card;
    const deckCard = { ...card, quantity: deck.slots[card.code] };
    if (isSpecialCard(card, deck.cards.investigator)) {
      addCardToGrouping(groupings, "special", deckCard);
    } else {
      addCardToGrouping(groupings, "main", deckCard);
    }
    addBondedToGrouping(groupings, resolvedCard);
  }

  // ignore deck limit slots should always go to special, as it can contain duplicate cards of normal slots.
  //example: Ace of Rods in TCU; Parallel Agnes upgrades.
  for (const resolvedCard of Object.values(deck.cards.ignoreDeckLimitSlots)) {
    addCardToGrouping(groupings, "special", {
      ...resolvedCard.card,
      quantity: deck.ignoreDeckLimitSlots?.[resolvedCard.card.code] ?? 0,
    });
    addBondedToGrouping(groupings, resolvedCard);
  }

  return groupings;
}

function addCardToGrouping(
  groupings: Groupings,
  key: keyof Groupings,
  card: Card,
) {
  groupings[key] ??= {};

  const grouping = groupings[key] as Grouping;

  if (card.type_code === "asset") {
    grouping.asset ??= {};

    const slot = card.real_slot
      ? card.real_slot
      : card.permanent
        ? "Permanent"
        : "Other";

    if (slot) {
      if (!grouping.asset[slot]) {
        grouping.asset[slot] = [card];
      } else {
        grouping.asset[slot].push(card);
      }
    }
  } else {
    const t = card.type_code as Exclude<PlayerType, "asset">;
    grouping[t] ??= [];
    grouping[t]?.push(card);
  }
}

function addBondedToGrouping(
  groupings: Groupings,
  resolvedCard: CardWithRelations,
) {
  const bound = resolvedCard.relations?.bound;
  if (bound?.length) {
    for (const { card } of bound) {
      addCardToGrouping(groupings, "bonded", {
        ...card,
        quantity: card.quantity,
      });
    }
  }
}
