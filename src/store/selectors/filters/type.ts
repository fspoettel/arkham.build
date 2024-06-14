import { createSelector } from "reselect";

import { Card, Type } from "@/store/services/types";
import { StoreState } from "@/store/slices";
import { ComboboxFilter } from "@/store/slices/filters/types";
import { pass } from "@/utils/fp";

import { selectActiveCardType } from "./shared";

export function filterType(filterState: ComboboxFilter) {
  const enabledTypeCodes = Object.entries(filterState)
    .filter(([, v]) => !!v)
    .map(([k]) => k);

  if (!enabledTypeCodes.length) return pass;

  return (card: Card) => {
    return filterState[card.type_code];
  };
}

export const selectTypeFilter = createSelector(
  (state: StoreState) => state.filters[state.filters.cardType].type,
  (filterState) => filterType(filterState),
);

export const selectTypes = createSelector(
  selectActiveCardType,
  (state: StoreState) => state.metadata.types,
  (state: StoreState) => state.lookupTables,
  (cardType, typeTable, lookupTables) => {
    const types = Object.keys(
      lookupTables.typesByCardTypeSelection[cardType],
    ).map((type) => typeTable[type]);
    types.sort((a, b) => a.name.localeCompare(b.name));
    return types;
  },
);

export const selectActiveTypes = createSelector(
  (state: StoreState) => state.metadata.types,
  (state: StoreState) => state.filters[state.filters.cardType].type,
  (metadata, filters) =>
    Object.fromEntries(
      Object.entries(filters).reduce(
        (acc, [key, val]) => {
          if (val) acc.push([key, metadata[key]]);
          return acc;
        },
        [] as [string, Type][],
      ),
    ),
);
