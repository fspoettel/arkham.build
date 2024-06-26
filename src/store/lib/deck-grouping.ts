import type { PlayerType } from "@/utils/constants";

import { assert } from "@/utils/assert";
import type { Card } from "../services/queries.types";
import type { LookupTables } from "../slices/lookup-tables.types";
import type { Metadata } from "../slices/metadata.types";
import { ownedCardCount } from "./card-ownership";
import type { CardWithRelations, ResolvedDeck } from "./types";

type DeckCard = Card & {
  quantity: number;
};

export type Grouping = {
  [K in Exclude<PlayerType, "asset">]?: DeckCard[];
} & {
  asset?: Record<string, DeckCard[]>;
  event?: DeckCard[];
  skill?: DeckCard[];
};

export type NamedGrouping = {
  id: string;
  data: Grouping;
};

type Groupings = {
  main: NamedGrouping;
  side?: NamedGrouping;
  bonded?: NamedGrouping;
  extra?: NamedGrouping;
};

export type DisplayDeck = ResolvedDeck<CardWithRelations> & {
  groups: Groupings;
  ownershipCounts: Record<string, number>;
  bondedSlots: Record<string, number>;
};

export function groupDeckCardsByType(
  deck: ResolvedDeck<CardWithRelations>,
  metadata: Metadata,
  lookupTables: LookupTables,
  ownershipSetting: Record<string, number | boolean>,
  showAllSetting: boolean,
) {
  const groupings: Groupings = {
    main: {
      id: "main",
      data: {
        asset: {},
        event: [],
        skill: [],
      },
    },
  };

  const ownershipCounts: Record<string, number> = {};

  for (const { card } of Object.values(deck.cards.extraSlots)) {
    const deckCard = { ...card, quantity: deck.extraSlots?.[card.code] ?? 0 };
    addCardToGrouping(groupings, "extra", deckCard);
    addCardToOwned(
      ownershipCounts,
      deckCard,
      metadata,
      lookupTables,
      ownershipSetting,
      showAllSetting,
    );
  }

  const bonded: Card[] = [];

  const investigatorRelations = deck.investigatorFront?.relations;

  if (investigatorRelations?.bound?.length) {
    for (const { card } of investigatorRelations.bound) {
      bonded.push(card);
    }
  }

  for (const resolvedCard of Object.values(deck.cards.slots)) {
    const card = resolvedCard.card;

    addCardToOwned(
      ownershipCounts,
      card,
      metadata,
      lookupTables,
      ownershipSetting,
      showAllSetting,
    );

    addCardToGrouping(groupings, "main", card);

    // Collect bonded cards, filtering out duplicates.
    // These can occur when e.g. two versions of `Dream Diary` are in a deck.
    const bound = resolvedCard.relations?.bound;

    if (bound?.length) {
      for (const { card } of bound) {
        if (
          !card.code.endsWith("b") &&
          !bonded.some((c) => c.code === card.code) &&
          deck.slots[resolvedCard.card.code] > 0
        ) {
          bonded.push(card);
        }
      }
    }
  }

  for (const card of bonded) {
    addCardToGrouping(groupings, "bonded", card);
    addCardToOwned(
      ownershipCounts,
      card,
      metadata,
      lookupTables,
      ownershipSetting,
      showAllSetting,
    );
  }

  for (const { card } of Object.values(deck.cards.sideSlots)) {
    const deckCard = { ...card, quantity: deck.sideSlots?.[card.code] ?? 0 };
    addCardToGrouping(groupings, "side", deckCard);
    addCardToOwned(
      ownershipCounts,
      deckCard,
      metadata,
      lookupTables,
      ownershipSetting,
      showAllSetting,
    );
  }

  return { groupings, bonded, ownershipCounts };
}

function addCardToGrouping(
  groupings: Groupings,
  key: "main" | "bonded" | "extra" | "side",
  card: Card,
) {
  groupings[key] ??= {
    id: key,
    data: {},
  };

  const grouping = groupings[key]?.data;

  assert(
    grouping,
    `Tried to add card to grouping ${key} but it was not found.`,
  );

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

function addCardToOwned(
  ownershipCounts: Record<string, number>,
  card: DeckCard,
  metadata: Metadata,
  lookupTables: LookupTables,
  ownershipSetting: Record<string, number | boolean>,
  showAllSetting: boolean,
) {
  if (ownershipCounts[card.code] != null) return;

  if (showAllSetting) {
    ownershipCounts[card.code] = Math.max(card.quantity, card.deck_limit ?? 0);
    return;
  }

  ownershipCounts[card.code] = ownedCardCount(
    card,
    metadata,
    lookupTables,
    ownershipSetting,
  );
}
