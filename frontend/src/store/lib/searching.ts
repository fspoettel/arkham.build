import type { Card } from "@arkham-build/shared";
import {
  matchingAttribute,
  splitCommaSeparatedValue,
} from "@/utils/card-utils";
import { prepareNeedle, prepareSearchText } from "@/utils/fuzzy";
import i18n from "@/utils/i18n";
import type { Search } from "../slices/lists.types";
import type { Metadata } from "../slices/metadata.types";

export type SearchFields = Pick<
  Search,
  "includeName" | "includeGameText" | "includeFlavor" | "includeBacks"
>;
type SearchLabels = { victory: string; vengeance: string };

function prepareCardFace(
  card: Card,
  search: SearchFields,
  language: string,
  labels: SearchLabels,
) {
  const needle: string[] = [];

  if (search.includeName) {
    if (card.real_name) {
      needle.push(...searchableAttribute(card, "name", language));
    }
    if (card.real_subname) {
      needle.push(...searchableAttribute(card, "subname", language));
    }
    needle.push(...splitCommaSeparatedValue(card.abbreviation));
  }

  if (search.includeGameText) {
    if (card.real_traits) {
      needle.push(...searchableAttribute(card, "traits", language));
    }
    if (card.real_text) {
      needle.push(...searchableAttribute(card, "text", language));
    }
    if (card.real_customization_text) {
      needle.push(...searchableAttribute(card, "customization_text", language));
    }
    if (card.victory != null) {
      needle.push(`${labels.victory} ${card.victory}.`);
    }
    if (card.vengeance != null) {
      needle.push(`${labels.vengeance} ${card.vengeance}.`);
    }
  }

  if (search.includeFlavor) {
    if (card.real_flavor)
      needle.push(...searchableAttribute(card, "flavor", language));
  }

  return needle;
}

function prepareCardBack(card: Card, search: SearchFields, language: string) {
  const needle = [];

  if (search.includeName) {
    needle.push(...searchableAttribute(card, "back_name", language));
    if (card.back_subname || (language !== "en" && card.real_back_subname)) {
      needle.push(...searchableAttribute(card, "back_subname", language));
    }
  }

  if (search.includeGameText) {
    if (card.real_back_traits) {
      needle.push(...searchableAttribute(card, "back_traits", language));
    }
    if (card.real_back_text)
      needle.push(...searchableAttribute(card, "back_text", language));
  }

  if (search.includeFlavor && card.real_back_flavor) {
    needle.push(...searchableAttribute(card, "back_flavor", language));
  }

  return needle;
}

function searchableAttribute(
  card: Card,
  key: Parameters<typeof matchingAttribute>[1],
  language: string,
): string[] {
  const value = matchingAttribute(card, key, language);
  return Array.isArray(value) ? value : [value];
}

function prepareCardContent(
  card: Card,
  search: SearchFields,
  metadata: Metadata,
  language: string,
  labels: SearchLabels,
) {
  const content = prepareCardFace(card, search, language, labels);

  if (search.includeBacks && !card.back_link_id) {
    content.push(...prepareCardBack(card, search, language));
  } else if (search.includeBacks && card.back_link_id) {
    const back = metadata.cards[card.back_link_id];
    if (back) content.push(...prepareCardFace(back, search, language, labels));
  }
  return content;
}

export function prepareSearchContent(
  cards: Card[],
  metadata: Metadata,
  fields: SearchFields,
  language: string,
  labels: SearchLabels,
): ReadonlyMap<Card, string[]> {
  return new Map(
    cards.map((card) => [
      card,
      prepareCardContent(card, fields, metadata, language, labels).map(
        prepareSearchText,
      ),
    ]),
  );
}

export function applySearch(
  search: Search,
  cards: Card[],
  metadata: Metadata,
  preparedContent?: ReadonlyMap<Card, string[]>,
): Card[] {
  if (metadata.cards[search.value]) {
    return cards.filter(
      (card) => card.id === search.value || card.back_link_id === search.value,
    );
  }
  const needle = prepareNeedle(search.value);
  if (!needle) return cards;
  const content =
    preparedContent ??
    prepareSearchContent(cards, metadata, search, i18n.language, {
      victory: i18n.t("common.victory"),
      vengeance: i18n.t("common.vengeance"),
    });
  return cards.filter((card) =>
    content.get(card)?.some((part) => needle.test(part)),
  );
}
