import { createSelector } from "reselect";

import { Card } from "@/store/services/types";
import { StoreState } from "@/store/slices";
import { LevelFilter } from "@/store/slices/filters/types";
import { and, pass } from "@/utils/fp";

function filterExceptional(card: Card) {
  return !!card.exceptional;
}

function filterNonexceptional(card: Card) {
  return !card.exceptional;
}

export function filterCardLevel(value: [number, number] | undefined) {
  if (!value) return pass;

  return (card: Card) => {
    return card.xp != null && card.xp >= value[0] && card.xp <= value[1];
  };
}

function filterLevel(filterState: LevelFilter["value"]) {
  if (!filterState.range) return pass;

  const filters = [];

  if (filterState.range) {
    filters.push(filterCardLevel(filterState.range));
  }

  if (filterState.exceptional !== filterState.nonexceptional) {
    if (filterState.exceptional) {
      filters.push(filterExceptional);
    } else {
      filters.push(filterNonexceptional);
    }
  }

  const filter = and(filters);

  return (card: Card) => {
    return filter(card);
  };
}

export const selectLevelFilter = createSelector(
  (state: StoreState) => state.filters.player.level.value,
  (filterState) => (filterState.range ? filterLevel(filterState) : undefined),
);

export const selectValue = (state: StoreState) =>
  state.filters.player.level.value;

export const selectChanges = createSelector(selectValue, (value) => {
  if (!value.range) return undefined;
  let s = `${value.range[0]}-${value.range[1]}`;
  if (value.exceptional) s = `${s}, exceptional`;
  if (value.nonexceptional) s = `${s}, nonexceptional`;
  return s;
});

export const selectOpen = createSelector(
  (state: StoreState) => state.filters.player.level,
  (filterState) => filterState.open,
);
