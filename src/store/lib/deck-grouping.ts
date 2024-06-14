import type { PlayerType } from "@/utils/constants";

import type { Card } from "../services/types";
import { isSpecialCard } from "./deck-resolver";
import type { CardWithRelations, ResolvedDeck } from "./types";

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

type NamedGrouping = {
  id: string;
  data: Grouping;
};

export type Groupings = {
  main: NamedGrouping;
  special: NamedGrouping;
  side?: NamedGrouping;
  bonded?: NamedGrouping;
  extra?: NamedGrouping;
};

export type DisplayDeck = ResolvedDeck<CardWithRelations> & {
  groups: Groupings;
};

export function groupDeckCardsByType(deck: ResolvedDeck<CardWithRelations>) {
  const groupings: Groupings = {
    main: {
      id: "main",
      data: {
        asset: {},
        event: [],
        skill: [],
      },
    },
    special: {
      id: "special",
      data: {},
    },
  };

  for (const { card } of Object.values(deck.cards.extraSlots)) {
    const deckCard = { ...card, quantity: deck.extraSlots?.[card.code] ?? 0 };
    addCardToGrouping(groupings, "extra", deckCard);
  }

  const bonded: Card[] = [];

  for (const resolvedCard of Object.values(deck.cards.slots)) {
    const card = resolvedCard.card;
    const deckCard = { ...card, quantity: deck.slots[card.code] };

    // ignore deck limit slots should always go to special, as it can contain duplicate cards of normal slots.
    //example: Ace of Rods in TCU; Parallel Agnes upgrades.
    if (
      !!deck.ignoreDeckLimitSlots?.[card.code] ||
      isSpecialCard(card, deck.cards.investigator, true)
    ) {
      addCardToGrouping(groupings, "special", deckCard);
    } else {
      addCardToGrouping(groupings, "main", deckCard);
    }

    // Collect bonded cards, filtering out duplicates.
    // These can occur when e.g. two versions of `Dream Diary` are in a deck.
    const bound = resolvedCard.relations?.bound;
    if (bound?.length) {
      for (const { card } of bound) {
        if (
          !card.code.endsWith("b") &&
          !bonded.some((c) => c.code === card.code)
        ) {
          bonded.push(card);
        }
      }
    }
  }

  for (const card of bonded) {
    addCardToGrouping(groupings, "bonded", card);
  }

  for (const { card } of Object.values(deck.cards.sideSlots)) {
    const deckCard = { ...card, quantity: deck.sideSlots?.[card.code] ?? 0 };
    addCardToGrouping(groupings, "side", deckCard);
  }

  return groupings;
}

function addCardToGrouping(
  groupings: Groupings,
  key: "main" | "special" | "bonded" | "extra" | "side",
  card: Card,
) {
  groupings[key] ??= {
    id: key,
    data: {},
  };

  const grouping = groupings[key]!.data;

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
