import { StoreState } from "../slices";

export const selectActiveCardType = (state: StoreState) => {
  return state.filters.cardType;
};

export const selectActiveFactions = (state: StoreState) => {
  return state.filters[state.filters.cardType].faction;
};

export const selectActiveLevels = (state: StoreState) => {
  return state.filters.player.level;
};
