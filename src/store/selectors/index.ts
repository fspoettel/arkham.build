import type { StoreState } from "../slices";

export const selectIsInitialized = (state: StoreState) => {
  return state.ui.initialized;
};
