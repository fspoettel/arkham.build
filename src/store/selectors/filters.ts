import { StoreState } from "../slices";

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

export const selectActiveCardType = (state: StoreState) =>
  state.filters.cardType;

export const selectActiveFactions = (state: StoreState) =>
  state.filters[state.filters.cardType].faction;

export const selectActiveCost = (state: StoreState) =>
  state.filters[state.filters.cardType].cost;

export const selectActiveLevel = (state: StoreState) =>
  state.filters.player.level;
