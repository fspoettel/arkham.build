import i18n from "@/utils/i18n";
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
      ? i18n.t("settings.connections.lock", { provider: "ArkhamDB" })
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

export const selectBackCard = createSelector(
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (_: StoreState, code: string) => code,
  (metadata, lookupTables, code) => {
    const card = metadata.cards[code];
    if (!card) return undefined;

    if (card.back_link_id) {
      return metadata.cards[card.back_link_id];
    }

    if (card.hidden) {
      const backCode = Object.keys(
        lookupTables.relations.fronts[code] ?? {},
      ).at(0);

      return backCode ? metadata.cards[backCode] : undefined;
    }

    return undefined;
  },
);
