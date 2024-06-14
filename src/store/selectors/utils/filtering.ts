import { Card } from "@/store/graphql/types";

type Filter = (c: Card) => boolean;

export function and(fns: Filter[]) {
  return (card: Card) => fns.every((f) => f(card));
}

export function or(fns: Filter[]) {
  return (card: Card) => !fns.length || fns.some((f) => f(card));
}

export function filterWeaknesses(card: Card) {
  return !card.subtype_code;
}

export function filterPlayerCard(card: Card) {
  return (
    !card.alt_art_investigator && // filter novellas && parallel investigators
    !card.duplicate_of_code && // filter revised_code. TODO: we will have to handle revised core.
    !card.encounter_code // filter out encounter cards (story player cards).
  );
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

export function filterExceptional(val: boolean) {
  return (card: Card) => !!card.exceptional === val;
}

export function filterLevel(value: [number, number] | undefined) {
  return (card: Card) => {
    if (!value) return true;
    return card.xp != null && card.xp >= value[0] && card.xp <= value[1];
  };
}

export function filterCost(
  value: [number, number] | undefined,
  evenCost: boolean,
  oddCost: boolean,
  xCost: boolean,
) {
  return (card: Card) => {
    const filters = [];

    if (value) {
      filters.push((c: Card) => {
        return c.cost != null && c.cost >= value[0] && c.cost <= value[1];
      });
    }

    const moduloFilters = [];
    if (evenCost) {
      moduloFilters.push((c: Card) => c.cost != null && c.cost % 2 === 0);
    }

    if (oddCost) {
      moduloFilters.push((c: Card) => c.cost != null && c.cost % 2 !== 0);
    }

    filters.push(or(moduloFilters));

    return or([(c: Card) => xCost && c.cost === -2, and(filters)])(card);
  };
}
