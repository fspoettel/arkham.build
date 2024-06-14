import { Card } from "@/store/graphql/types";
import { PARALLEL_INVESTIGATORS, SKILL_KEYS } from "./constants";

/**
 * Split multi value card properties. expected format: `Item. Tool.`
 */
export function splitMultiValue(s?: string) {
  return (s ?? "")
    .split(".")
    .map((s) => s.trim())
    .filter((s) => s);
}

export function hasSkillIcons(card: Card) {
  return SKILL_KEYS.some((key) => card[`skill_${key}`]);
}

/**
 * Check if a card is a parallel front/back.
 */
export function isParallel(code: string) {
  return Object.values(PARALLEL_INVESTIGATORS).includes(code);
}

/**
 * Check if a card has parallel front/back.
 */
export function hasParallel(code: string) {
  return PARALLEL_INVESTIGATORS[code] != null;
}

/**
 * Check if a card is a player card (= can be entered into an investigator deck).
 */
export function isPlayerCard(card: Card) {
  return (
    card.faction_code !== "mythos" && // enounter deck
    card.pack_code !== "zbh_00008" // barkham horror.
  );
}

export function getCardColor(card: Card) {
  return card.faction2_code ? `color-multiclass` : `color-${card.faction_code}`;
}

export function rewriteImageUrl(url?: string) {
  const id = url?.split("/").at(-1);
  return id ? `${import.meta.env.VITE_CARD_IMAGE_URL}/${id}` : undefined;
}
