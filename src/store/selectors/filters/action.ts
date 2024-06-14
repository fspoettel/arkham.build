import { createSelector } from "reselect";

import { Card } from "@/store/services/types";
import { StoreState } from "@/store/slices";
import { ComboboxFilter } from "@/store/slices/filters/types";
import { LookupTables } from "@/store/slices/lookup-tables/types";
import { Filter, or } from "@/utils/fp";

export function filterActions(
  filterState: ComboboxFilter,
  actionTable: LookupTables["actions"],
) {
  const filters: Filter[] = [];

  Object.entries(filterState).forEach(([key, value]) => {
    if (value) filters.push((c: Card) => !!actionTable[key][c.code]);
  });

  const filter = or(filters);

  return (card: Card) => {
    return filter(card);
  };
}

export const selectActionsFilter = createSelector(
  (state: StoreState) => state.lookupTables.actions,
  (state: StoreState) => state.filters[state.filters.cardType].action,
  (actionTable, filterState) => filterActions(filterState, actionTable),
);

export const selectActions = createSelector(
  (state: StoreState) => state.lookupTables.actions,
  (actionTable) => {
    const actions = Object.keys(actionTable).map((code) => ({ code }));
    actions.sort((a, b) => a.code.localeCompare(b.code));
    return actions;
  },
);

export const selectActiveActions = createSelector(
  (state: StoreState) => state.filters[state.filters.cardType].action,
  (filters) =>
    Object.fromEntries(
      Object.entries(filters).reduce(
        (acc, [key, val]) => {
          if (val) acc.push([key, { code: key }]);
          return acc;
        },
        [] as [string, { code: string }][],
      ),
    ),
);
