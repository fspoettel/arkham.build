import { createSelector } from "reselect";

import { Card } from "@/store/services/types";
import { StoreState } from "@/store/slices";
import { MultiselectFilter } from "@/store/slices/filters/types";
import { LookupTables } from "@/store/slices/lookup-tables/types";
import { Filter, or } from "@/utils/fp";

export function filterActions(
  filterState: MultiselectFilter["value"],
  actionTable: LookupTables["actions"],
) {
  const filters: Filter[] = [];

  Object.entries(filterState).forEach(([key, value]) => {
    if (value) filters.push((c: Card) => !!actionTable[key][c.code]);
  });

  const filter = or(filters);
  return (card: Card) => filter(card);
}

export const selectActionsFilter = createSelector(
  (state: StoreState) => state.lookupTables.actions,
  (state: StoreState) => state.filters[state.filters.cardType].action,
  (actionTable, filterState) => filterActions(filterState.value, actionTable),
);

export const selectOptions = createSelector(
  (state: StoreState) => state.lookupTables.actions,
  (actionTable) => {
    const actions = Object.keys(actionTable).map((code) => ({ code }));
    actions.sort((a, b) => a.code.localeCompare(b.code));
    return actions;
  },
);

export const selectValue = createSelector(
  (state: StoreState) => state.filters[state.filters.cardType].action.value,
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
    return i === 0 ? curr.code : `${acc}, ${curr.code}`;
  }, "");
});

export const selectOpen = createSelector(
  (state: StoreState) => state.filters[state.filters.cardType].action,
  (filterState) => filterState.open,
);
