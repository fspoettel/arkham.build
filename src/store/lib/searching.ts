import type { Card } from "@/store/services/queries.types";
import uFuzzy from "@leeoniya/ufuzzy";
import normalizeDiacritics from "normalize-text";
import type { Search } from "../slices/lists.types";
import type { Metadata } from "../slices/metadata.types";

/**
 * When searching, the maximum distance between two parts of the search to be considered a match.
 * This makes search like `+1 [willpower]` work (for the most part).
 * 18 chars to accomodate "[...] at a skill test [...]".
 */
const MATCHING_MAX_TOKEN_DISTANCE = 18;

function prepareCardFace(card: Card, search: Search) {
  const needle: string[] = [];

  if (search.includeName) {
    if (card.real_name) needle.push(card.real_name);
    if (card.real_subname) needle.push(card.real_subname);
  }

  if (search.includeGameText) {
    if (card.real_traits) needle.push(card.real_traits);
    if (card.real_text) needle.push(card.real_text);
    if (card.real_customization_text) {
      needle.push(card.real_customization_text);
    }
  }

  if (search.includeFlavor) {
    if (card.real_flavor) needle.push(card.real_flavor);
  }

  return needle.join("|");
}

function prepareCardBack(card: Card, search: Search) {
  const needle = [];

  if (search.includeName) {
    needle.push(card.real_back_name);
  }

  if (search.includeGameText) {
    if (card.real_back_traits) needle.push(card.real_back_traits);
    if (card.real_back_text) needle.push(card.real_back_text);
  }

  if (search.includeFlavor && card.real_back_flavor) {
    needle.push(card.real_back_flavor);
  }

  return needle.join("|");
}

export function applySearch(
  search: Search,
  cards: Card[],
  metadata: Metadata,
): Card[] {
  const uf = new uFuzzy({
    intraMode: 0,
    interIns: MATCHING_MAX_TOKEN_DISTANCE,
  });

  const searchCards = cards.map((card) => {
    let content = prepareCardFace(card, search);

    if (search.includeBacks && card.real_back_text) {
      content += prepareCardBack(card, search);
    } else if (search.includeBacks && card.back_link_id) {
      const back = metadata.cards[card.back_link_id];
      if (back) content += prepareCardFace(back, search);
    }

    return normalizeDiacritics(content);
  });

  const normalizedSearchTerm = normalizeDiacritics(search.value);

  const results = uf.search(
    searchCards,
    prepareNeedle(normalizedSearchTerm),
    0,
  );

  if (!results?.[0]) return cards;

  const matches = results[0].reduce<Record<string, boolean>>((acc, curr) => {
    acc[curr] = true;
    return acc;
  }, {});

  return cards.filter((_, i) => matches[i]);
}

function prepareNeedle(needle: string): string {
  return needle.replaceAll(/((?:\+|-)\d+)/g, `"$1"`);
}
