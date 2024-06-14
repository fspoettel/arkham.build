import uFuzzy from "@leeoniya/ufuzzy";

import { Card } from "@/store/graphql/types";

import { Metadata } from "../slices/metadata/types";
import { SearchState } from "../slices/search/types";

function prepareCardFront(card: Card, search: SearchState["search"]) {
  let content = `|${card.real_name}`;

  if (card.real_subname) content += `|${card.real_subname}`;

  if (search.includeGameText) {
    if (card.real_traits) content += `|${card.real_traits}`;
    if (card.real_text) content += `|${card.real_text}`;
  }

  if (search.includeFlavor) {
    if (card.real_flavor) content += `|${card.real_flavor}`;
  }

  return content;
}

function prepareCardBack(card: Card, search: SearchState["search"]) {
  let content = `|${card.real_back_name}`;
  if (search.includeGameText)
    if (card.real_back_text) content += `|${card.real_back_text}`;
  if (search.includeFlavor && card.real_back_flavor)
    content += `|${card.real_back_flavor}`;
  return content;
}

export function applySearch(
  search: SearchState["search"],
  cards: Card[],
  metadata: Metadata,
): Card[] {
  if (!search) return cards;

  const uf = new uFuzzy();

  const searchCards = cards.map((card) => {
    let content = prepareCardFront(card, search);
    // TODO: handle linked cards.
    if (search.includeBacks && card.real_back_name) {
      content += prepareCardBack(card, search);
    } else if (search.includeBacks && card.back_link_id) {
      const back = metadata.cards[card.back_link_id];
      if (back) content += prepareCardFront(back, search);
    }

    return content;
  });

  const results = uf.search(searchCards, search.value, 1);

  if (!results?.[0]) return cards;

  const matches = results[0].reduce(
    (acc, curr) => {
      acc[curr] = true;
      return acc;
    },
    {} as Record<string, boolean>,
  );

  return cards.filter((_, i) => matches[i]);
}
