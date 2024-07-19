import { createSelector } from "reselect";

import { ownedCardCount } from "../lib/card-ownership";
import type { Card } from "../services/queries.types";
import type { StoreState } from "../slices";

export const selectClientId = (state: StoreState) => {
  return state.app.clientId;
};

export const selectIsInitialized = (state: StoreState) => {
  return state.ui.initialized;
};

export const selectCanCheckOwnership = (state: StoreState) =>
  !state.settings.showAllCards;

export const selectCardOwnedCount = createSelector(
  (state) => state.metadata,
  (state) => state.lookupTables,
  (state) => state.settings.collection,
  (state) => state.settings.showAllCards,
  (metadata, lookupTables, collection, showAllCards) => {
    return (card: Card) => {
      return ownedCardCount(
        card,
        metadata,
        lookupTables,
        collection,
        showAllCards,
      );
    };
  },
);
