import { isEmpty } from "@/utils/is-empty";
import type { Card } from "../services/queries.types";
import type { Slots } from "../slices/data.types";
import type { Metadata } from "../slices/metadata.types";
import type { DecklistConfig } from "../slices/settings.types";
import {
  type GroupedCards,
  type GroupingResult,
  NONE,
  getGroupedCards,
} from "./grouping";
import { makeSortFunction } from "./sorting";
import type { ResolvedDeck } from "./types";

const SLOT_KEYS = ["slots", "sideSlots", "extraSlots", "bondedSlots"] as const;

type SlotKey = (typeof SLOT_KEYS)[number];

export type DeckGrouping = GroupedCards & {
  id: string;
  static: boolean;
  quantities: Record<string, number>;
  ignoredQuantities?: Slots | null;
};

export type Groupings = Partial<{
  [key in SlotKey]: DeckGrouping;
}>;

export function groupDeckCards(
  metadata: Metadata,
  config: DecklistConfig,
  resolvedDeck: ResolvedDeck,
) {
  const sortFunc = makeSortFunction(config.sort, metadata);

  return SLOT_KEYS.reduce<Groupings>((acc, key) => {
    const quantities = resolvedDeck[key];

    if (isEmpty(quantities)) return acc;

    const cards = Object.keys(quantities).map(
      (code) => resolvedDeck.cards[key][code].card,
    );

    const grouped = getGroupedCards(
      config.group,
      cards,
      sortFunc,
      metadata,
    ) as DeckGrouping;

    grouped.id = key;
    grouped.quantities = quantities;
    grouped.static = key === "bondedSlots";

    if (grouped.id === "slots") {
      grouped.ignoredQuantities = resolvedDeck.ignoreDeckLimitSlots;
    }

    acc[key] = grouped;
    return acc;
  }, {});
}

export function countGroupRows(grouping: DeckGrouping) {
  return grouping.data.reduce((acc, group) => acc + group.cards.length, 0);
}

export function countGroup(cards: Card[], quantities?: Record<string, number>) {
  return cards.reduce((acc, card) => acc + (quantities?.[card.code] ?? 0), 0);
}

export function resolveParents(grouping: DeckGrouping, group: GroupingResult) {
  const parents = [];
  let parent = grouping.hierarchy[group.key];

  while (parent) {
    if (!parent.parent) break;
    parent = grouping.hierarchy[parent.parent];
    parents.push(parent);
  }

  return parents.reverse();
}

export function resolveQuantities(grouping: DeckGrouping) {
  const quantities = new Map<string, number>();

  for (const group of grouping.data) {
    const quantity = countGroup(group.cards, grouping.quantities);
    quantities.set(group.key, quantity);

    const parents = resolveParents(grouping, group);

    for (const parent of parents) {
      const parentQuantity = quantities.get(parent.key) ?? 0;
      quantities.set(parent.key, parentQuantity + quantity);
    }
  }

  return quantities;
}

export function isGroupCollapsed(group: GroupingResult) {
  return (
    group.type.split("|").length > 1 &&
    group.type.endsWith("slot") &&
    group.key.endsWith(NONE) &&
    !group.key.includes("asset")
  );
}
