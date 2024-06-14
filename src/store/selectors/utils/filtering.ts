import { Card } from "@/store/graphql/types";
import {
  CostFilter,
  LevelFilter,
  SkillIconsFilter,
  TypeFilter,
} from "@/store/slices/filters/types";
import { SKILL_KEYS, SkillKey } from "@/utils/constants";

type Filter = (c: Card) => boolean;

export function and(fns: Filter[]) {
  return (card: Card) => !fns.length || fns.every((f) => f(card));
}

export function or(fns: Filter[]) {
  return (card: Card) => !fns.length || fns.some((f) => f(card));
}

export function filterWeaknesses(card: Card) {
  return !card.subtype_code;
}

export function filterDuplicates(card: Card) {
  return (
    !card.alt_art_investigator && // filter novellas && parallel investigators
    !card.duplicate_of_code // filter revised_code. TODO: we will have to handle revised core.
  );
}

export function filterEncounterCards(card: Card) {
  return !card.encounter_code; // filter out encounter cards (story player cards).
}

export function filterBacksides(card: Card) {
  return !card.linked;
}

export function filterFactions(factions: string[]) {
  return (card: Card) => {
    if (!factions.length) return true;

    if (factions.length === 1 && factions[0] === "multiclass") {
      return !!card.faction2_code;
    }

    return (
      factions.includes(card.faction_code) ||
      (!!card.faction2_code && factions.includes(card.faction2_code)) ||
      (!!card.faction3_code && factions.includes(card.faction3_code))
    );
  };
}

function filterEvenCost(card: Card) {
  return card.cost != null && card.cost % 2 === 0;
}

function filterOddCost(card: Card) {
  return card.cost != null && card.cost % 2 !== 0;
}

function filterXCost(xCost: boolean) {
  return (card: Card) => {
    return xCost && card.cost === -2;
  };
}

export function filterCardCost(value: [number, number] | undefined) {
  return (card: Card) => {
    if (!value) return true;
    return card.cost != null && card.cost >= value[0] && card.cost <= value[1];
  };
}

export function filterCost(cost: CostFilter) {
  // apply level range if provided. `0-5` is assumed, null-costed cards are excluded.
  const filters = [filterCardCost(cost.value)];

  // apply even / odd filters
  const moduloFilters = [];
  if (cost.even) moduloFilters.push(filterEvenCost);
  if (cost.odd) moduloFilters.push(filterOddCost);
  filters.push(or(moduloFilters));

  const filter = or([filterXCost(cost.x), and(filters)]);

  return (card: Card) => {
    if (!cost.value) return true;
    return filter(card);
  };
}

function filterExceptional(card: Card) {
  return !!card.exceptional;
}

function filterNonexceptional(card: Card) {
  return !card.exceptional;
}

function filterCardLevel(value: [number, number] | undefined) {
  return (card: Card) => {
    if (!value) return true;
    return card.xp != null && card.xp >= value[0] && card.xp <= value[1];
  };
}

export function filterLevel(level: LevelFilter) {
  const filters = [];

  if (level.value) {
    filters.push(filterCardLevel(level.value));
  }

  if (level.exceptional !== level.nonexceptional) {
    if (level.exceptional) {
      filters.push(filterExceptional);
    } else {
      filters.push(filterNonexceptional);
    }
  }

  const filter = and(filters);

  return (card: Card) => {
    if (!level.value) return true;
    return filter(card);
  };
}

function filterSkill(skill: SkillKey, amount: number) {
  return (card: Card) =>
    card.type_code !== "investigator" &&
    (card[`skill_${skill}`] ?? 0) >= amount;
}

export function filterSkillIcons(skillIcons: SkillIconsFilter) {
  const iconFilter: Filter[] = [];
  const anyFilter: Filter[] = [];

  const anyV = skillIcons.any;

  SKILL_KEYS.forEach((skill) => {
    const v = skillIcons[skill];
    if (v) {
      iconFilter.push(filterSkill(skill, v));
    }

    if (anyV) {
      anyFilter.push(filterSkill(skill, anyV));
    }
  });

  const filter = anyFilter.length
    ? and([or(anyFilter), and(iconFilter)])
    : and(iconFilter);

  return (card: Card) => {
    return filter(card);
  };
}

export function filterTypes(filter: TypeFilter) {
  return (card: Card) => {
    const enabledTypeCodes = Object.entries(filter)
      .filter(([, v]) => !!v)
      .map(([k]) => k);
    if (!enabledTypeCodes.length) return true;

    return filter[card.type_code];
  };
}
