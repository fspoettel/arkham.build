import { createSelector } from "reselect";

import { Card, SubType } from "@/store/services/types";
import { StoreState } from "@/store/slices";
import { ComboboxFilter } from "@/store/slices/filters/types";
import { pass } from "@/utils/fp";

export function filterSubtypes(filterState: ComboboxFilter["value"]) {
  const enabledTypeCodes = Object.entries(filterState)
    .filter(([, v]) => !!v)
    .map(([k]) => k);

  if (!enabledTypeCodes.length) return pass;

  return (card: Card) => {
    return !!card.subtype_code && filterState[card.subtype_code];
  };
}

export const selectSubtypeFilter = createSelector(
  (state: StoreState) => state.filters[state.filters.cardType].subtype,
  (state) => filterSubtypes(state.value),
);

export const selectOptions = createSelector(
  (state: StoreState) => state.metadata,
  (metadata) => {
    const types = Object.values(metadata.subtypes);
    types.sort((a, b) => a.name.localeCompare(b.name));
    return types;
  },
);

export const selectValue = createSelector(
  (state: StoreState) => state.metadata.subtypes,
  (state: StoreState) => state.filters[state.filters.cardType].subtype.value,
  (metadata, filters) =>
    Object.fromEntries(
      Object.entries(filters).reduce<[string, SubType][]>((acc, [key, val]) => {
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
  (state: StoreState) => state.filters[state.filters.cardType].subtype,
  (filterState) => filterState.open,
);
