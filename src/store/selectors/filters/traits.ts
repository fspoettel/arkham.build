import { createSelector } from "reselect";

import type { Card } from "@/store/services/types";
import type { StoreState } from "@/store/slices";
import type { MultiselectFilter } from "@/store/slices/filters/types";
import type { LookupTables } from "@/store/slices/lookup-tables/types";
import type { Filter } from "@/utils/fp";
import { or } from "@/utils/fp";

import { selectActiveCardType } from "./shared";

export function filterTraits(
  filterState: MultiselectFilter["value"],
  traitTable: LookupTables["traits"],
) {
  const filters: Filter[] = [];

  for (const [key, value] of Object.entries(filterState)) {
    if (value) filters.push((c: Card) => !!traitTable[key][c.code]);
  }

  const filter = or(filters);
  return (card: Card) => filter(card);
}

export const selectTraitsFilter = createSelector(
  (state: StoreState) => state.lookupTables.traits,
  (state: StoreState) => state.filters[state.filters.cardType].trait,
  (traitsTable, filterState) => filterTraits(filterState.value, traitsTable),
);

export const selectOptions = createSelector(
  selectActiveCardType,
  (state: StoreState) => state.lookupTables.traitsByCardTypeSeletion,
  (cardType, traitTable) => {
    const types = Object.keys(traitTable[cardType]).map((code) => ({ code }));
    types.sort((a, b) => a.code.localeCompare(b.code));
    return types;
  },
);

export const selectValue = createSelector(
  (state: StoreState) => state.filters[state.filters.cardType].trait.value,
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

export const selectChanges = createSelector(selectValue, (value) => {
  return Object.values(value).reduce((acc, curr, i) => {
    return i === 0 ? curr.code : `${acc} or ${curr.code}`;
  }, "");
});

export const selectOpen = createSelector(
  (state: StoreState) => state.filters[state.filters.cardType].trait,
  (filterState) => filterState.open,
);
