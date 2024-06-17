import { createSelector } from "reselect";

import type { DisplayDeck } from "@/store/lib/deck-grouping";
import { groupDeckCardsByType } from "@/store/lib/deck-grouping";
import { resolveDeck } from "@/store/lib/resolve-deck";
import { SPECIAL_CARD_CODES } from "@/utils/constants";

import { applyDeckEdits } from "../lib/deck-edits";
import type { ForbiddenCardError } from "../lib/deck-validation";
import { validateDeck } from "../lib/deck-validation";
import { sortAlphabetical } from "../lib/sorting";
import type { ResolvedCard, ResolvedDeck } from "../lib/types";
import type { Card } from "../services/queries.types";
import type { StoreState } from "../slices";
import { type Slot, mapTabToSlot } from "../slices/deck-view.types";

export const selectLocalDecks = createSelector(
  (state: StoreState) => state.data,
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (data, metadata, lookupTables) => {
    console.time("[perf] select_local_decks");

    const { history } = data;

    const resolvedDecks = Object.keys(history).reduce<
      ResolvedDeck<ResolvedCard>[]
    >((acc, id) => {
      const deck = data.decks[id];

      try {
        if (deck) {
          acc.push(resolveDeck(metadata, lookupTables, deck, false));
        } else {
          console.warn(`Could not find deck ${id} in local storage.`);
        }
      } catch (err) {
        console.error(`Error resolving deck ${id}: ${err}`);
        return acc;
      }

      return acc;
    }, []);

    resolvedDecks.sort((a, b) =>
      sortAlphabetical(b.date_update, a.date_update),
    );

    console.timeEnd("[perf] select_local_decks");
    return resolvedDecks;
  },
);

export const selectResolvedDeck = createSelector(
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (state: StoreState) => state.data.decks,
  (state: StoreState) => state.deckView,
  (metadata, lookupTables, decks, deckView) => {
    if (!deckView || !decks[deckView.id]) return undefined;

    console.time("[perf] select_resolved_deck");

    const deck = applyDeckEdits(decks[deckView.id], deckView, metadata);
    const resolvedDeck = resolveDeck(metadata, lookupTables, deck, true);

    console.timeEnd("[perf] select_resolved_deck");
    return resolvedDeck;
  },
);

export const selectActiveDeck = createSelector(
  selectResolvedDeck,
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (state: StoreState) => state.settings.collection,
  (state: StoreState) => state.settings.showAllCards,
  (resolvedDeck, metadata, lookupTables, collectionSetting, showAll) => {
    if (!resolvedDeck) return undefined;

    const displayDeck = resolvedDeck as DisplayDeck;
    const { groupings, bonded, ownershipCounts } = groupDeckCardsByType(
      resolvedDeck,
      metadata,
      lookupTables,
      collectionSetting,
      showAll,
    );

    displayDeck.ownershipCounts = ownershipCounts;
    displayDeck.groups = groupings;

    displayDeck.bondedSlots = bonded.reduce<Record<string, number>>(
      (acc, curr) => {
        acc[curr.code] = curr.quantity;
        return acc;
      },
      {},
    );

    return displayDeck;
  },
);

export const selectDeckValid = createSelector(
  selectResolvedDeck,
  (state: StoreState) => state.lookupTables,
  (state: StoreState) => state.metadata,
  (deck, lookupTables, metadata) =>
    deck
      ? validateDeck(deck, { lookupTables, metadata } as StoreState)
      : { valid: false, errors: [] },
);

export const selectCanEditDeck = (state: StoreState) =>
  state.deckView?.mode === "edit";

export const selectForbiddenCards = createSelector(
  selectDeckValid,
  (deckValidation) => {
    const forbidden = deckValidation.errors.find((x) => x.type === "FORBIDDEN");
    if (!forbidden) return [];
    return (forbidden as ForbiddenCardError).details;
  },
);

export function selectCardQuantitiesForSlot(
  state: StoreState,
  slot: Slot | "bondedSlots",
) {
  if (!state.deckView) return undefined;

  const activeDeck = selectActiveDeck(state);
  if (!activeDeck) return undefined;

  return activeDeck[slot];
}

export function selectCardQuantities(state: StoreState) {
  if (!state.deckView) return undefined;

  const slot =
    state.deckView.mode === "view"
      ? "slots"
      : mapTabToSlot(state.deckView.activeTab);

  return selectCardQuantitiesForSlot(state, slot) ?? undefined;
}

export const selectCurrentTab = (state: StoreState) => {
  if (!state.deckView || state.deckView.mode === "view") return "slots";
  return state.deckView.activeTab;
};

export const selectShowIgnoreDeckLimitSlots = (
  state: StoreState,
  card: Card,
) => {
  const activeDeck = selectActiveDeck(state);
  if (!activeDeck) return false;

  const traits = card.real_traits ?? "";
  const investigator = activeDeck.investigatorBack.card.code;

  return (
    // cards that are already ignored.
    !!activeDeck.ignoreDeckLimitSlots?.[card.code] ||
    // parallel agnes & spells
    (investigator === SPECIAL_CARD_CODES.PARALLEL_AGNES &&
      traits.includes("Spell")) ||
    // parallel skids & gambit / fortune
    (investigator === SPECIAL_CARD_CODES.PARALLEL_SKIDS &&
      (traits.includes("Gambit") || traits.includes("Fortunes"))) ||
    // ace of rods
    card.code === SPECIAL_CARD_CODES.ACE_OF_RODS
  );
};
