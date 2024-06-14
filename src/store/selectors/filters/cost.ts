import { createSelector } from "reselect";

import { Card } from "@/store/graphql/types";
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
  return (card: Card) => {
    return xCost && card.cost === -2;
  };
}

function filterCardCost(value: [number, number] | undefined) {
  if (!value) return pass;

  return (card: Card) => {
    return card.cost != null && card.cost >= value[0] && card.cost <= value[1];
  };
}

function filterCost(filterState: CostFilter) {
  if (!filterState.value) return pass;

  // apply level range if provided. `0-5` is assumed, null-costed cards are excluded.
  const filters = [filterCardCost(filterState.value)];

  // apply even / odd filters
  const moduloFilters = [];
  if (filterState.even) moduloFilters.push(filterEvenCost);
  if (filterState.odd) moduloFilters.push(filterOddCost);
  filters.push(or(moduloFilters));

  const filter = or([filterXCost(filterState.x), and(filters)]);

  return (card: Card) => {
    return filter(card);
  };
}

export const selectCostFilter = createSelector(
  (state: StoreState) => state.filters[state.filters.cardType].cost,
  (filterState) => (filterState.value ? filterCost(filterState) : undefined),
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

export const selectActiveCost = (state: StoreState) =>
  state.filters[state.filters.cardType].cost;
