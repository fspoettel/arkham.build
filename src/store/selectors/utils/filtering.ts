import { Card } from "@/store/graphql/types";
import {
  ComboboxFilter,
  CostFilter,
  LevelFilter,
  SkillIconsFilter,
} from "@/store/slices/filters/types";
import { LookupTables } from "@/store/slices/lookup-tables/types";
import { SKILL_KEYS, SkillKey } from "@/utils/constants";

type Filter = (c: Card) => boolean;

export function and(fns: Filter[]) {
  return (card: Card) => !fns.length || fns.every((f) => f(card));
}

export function or(fns: Filter[]) {
  return (card: Card) => !fns.length || fns.some((f) => f(card));
}

// TODO: factor out usages of this.
function pass() {
  return true;
}

export function filterWeaknesses(card: Card) {
  return !card.subtype_code;
}

export function filterDuplicates(card: Card) {
  return (
    !card.hidden && // filter hidden cards (usually backsides)
    !card.alt_art_investigator && // filter novellas && parallel investigators
    !card.duplicate_of_code // filter revised_code. TODO: we will have to handle revised core.
  );
}

export function filterEncounterCards(card: Card) {
  return !card.encounter_code; // filter out encounter cards (story player cards).
}

// needs to filter out some bad data that would otherwise end up in player cards (i.e. 04325).
export function filterMythosCards(card: Card) {
  return card.faction_code !== "mythos";
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
  if (!value) return pass;

  return (card: Card) => {
    return card.cost != null && card.cost >= value[0] && card.cost <= value[1];
  };
}

function filterExceptional(card: Card) {
  return !!card.exceptional;
}

function filterNonexceptional(card: Card) {
  return !card.exceptional;
}

function filterCardLevel(value: [number, number] | undefined) {
  if (!value) return pass;

  return (card: Card) => {
    return card.xp != null && card.xp >= value[0] && card.xp <= value[1];
  };
}

function filterSkill(skill: SkillKey, amount: number) {
  return (card: Card) =>
    card.type_code !== "investigator" &&
    (card[`skill_${skill}`] ?? 0) >= amount;
}

export function filterSkillIcons(filterState: SkillIconsFilter) {
  const iconFilter: Filter[] = [];
  const anyFilter: Filter[] = [];

  const anyV = filterState.any;

  SKILL_KEYS.forEach((skill) => {
    const v = filterState[skill];
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

export function filterCost(filterState: CostFilter) {
  if (!filterState.value) return pass;

  // apply level range if provided. `0-5` is assumed, null-costed cards are excluded.
  const filters = [filterCardCost(filterState.value)];

  // apply even / odd filters
  const moduloFilters = [];
  if (filterState.even) moduloFilters.push(filterEvenCost);
  if (filterState.odd) moduloFilters.push(filterOddCost);
  filters.push(or(moduloFilters));

  const filter = or([filterXCost(filterState.x), and(filters)]);

  return (card: Card) => {
    return filter(card);
  };
}

export function filterLevel(filterState: LevelFilter) {
  if (!filterState.value) return pass;

  const filters = [];

  if (filterState.value) {
    filters.push(filterCardLevel(filterState.value));
  }

  if (filterState.exceptional !== filterState.nonexceptional) {
    if (filterState.exceptional) {
      filters.push(filterExceptional);
    } else {
      filters.push(filterNonexceptional);
    }
  }

  const filter = and(filters);

  return (card: Card) => {
    return filter(card);
  };
}

export function filterTypes(filterState: ComboboxFilter) {
  const enabledTypeCodes = Object.entries(filterState)
    .filter(([, v]) => !!v)
    .map(([k]) => k);

  if (!enabledTypeCodes.length) return pass;

  return (card: Card) => {
    return filterState[card.type_code];
  };
}

export function filterSubtypes(filterState: ComboboxFilter) {
  const enabledTypeCodes = Object.entries(filterState)
    .filter(([, v]) => !!v)
    .map(([k]) => k);

  if (!enabledTypeCodes.length) return pass;

  return (card: Card) => {
    return !!card.subtype_code && filterState[card.subtype_code];
  };
}

export function filterTraits(
  filterState: ComboboxFilter,
  traitMap: LookupTables["traits"],
) {
  const filters: Filter[] = [];

  Object.entries(filterState).forEach(([key, value]) => {
    if (value) filters.push((c: Card) => !!traitMap[key][c.code]);
  });

  const filter = or(filters);

  return (card: Card) => {
    return filter(card);
  };
}

export function filterActions(
  filterState: ComboboxFilter,
  actionMap: LookupTables["actions"],
) {
  const filters: Filter[] = [];

  Object.entries(filterState).forEach(([key, value]) => {
    if (value) filters.push((c: Card) => !!actionMap[key][c.code]);
  });

  const filter = or(filters);

  return (card: Card) => {
    return filter(card);
  };
}
