import type { Card } from "../services/queries.types";
import type { Deck } from "../slices/data.types";
import type {
  DeckInclusionCountTable,
  DeckInclusionTable,
} from "../slices/lookup-tables.types";
import type { ResolvedDeck } from "./types";

function mean(values: number[]) {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function standardDeviation(values: number[]) {
  const avg = mean(values);
  const squareDiffs = values.map((value) => (value - avg) ** 2);
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(avgSquareDiff);
}

// See https://en.wikipedia.org/wiki/Standard_score
export function zScore(
  values: number[],
  value: number,
): number | "no data" | "only this investigator" {
  const sum = values.reduce((a, b) => a + b, 0);
  // Card is not included in decks for any other investigator
  if (sum === 0) {
    if (value === 0) {
      return "no data";
    }
    return "only this investigator";
  }
  return (value - mean(values)) / standardDeviation(values);
}

export type Recommendation = {
  card: Card;
  recommendation: number;
  ordering: number;
  message: string;
};

function findInclusionsOfCardForInvestigator(
  card: Card,
  deckInclusions: DeckInclusionTable,
  sideDeckInclusions: DeckInclusionTable,
  decksForInvestigator: Record<string, Deck>,
  includeSideDeck: boolean,
): string[] {
  const onlyThisInvestigator = (deckCode: string) =>
    decksForInvestigator[deckCode] !== undefined;
  let ret: string[] = [];
  if (deckInclusions[card.code]) {
    ret = Object.keys(deckInclusions[card.code]).filter(onlyThisInvestigator);
  }
  if (includeSideDeck && sideDeckInclusions[card.code]) {
    ret = ret.concat(
      Object.keys(sideDeckInclusions[card.code]).filter(onlyThisInvestigator),
    );
  }
  return ret;
}

function findInclusionsOfCardForOtherInvestigators(
  card: Card,
  resolvedDeck: ResolvedDeck,
  countsByInvestigator: DeckInclusionCountTable,
  sideCountsByInvestigator: DeckInclusionCountTable,
  includeSideDeck: boolean,
) {
  const ret: Record<string, number> = {};
  for (const investigator of Object.keys(countsByInvestigator)) {
    if (investigator === resolvedDeck.investigator_code) {
      continue;
    }
    ret[investigator] = countsByInvestigator[investigator][card.code] || 0;
  }
  if (includeSideDeck) {
    for (const investigator of Object.keys(sideCountsByInvestigator)) {
      if (investigator === resolvedDeck.investigator_code) {
        continue;
      }
      ret[investigator] +=
        sideCountsByInvestigator[investigator][card.code] || 0;
    }
  }
  return ret;
}

function getDecksForInvestigator(
  decklists: Deck[],
  investigatorCode: string,
): Record<string, Deck> {
  return Object.values(decklists)
    .filter((deck) => deck.investigator_code === investigatorCode)
    .reduce<Record<string, Deck>>((acc, deck) => {
      acc[deck.id] = deck;
      return acc;
    }, {});
}

export function getNumberOfDecksForInvestigator(
  decklists: Deck[],
  investigatorCode: string,
): number {
  return Object.values(decklists).filter(
    (deck) => deck.investigator_code === investigatorCode,
  ).length;
}

export function computeRecommendationForCard(
  card: Card,
  resolvedDeck: ResolvedDeck,
  decklists: Deck[],
  deckInclusions: DeckInclusionTable,
  sideDeckInclusions: DeckInclusionTable,
  countsByInvestigator: DeckInclusionCountTable,
  sideCountsByInvestigator: DeckInclusionCountTable,
  includeSideDeck: boolean,
  isRelative: boolean,
): Recommendation {
  const decksForInvestigator = getDecksForInvestigator(
    decklists,
    resolvedDeck.investigator_code,
  );
  const nInclusionsForInvestigator = findInclusionsOfCardForInvestigator(
    card,
    deckInclusions,
    sideDeckInclusions,
    decksForInvestigator,
    includeSideDeck,
  ).length;

  // For relative recommendations, we calculate the Z-score of the number of inclusions for this investigator
  // compared to the number of inclusions for other investigators.
  if (isRelative) {
    const otherInclusions = findInclusionsOfCardForOtherInvestigators(
      card,
      resolvedDeck,
      countsByInvestigator,
      sideCountsByInvestigator,
      includeSideDeck,
    );
    const Z = zScore(
      Object.values(otherInclusions),
      nInclusionsForInvestigator,
    );
    switch (Z) {
      case "no data":
        return {
          card: card,
          recommendation: 0,
          ordering: 0,
          message: "No data available for this card",
        };
      case "only this investigator":
        return {
          card: card,
          recommendation: 100, // 100% recommendation
          ordering: Number.MAX_SAFE_INTEGER, // Put this card at the top of the list
          message: "This investigator is the only one using this card",
        };
      default: {
        // For purposes of recommendation, clamp Z to [-3, 3], so we can scale it to a percentage without exceeding +-100%
        const clampedZ = Math.min(6, Math.max(-6, Z));
        return {
          card: card,
          recommendation: (clampedZ / 6) * 100,
          message: `${resolvedDeck.investigator_name}'s use of this card is ${Z.toFixed(4)} standard deviations away from the mean of other investigators' uses`,
          ordering: Z, // Sort by unclamped Z-score so we can display the most extreme recommendations first, even if they're clamped
        };
      }
    }
  }

  // For absolute recommendations, we calculate the percentage of decks for this investigator that include this card
  const deckCount = Object.keys(decksForInvestigator).length;
  const recommendation = (nInclusionsForInvestigator / deckCount) * 100;
  return {
    card: card,
    recommendation: recommendation,
    message: `${Math.floor(recommendation)}% of ${resolvedDeck.investigator_name} decks (${nInclusionsForInvestigator}/${deckCount}) use this card`,
    ordering: recommendation,
  };
}
