import { ownedCardCount } from "../lib/card-ownership";
import type { Card } from "../services/queries.types";
import type { StoreState } from "../slices";

export const selectIsInitialized = (state: StoreState) => {
  return state.ui.initialized;
};

export const selectCanCheckOwnership = (state: StoreState) => {
  return (
    !state.settings.showAllCards &&
    Object.values(state.settings.collection).filter((x) => x).length > 0
  );
};

export const selectCardOwnedCount = (state: StoreState) => {
  return (card: Card) => {
    return ownedCardCount(
      card,
      state.metadata,
      state.lookupTables,
      state.settings.collection,
    );
  };
};
