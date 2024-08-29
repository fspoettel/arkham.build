import uFuzzy from "@leeoniya/ufuzzy";

import type { Card } from "@/store/services/queries.types";

import type { Search } from "../slices/lists.types";
import type { Metadata } from "../slices/metadata.types";

/**
 * When searching, the maximum distance between two parts of the search to be considered a match.
 * This makes search like `+1 [willpower]` work (for the most part).
 * 15 chars to accomodate "[...] an additional [...]".
 */
const MATCHING_MAX_TOKEN_DISTANCE = 15;

function prepareCardFace(card: Card, search: Search) {
  let content = `|${card.real_name}`;

  if (card.real_subname) content += `|${card.real_subname}`;

  if (search.includeGameText) {
    if (card.real_traits) content += `|${card.real_traits}`;
    if (card.real_text) content += `|${card.real_text}`;
    if (card.real_customization_text)
      content += `|${card.real_customization_text}`;
  }

  if (search.includeFlavor) {
    if (card.real_flavor) content += `|${card.real_flavor}`;
  }

  return content;
}

function prepareCardBack(card: Card, search: Search) {
  let content = `|${card.real_back_name}`;
  if (search.includeGameText)
    if (card.real_back_text) content += `|${card.real_back_text}`;
  if (search.includeFlavor && card.real_back_flavor)
    content += `|${card.real_back_flavor}`;
  return content;
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

    return content;
  });

  const results = uf.search(searchCards, prepareNeedle(search.value), 0);

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
