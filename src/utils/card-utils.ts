import type { Card } from "@/store/services/types";
import type {
  CardResolved,
  CardWithRelations,
} from "@/store/utils/card-resolver";

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

export function rewriteImageUrl(url?: string) {
  const id = url?.split("/").at(-1);
  return id ? `${import.meta.env.VITE_CARD_IMAGE_URL}/${id}` : undefined;
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
  let xp = (card.xp ?? 0) + (card.taboo_xp ?? 0);
  xp = card.exceptional ? xp * 2 : xp;
  return xp * (card.myriad ? 1 : quantity);
}

export function isCardWithRelations(
  x: CardResolved | CardWithRelations,
): x is CardWithRelations {
  return "relations" in x;
}

export function imageUrl(code: string) {
  return `${import.meta.env.VITE_CARD_IMAGE_URL}/optimized/${code}.webp`;
}

export function thumbnailUrl(code: string) {
  return `${import.meta.env.VITE_CARD_IMAGE_URL}/thumbnails/${code}.webp`;
}
