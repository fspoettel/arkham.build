import { createSelector } from "reselect";

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

export const selectCardOwnedCount = createSelector(
  (state) => state.metadata,
  (state) => state.lookupTables,
  (state) => state.settings.collection,
  (metadata, lookupTables, collectionSetting) => {
    return (card: Card) => {
      return ownedCardCount(card, metadata, lookupTables, collectionSetting);
    };
  },
);

export const selectNeedsConfirmation = (state: StoreState) => {
  if (state.deckView?.mode === "edit" && state.deckView.dirty) {
    return "This operation will revert the changes made to the deck. Do you want to continue?";
  }

  return undefined;
};
