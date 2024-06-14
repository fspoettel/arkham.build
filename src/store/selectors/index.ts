import { StoreState } from "../slices";

export const selectIsInitialized = (state: StoreState) => {
  return !!Object.keys(state.metadata.cards).length;
};
