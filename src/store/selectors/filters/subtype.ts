import { createSelector } from "reselect";

import { Card, SubType } from "@/store/services/types";
import { StoreState } from "@/store/slices";
import { ComboboxFilter } from "@/store/slices/filters/types";
import { pass } from "@/utils/fp";

export function filterSubtypes(filterState: ComboboxFilter) {
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
  (state) => filterSubtypes(state),
);

export const selectSubtypes = createSelector(
  (state: StoreState) => state.metadata,
  (metadata) => {
    const types = Object.values(metadata.subtypes);
    types.sort((a, b) => a.name.localeCompare(b.name));
    return types;
  },
);

export const selectActiveSubtypes = createSelector(
  (state: StoreState) => state.metadata.subtypes,
  (state: StoreState) => state.filters[state.filters.cardType].subtype,
  (metadata, filters) =>
    Object.fromEntries(
      Object.entries(filters).reduce(
        (acc, [key, val]) => {
          if (val) acc.push([key, metadata[key]]);
          return acc;
        },
        [] as [string, SubType][],
      ),
    ),
);
