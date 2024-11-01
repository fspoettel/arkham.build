import { assert } from "@/utils/assert";
import type { PlayerType } from "@/utils/constants";
import type { Card } from "../services/queries.types";
import type { LookupTables } from "../slices/lookup-tables.types";
import type { Metadata } from "../slices/metadata.types";
import type { ResolvedDeck } from "./types";

export type Grouping = {
  [K in Exclude<PlayerType, "asset">]?: Card[];
} & {
  asset?: Record<string, Card[]>;
  event?: Card[];
  skill?: Card[];
};

export type NamedGrouping = {
  id: string;
  data: Grouping;
};

export type Groupings = {
  slots: NamedGrouping;
  sideSlots?: NamedGrouping;
  bondedSlots?: NamedGrouping;
  extraSlots?: NamedGrouping;
  exileSlots?: NamedGrouping;
};

function groupDeckCardsByType(
  metadata: Metadata,
  lookupTables: LookupTables,
  deck: ResolvedDeck,
) {
  const groupings: Groupings = {
    slots: {
      id: "main",
      data: {
        asset: {},
        event: [],
        skill: [],
      },
    },
  };

  for (const { card } of Object.values(deck.cards.extraSlots)) {
    const deckCard = { ...card, quantity: deck.extraSlots?.[card.code] ?? 0 };
    addCardToGrouping(groupings, "extraSlots", deckCard);
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

    addCardToGrouping(groupings, "slots", card);

    // Collect bonded cards, filtering out duplicates.
    // These can occur when e.g. two versions of `Dream Diary` are in a deck.
    const bound = Object.keys(
      lookupTables.relations.bound[card.code] ?? {},
    ).map((code) => metadata.cards[code]);

    if (bound?.length) {
      for (const card of bound) {
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
    addCardToGrouping(groupings, "bondedSlots", card);
  }

  for (const { card } of Object.values(deck.cards.sideSlots)) {
    const deckCard = { ...card, quantity: deck.sideSlots?.[card.code] ?? 0 };
    addCardToGrouping(groupings, "sideSlots", deckCard);
  }

  return { groupings, bonded };
}

function addCardToGrouping(
  groupings: Groupings,
  key: "slots" | "bondedSlots" | "extraSlots" | "sideSlots",
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

export function addGroupingsToDeck(
  metadata: Metadata,
  lookupTables: LookupTables,
  resolvedDeck: ResolvedDeck,
) {
  const { groupings, bonded } = groupDeckCardsByType(
    metadata,
    lookupTables,
    resolvedDeck,
  );

  resolvedDeck.groups = groupings;

  resolvedDeck.bondedSlots = bonded.reduce<Record<string, number>>(
    (acc, curr) => {
      acc[curr.code] = curr.quantity;
      return acc;
    },
    {},
  );
}
