import { createSelector } from "reselect";

import { Card } from "@/store/graphql/types";
import { StoreState } from "@/store/slices";
import { PropertiesFilter } from "@/store/slices/filters/types";
import { LookupTables } from "@/store/slices/lookup-tables/types";
import { Filter, and } from "@/utils/fp";

function filterBonded(bondedTable: LookupTables["relations"]["bonded"]) {
  return (card: Card) => !!bondedTable[card.code];
}

function filterCustomizable(card: Card) {
  return !!card.customization_options;
}

function filterExile(card: Card) {
  return !!card.exile;
}

function filterFast(fastTable: LookupTables["properties"]["fast"]) {
  return (card: Card) => !!fastTable[card.code];
}

function filterUnique(card: Card) {
  return !!card.is_unique;
}

function filterVictory(card: Card) {
  return !!card.victory;
}

function filterSeal(sealTable: LookupTables["properties"]["seal"]) {
  return (card: Card) => !!sealTable[card.code];
}

function filterPermanent(slotTable: LookupTables["slots"]) {
  return (card: Card) => !!slotTable["Permanent"]?.[card.code];
}

function filterHealsDamage(
  healsDamageTable: LookupTables["properties"]["heals_damage"],
) {
  return (card: Card) => !!healsDamageTable[card.code];
}

function filterHealsHorror(
  healsHorrorTable: LookupTables["properties"]["heals_horror"],
) {
  return (card: Card) => !!healsHorrorTable[card.code];
}

export function filterProperties(
  filterState: PropertiesFilter,
  lookupTables: LookupTables,
) {
  const filters: Filter[] = [];

  if (filterState.bonded) {
    filters.push(filterBonded(lookupTables.relations.bonded));
  }

  if (filterState.customizable) {
    filters.push(filterCustomizable);
  }

  if (filterState.exile) {
    filters.push(filterExile);
  }

  if (filterState.fast) {
    filters.push(filterFast(lookupTables.properties.fast));
  }

  if (filterState.unique) {
    filters.push(filterUnique);
  }

  if (filterState.permanent) {
    filters.push(filterPermanent(lookupTables.slots));
  }

  if (filterState.seal) {
    filters.push(filterSeal(lookupTables.properties.seal));
  }

  if (filterState.victory) {
    filters.push(filterVictory);
  }

  if (filterState.heals_damage) {
    filters.push(filterHealsDamage(lookupTables.properties.heals_damage));
  }

  if (filterState.heals_horror) {
    filters.push(filterHealsHorror(lookupTables.properties.heals_horror));
  }

  const filter = and(filters);

  return (card: Card) => {
    return filter(card);
  };
}

export const selectPropertiesFilter = createSelector(
  (state: StoreState) => state.lookupTables,
  (state: StoreState) => state.filters[state.filters.cardType].properties,
  (lookupTables, filterState) => filterProperties(filterState, lookupTables),
);

export const selectActiveProperties = (state: StoreState) =>
  state.filters[state.filters.cardType].properties;
