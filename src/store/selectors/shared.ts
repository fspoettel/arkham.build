import { createSelector } from "reselect";
import { ownedCardCount } from "../lib/card-ownership";
import type { ResolvedDeck } from "../lib/types";
import type { Card } from "../services/queries.types";
import type { StoreState } from "../slices";
import { selectSettings } from "./settings";

export const selectClientId = (state: StoreState) => {
  return state.app.clientId;
};

export const selectIsInitialized = (state: StoreState) => {
  return state.ui.initialized;
};

export const selectCanCheckOwnership = (state: StoreState) =>
  !selectSettings(state).showAllCards;

export const selectCardOwnedCount = createSelector(
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  selectSettings,
  (metadata, lookupTables, settings) => {
    const { collection, showAllCards } = settings;

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
  (state: StoreState) => state.remoting,
  (remoting) => {
    return remoting.sync || remoting.arkhamdb
      ? "Another ArkhamDB operation is in progress, please wait..."
      : undefined;
  },
);

export const selectConnectionLockForDeck = createSelector(
  selectConnectionLock,
  (_: StoreState, deck: ResolvedDeck) => deck,
  (remoting, deck) => {
    return remoting && deck.source === "arkhamdb" ? remoting : undefined;
  },
);
