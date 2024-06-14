import { createSelector } from "reselect";

import { Card } from "@/store/services/types";
import { StoreState } from "@/store/slices";

export function filterTabooSet(tabooSetId: number | null) {
  if (!tabooSetId) return undefined;
  return (card: Card) => card.taboo_set_id === tabooSetId;
}

export const selectCanonicalTabooSetId = createSelector(
  (state: StoreState) => state.filters.player.tabooSet.value,
  (state: StoreState) => state.settings.tabooSetId,
  (filterId, settingId) => filterId ?? settingId,
);

export const selectTabooSetFilter = createSelector(
  (state: StoreState) => state.filters.player.tabooSet,
  (filterState) =>
    filterState.value ? filterTabooSet(filterState.value) : undefined,
);

export const selectOptions = (state: StoreState) => {
  const sets = Object.values(state.metadata.tabooSets);
  sets.sort((a, b) => b.date.localeCompare(a.date));
  return sets;
};

export const selectValue = (state: StoreState) => {
  return state.filters.player.tabooSet.value;
};

export const selectChanges = createSelector(
  (state: StoreState) => state.metadata,
  selectValue,
  (metadata, value) => (value ? metadata.tabooSets[value].name : ""),
);
