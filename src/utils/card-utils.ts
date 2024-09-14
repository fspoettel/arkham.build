import type { CardWithRelations } from "@/store/lib/types";
import type { Card } from "@/store/services/queries.types";

import {
  CARDS_WITH_LOCAL_IMAGES,
  SIDEWAYS_TYPE_CODES,
  SKILL_KEYS,
} from "./constants";

export function splitMultiValue(s?: string) {
  if (!s) return [];
  return s.split(".").reduce<string[]>((acc, curr) => {
    const s = curr.trim();
    if (s) acc.push(s);
    return acc;
  }, []);
}

export function hasSkillIcons(card: Card) {
  return SKILL_KEYS.some((key) => card[`skill_${key}`]);
}

export function getCardColor(card: Card, prop = "color") {
  return card.faction2_code
    ? `${prop}-multiclass`
    : `${prop}-${card.faction_code}`;
}

export function sideways(card: Card) {
  return SIDEWAYS_TYPE_CODES.includes(card.type_code);
}

export function reversed(card: Card) {
  return (
    card.double_sided &&
    card.type_code === "location" &&
    !card.back_link_id &&
    card.encounter_code
  );
}

export function countExperience(card: Card, quantity: number) {
  if (card.customization_xp) return card.customization_xp;

  let xp = card.xp ?? 0;
  if (card.exceptional) xp *= 2;
  if (card.taboo_xp) xp += card.taboo_xp;

  return xp * (card.myriad ? Math.min(quantity, 1) : quantity);
}

export function cardLevel(card: Card) {
  return card.customization_xp
    ? Math.round(card.customization_xp / 2)
    : card.xp;
}

/**
 * Get the "real" card level after applying taboo.
 * For the sake of deckbuilding, cards keep their original level + an xp change.
 * However, for the sake of XP calculations and interactions such as "Adaptable",
 * cards should be considered their updated level in the spirit of the taboo.
 * This prevents weirdness such as Adaptable being able to swap in Drawing Thin for free.
 */
export function realCardLevel(card: Card) {
  const level = cardLevel(card);
  if (level == null) return level;
  return level + (card.taboo_xp ?? 0);
}

export function imageUrl(code: string) {
  return `${import.meta.env.VITE_CARD_IMAGE_URL}/optimized/${code}.avif`;
}

export function thumbnailUrl(code: string) {
  return `${import.meta.env.VITE_CARD_IMAGE_URL}/thumbnails/${code}.avif`;
}

export function parseCardTextHtml(cardText: string) {
  const parsed = cardText
    .replaceAll(/^\s?(-|–)/gm, `<i class="icon-bullet"></i>`)
    .replaceAll("\n", "<hr class='break'>")
    .replaceAll(/\[\[(.*?)\]\]/g, "<b><em>$1</em></b>")
    .replaceAll(/\[((?:\w|_)+?)\]/g, `<i class="icon-$1"></i>`);
  return parsed;
}

export function parseCustomizationTextHtml(customizationText: string) {
  return parseCardTextHtml(customizationText).replaceAll(/□/g, "");
}

export function decodeExileSlots(s: string | null | undefined) {
  const ids = s?.split(",").filter((x) => x);
  if (!ids?.length) return {};

  return (
    ids.reduce<Record<string, number>>((acc, curr) => {
      acc[curr] ??= 0;
      acc[curr] += 1;
      return acc;
    }, {}) ?? {}
  );
}

export function isSpecialCard(
  card: Card,
  investigator: CardWithRelations,
  ignorePermanent = false,
) {
  const isSpecial =
    card.encounter_code ||
    card.subtype_code ||
    investigator.relations?.advanced?.some((x) => x.card.code === card.code) ||
    investigator.relations?.parallelCards?.some(
      (x) => x.card.code === card.code,
    ) ||
    investigator.relations?.replacement?.some(
      (x) => x.card.code === card.code,
    ) ||
    investigator.relations?.requiredCards?.some(
      (x) => x.card.code === card.code,
    );

  return !!isSpecial || !!(card.permanent && !ignorePermanent);
}

export function hasImage(card: Card) {
  return card.imageurl || CARDS_WITH_LOCAL_IMAGES.includes(card.code);
}

export function getCanonicalCardCode(card: Card) {
  return card.duplicate_of_code ?? card.alternate_of_code ?? card.code;
}
