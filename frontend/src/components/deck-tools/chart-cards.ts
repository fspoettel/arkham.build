import type { Card, FactionName, SkillIcon } from "@arkham-build/shared";
import type { ResolvedDeck } from "@/store/lib/types";
import { splitMultiValue } from "@/utils/card-utils";

export type ChartCardFilter =
  | { type: "cost"; value: number }
  | { type: "faction"; value: FactionName }
  | { type: "skill"; value: SkillIcon }
  | { type: "trait"; value: string };

export type ChartSelection = ChartCardFilter & { title: string };

export function matchesChartFilter(card: Card, filter: ChartCardFilter) {
  switch (filter.type) {
    case "cost":
      return (
        typeof card.cost === "number" &&
        card.cost >= 0 &&
        Math.min(card.cost, 7) === filter.value
      );
    case "faction":
      return [
        card.faction_code,
        card.faction2_code,
        card.faction3_code,
      ].includes(filter.value);
    case "skill":
      return (card[filter.value] ?? 0) > 0;
    case "trait":
      return splitMultiValue(card.real_traits).includes(filter.value);
  }
}

export function getChartCards(deck: ResolvedDeck, filter: ChartCardFilter) {
  return Object.values(deck.cards.slots)
    .map(({ card }) => card)
    .filter(
      (card) => deck.slots[card.code] > 0 && matchesChartFilter(card, filter),
    );
}
