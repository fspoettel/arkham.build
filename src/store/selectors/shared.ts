import { createSelector } from "reselect";
import { ownedCardCount } from "../lib/card-ownership";
import type { ResolvedDeck } from "../lib/types";
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

export const selectConnectionLock = createSelector(
  (state: StoreState) => state.locks,
  (locks) => {
    return locks.sync || locks.arkhamdb
      ? "Another ArkhamDB operation is in progress, please wait..."
      : undefined;
  },
);

export const selectConnectionLockForDeck = createSelector(
  selectConnectionLock,
  (_: StoreState, deck: ResolvedDeck) => deck,
  (lock, deck) => {
    return lock && deck.source === "arkhamdb" ? lock : undefined;
  },
);
