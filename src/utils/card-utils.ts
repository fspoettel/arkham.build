import type { CardWithRelations } from "@/store/lib/types";
import type { Card } from "@/store/services/queries.types";

import { SIDEWAYS_TYPE_CODES, SKILL_KEYS } from "./constants";

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

  return xp * (card.myriad ? 1 : quantity);
}

export function cardLevel(card: Card) {
  return card.customization_xp
    ? Math.round(card.customization_xp / 2)
    : card.xp;
}

export function imageUrl(code: string) {
  return `${import.meta.env.VITE_CARD_IMAGE_URL}/optimized/${code}.webp`;
}

export function thumbnailUrl(code: string) {
  return `${import.meta.env.VITE_CARD_IMAGE_URL}/thumbnails/${code}.webp`;
}

export function parseCardTextHtml(cardText: string) {
  console.time("[perf] parse_card_text_html");
  const parsed = cardText
    .replaceAll(/^\s?(-|–)/gm, `<i class="icon-bullet"></i>`)
    .replaceAll("\n", "<hr class='break'>")
    .replaceAll(/\[\[(.*?)\]\]/g, "<b><em>$1</em></b>")
    .replaceAll(/\[((?:\w|_)+?)\]/g, `<i class="icon-$1"></i>`);
  console.timeEnd("[perf] parse_card_text_html");
  return parsed;
}

export function parseCustomizationTextHtml(customizationText: string) {
  return parseCardTextHtml(customizationText).replaceAll(/□/g, "");
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
