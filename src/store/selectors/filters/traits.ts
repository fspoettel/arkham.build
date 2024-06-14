import { createSelector } from "reselect";

import { Card } from "@/store/services/types";
import { StoreState } from "@/store/slices";
import { ComboboxFilter } from "@/store/slices/filters/types";
import { LookupTables } from "@/store/slices/lookup-tables/types";
import { Filter, or } from "@/utils/fp";

import { selectActiveCardType } from "./shared";

export function filterTraits(
  filterState: ComboboxFilter,
  traitTable: LookupTables["traits"],
) {
  const filters: Filter[] = [];

  Object.entries(filterState).forEach(([key, value]) => {
    if (value) filters.push((c: Card) => !!traitTable[key][c.code]);
  });

  const filter = or(filters);

  return (card: Card) => {
    return filter(card);
  };
}

export const selectTraitsFilter = createSelector(
  (state: StoreState) => state.lookupTables.traits,
  (state: StoreState) => state.filters[state.filters.cardType].trait,
  (traitsTable, filterState) => filterTraits(filterState, traitsTable),
);

export const selectTraits = createSelector(
  selectActiveCardType,
  (state: StoreState) => state.lookupTables.traitsByCardTypeSeletion,
  (cardType, traitTable) => {
    const types = Object.keys(traitTable[cardType]).map((code) => ({ code }));
    types.sort((a, b) => a.code.localeCompare(b.code));
    return types;
  },
);

export const selectActiveTraits = createSelector(
  (state: StoreState) => state.filters[state.filters.cardType].trait,
  (filters) =>
    Object.fromEntries(
      Object.entries(filters).reduce<[string, { code: string }][]>(
        (acc, [key, val]) => {
          if (val) acc.push([key, { code: key }]);
          return acc;
        },
        [],
      ),
    ),
);
