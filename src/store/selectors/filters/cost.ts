import { createSelector } from "reselect";

import { Card } from "@/store/services/types";
import { StoreState } from "@/store/slices";
import { CostFilter } from "@/store/slices/filters/types";
import { and, or, pass } from "@/utils/fp";

function filterEvenCost(card: Card) {
  return card.cost != null && card.cost % 2 === 0;
}

function filterOddCost(card: Card) {
  return card.cost != null && card.cost % 2 !== 0;
}

function filterXCost(xCost: boolean) {
  return (card: Card) => xCost && card.cost === -2;
}

function filterCardCost(value: [number, number] | undefined) {
  if (!value) return pass;

  return (card: Card) =>
    card.cost != null && card.cost >= value[0] && card.cost <= value[1];
}

function filterCost(filterState: CostFilter["value"]) {
  // apply level range if provided. `0-5` is assumed, null-costed cards are excluded.
  const filters = [filterCardCost(filterState.range)];

  // apply even / odd filters
  const moduloFilters = [];
  if (filterState.even) moduloFilters.push(filterEvenCost);
  if (filterState.odd) moduloFilters.push(filterOddCost);
  filters.push(or(moduloFilters));

  const filter = or([filterXCost(filterState.x), and(filters)]);
  return (card: Card) => filter(card);
}

export const selectCostFilter = createSelector(
  (state: StoreState) => state.filters[state.filters.cardType].cost.value,
  (filterState) => (filterState.range ? filterCost(filterState) : undefined),
);

export function selectCostMinMax(state: StoreState) {
  const costs = Object.keys(state.lookupTables.cost).map((x) =>
    Number.parseInt(x, 10),
  );

  if (costs.length < 2) {
    throw new TypeError(
      "selector {selectCostMinMax} expects store to contain metadata.",
    );
  }

  costs.sort((a, b) => a - b);

  const min = 0; // arkhamdb data has some cards set to negative values.
  const max = costs[costs.length - 1];
  return [min, max];
}

export const selectValue = (state: StoreState) =>
  state.filters[state.filters.cardType].cost.value;

export const selectChanges = createSelector(selectValue, (val) => {
  if (!val.range) return "";
  let s = `${val.range[0]}`;
  if (val.range[1] !== val.range[0]) s = `${s}-${val.range[1]}`;
  if (val.even) s = `${s}, even`;
  if (val.odd) s = `${s}, odd`;
  if (val.x) s = `${s}, X`;
  return s;
});

export const selectOpen = createSelector(
  (state: StoreState) => state.filters[state.filters.cardType].cost,
  (filterState) => filterState.open,
);
