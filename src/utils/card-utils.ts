import type {
  Card,
  DeckRequirements,
  DeckRestrictions,
  QueryCard,
} from "@/store/services/queries.types";
import {
  SIDEWAYS_TYPE_CODES,
  SKILL_KEYS,
  SPECIAL_CARD_CODES,
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
    isLocationLike(card) &&
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

export function parseCardTitle(title: string) {
  return title.replaceAll(/\[((?:\w|_)+?)\]/g, `<i class="icon-$1"></i>`);
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

export function isSpecialCard(card: Card, ignorePermanent = false) {
  const isSpecial = card.encounter_code || card.subtype_code || card.xp == null;

  return !!isSpecial || !!(card.permanent && !ignorePermanent);
}

export function isEnemyLike(card: Card) {
  return !!(card.enemy_damage || card.enemy_horror);
}

export function isLocationLike(card: Card) {
  return !!(card.shroud || card.clues || card.clues_fixed);
}

export function hasImage(card: Card) {
  return card.code !== SPECIAL_CARD_CODES.RANDOM_BASIC_WEAKNESS;
}

export function getCanonicalCardCode(card: Card) {
  return card.duplicate_of_code ?? card.alternate_of_code ?? card.code;
}

export function isRandomBasicWeaknessLike(card: Card) {
  return (
    card.subtype_code === "basicweakness" ||
    (card.subtype_code === "weakness" &&
      !card.encounter_code &&
      !card.restrictions)
  );
}

/**
 * A static investigator is one that can not build decks. (Y'thian, Lost Homunculus)
 */
export function isStaticInvestigator(card: Card) {
  return card.type_code === "investigator" && !card.deck_options;
}

export function cardLimit(card: Card, limitOverride?: number) {
  return limitOverride ?? card.deck_limit ?? card.quantity;
}

// biome-ignore lint/suspicious/noExplicitAny: safe, we control the data.
export function formatLocalCard(card: Record<string, any>): QueryCard {
  return {
    ...card,
    back_link_id: card.back_link,
    id: card.code,
    exceptional: card.text?.includes("Exceptional."),
    myriad: card.text?.includes("Myriad."),
    preview: true,
    official: true,
    real_flavor: card.flavor,
    real_name: card.name,
    real_text: card.text,
    real_traits: card.traits,
    real_subname: card.subname,
    real_slot: card.slot,
    real_back_flavor: card.back_flavor,
    real_back_text: card.back_text,
    real_back_name: card.back_name,
    real_back_traits: card.back_traits,
    pack_position: card.position,
    deck_requirements: decodeDeckRequirements(card.deck_requirements),
    restrictions: decodeRestrictions(card.restrictions),
  } as QueryCard;
}

function decodeRestrictions(str: string): DeckRestrictions | undefined {
  return str?.split(", ").reduce((acc: DeckRestrictions, curr: string) => {
    const key = curr.substring(0, curr.indexOf(":"));
    const val = curr.substring(curr.indexOf(":") + 1);

    if (key === "investigator") {
      acc.investigator ??= {};
      acc.investigator[val] = { [val]: val };
    }

    if (key === "trait") {
      acc.trait ??= [];
      acc.trait.push(val);
    }

    return acc;
  }, {} as DeckRestrictions);
}

function decodeDeckRequirements(str: string): DeckRequirements | undefined {
  return str?.split(", ").reduce((acc: DeckRequirements, curr: string) => {
    const key = curr.substring(0, curr.indexOf(":"));
    const val = curr.substring(curr.indexOf(":") + 1);

    if (key === "size") {
      acc.size = Number.parseInt(val, 10);
    }

    if (key === "random") {
      const [target, value] = val.split(":");
      acc.random ??= [];
      acc.random.push({ target, value });
    }

    if (key === "card") {
      acc.card ??= {};
      acc.card[val] = { [val]: val };
    }

    return acc;
  }, {} as DeckRequirements);
}
