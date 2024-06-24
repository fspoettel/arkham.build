import { createSelector } from "reselect";

import { SPECIAL_CARD_CODES } from "@/utils/constants";

import { applyDeckEdits } from "../lib/deck-edits";
import type { DisplayDeck } from "../lib/deck-grouping";
import { groupDeckCardsByType } from "../lib/deck-grouping";
import type { ForbiddenCardError } from "../lib/deck-validation";
import { validateDeck } from "../lib/deck-validation";
import { resolveDeck } from "../lib/resolve-deck";
import type { Card } from "../services/queries.types";
import type { StoreState } from "../slices";
import type { Id } from "../slices/data.types";

export const selectResolvedDeckById = createSelector(
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (state: StoreState, deckId?: Id) =>
    deckId ? state.data.decks[deckId] : undefined,
  (state: StoreState, deckId?: Id, applyEdits?: boolean) =>
    deckId && applyEdits ? state.deckEdits?.[deckId] : undefined,
  (metadata, lookupTables, deck, edits) => {
    if (!deck) return undefined;

    console.time("[perf] select_resolved_deck");

    const resolvedDeck = resolveDeck(
      metadata,
      lookupTables,
      edits ? applyDeckEdits(deck, edits, metadata) : deck,
      true,
    );
    console.timeEnd("[perf] select_resolved_deck");

    return resolvedDeck;
  },
);

export const selectActiveDeckById = createSelector(
  (state: StoreState, id: Id, applyEdits?: boolean) =>
    selectResolvedDeckById(state, id, applyEdits),
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (state: StoreState) => state.settings.collection,
  (state: StoreState) => state.settings.showAllCards,
  (resolvedDeck, metadata, lookupTables, collectionSetting, showAllSetting) => {
    if (!resolvedDeck) return undefined;

    const displayDeck = resolvedDeck as DisplayDeck;
    const { groupings, bonded, ownershipCounts } = groupDeckCardsByType(
      resolvedDeck,
      metadata,
      lookupTables,
      collectionSetting,
      showAllSetting,
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

export const selectDeckValidById = createSelector(
  (state: StoreState, id: Id, applyDeckEdits?: boolean) =>
    selectResolvedDeckById(state, id, applyDeckEdits),
  (state: StoreState) => state.lookupTables,
  (state: StoreState) => state.metadata,
  (deck, lookupTables, metadata) => {
    return deck
      ? validateDeck(deck, { lookupTables, metadata } as StoreState)
      : { valid: false, errors: [] };
  },
);

export const selectForbiddenCardsById = createSelector(
  selectDeckValidById,
  (deckValidation) => {
    const forbidden = deckValidation.errors.find((x) => x.type === "FORBIDDEN");
    if (!forbidden) return [];
    return (forbidden as ForbiddenCardError).details;
  },
);

export const selectShowIgnoreDeckLimitSlotsById = createSelector(
  selectActiveDeckById,
  (_: StoreState, __: Id, ___: boolean | undefined, card: Card) => card,
  (deck, card) => {
    if (!deck) return false;

    const traits = card.real_traits ?? "";
    const investigator = deck.investigatorBack.card.code;

    return (
      // cards that are already ignored.
      !!deck.ignoreDeckLimitSlots?.[card.code] ||
      // parallel agnes & spells
      (investigator === SPECIAL_CARD_CODES.PARALLEL_AGNES &&
        traits.includes("Spell")) ||
      // parallel skids & gambit / fortune
      (investigator === SPECIAL_CARD_CODES.PARALLEL_SKIDS &&
        (traits.includes("Gambit") || traits.includes("Fortunes"))) ||
      // ace of rods
      card.code === SPECIAL_CARD_CODES.ACE_OF_RODS
    );
  },
);
