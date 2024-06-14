import { createSelector } from "reselect";

import { Card, Type } from "@/store/services/types";
import { StoreState } from "@/store/slices";
import { ComboboxFilter } from "@/store/slices/filters/types";
import { pass } from "@/utils/fp";

import { selectActiveCardType } from "./shared";

export function filterType(filterState: ComboboxFilter["value"]) {
  const enabledTypeCodes = Object.entries(filterState)
    .filter(([, v]) => !!v)
    .map(([k]) => k);

  if (!enabledTypeCodes.length) return pass;
  return (card: Card) => filterState[card.type_code];
}

export const selectTypeFilter = createSelector(
  (state: StoreState) => state.filters[state.filters.cardType].type,
  (filterState) => filterType(filterState.value),
);

export const selectOptions = createSelector(
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

export const selectValue = createSelector(
  (state: StoreState) => state.metadata.types,
  (state: StoreState) => state.filters[state.filters.cardType].type.value,
  (metadata, filters) =>
    Object.fromEntries(
      Object.entries(filters).reduce<[string, Type][]>((acc, [key, val]) => {
        if (val) acc.push([key, metadata[key]]);
        return acc;
      }, []),
    ),
);

export const selectChanges = createSelector(selectValue, (value) => {
  return Object.values(value).reduce((acc, curr, i) => {
    return i === 0 ? curr.name : `${acc}, ${curr.name}`;
  }, "");
});

export const selectOpen = createSelector(
  (state: StoreState) => state.filters[state.filters.cardType].type,
  (filterState) => filterState.open,
);
