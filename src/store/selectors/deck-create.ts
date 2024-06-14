import { assert } from "@/utils/assert";
import { SPECIAL_CARD_CODES } from "@/utils/constants";

import { ownedCardCount } from "../lib/card-ownership";
import { resolveCardWithRelations } from "../lib/resolve-card";
import type { ResolvedCard } from "../lib/types";
import type { Card } from "../services/queries.types";
import type { StoreState } from "../slices";

export const selectDeckCreateChecked = (state: StoreState) => {
  const deckCreate = state.deckCreate;
  assert(deckCreate, "DeckCreate slice must be initialized.");
  return deckCreate;
};

export const selectDeckCreateInvestigator = (state: StoreState) => {
  const deckCreate = selectDeckCreateChecked(state);

  const resolvedCard = resolveCardWithRelations(
    state.metadata,
    state.lookupTables,
    deckCreate.investigatorCode,
    deckCreate.tabooSetId,
    undefined,
    true,
  );

  assert(resolvedCard, "Investigator card must be resolved.");
  return resolvedCard;
};

export const selectDeckCreateInvestigatorFront = (state: StoreState) => {
  const deckCreate = selectDeckCreateChecked(state);

  const resolvedCard = resolveCardWithRelations(
    state.metadata,
    state.lookupTables,
    deckCreate.investigatorFrontCode,
    deckCreate.tabooSetId,
    undefined,
    true,
  );

  assert(resolvedCard, "Investigator front card must be resolved.");
  return resolvedCard;
};

export const selectDeckCreateInvestigatorBack = (state: StoreState) => {
  const deckCreate = selectDeckCreateChecked(state);

  const resolvedCard = resolveCardWithRelations(
    state.metadata,
    state.lookupTables,
    deckCreate.investigatorBackCode,
    deckCreate.tabooSetId,
    undefined,
    true,
  );

  assert(resolvedCard, "Investigator back card must be resolved.");
  return resolvedCard;
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

type CardSet = {
  cards: ResolvedCard[];
  id: string;
  quantities: Record<string, number>;
  quantitiesSettable?: boolean;
  static?: boolean;
  title: string;
};

export const selectDeckCreateCardSets = (state: StoreState) => {
  const deckCreate = selectDeckCreateChecked(state);

  const groupings: CardSet[] = [];

  const investigator = selectDeckCreateInvestigator(state);
  const { relations } = investigator;

  const deckSizeRequirement = investigator.card.deck_requirements?.size ?? 30;

  const hasDeckSizeOption = investigator.card.deck_options?.find((o) =>
    Array.isArray(o.deck_size_select),
  );

  if (relations?.requiredCards) {
    groupings.push({
      id: "required",
      cards: relations.requiredCards,
      title: "Required cards",
      quantities: relations.requiredCards.reduce(
        (acc, { card }) => {
          let quantity = card.quantity;

          if (card.code === SPECIAL_CARD_CODES.OCCULT_EVIDENCE) {
            const deckSizeSelection = deckCreate.selections.deck_size_selected;

            const deckSize = hasDeckSizeOption
              ? deckSizeSelection
                ? +deckSizeSelection
                : deckSizeRequirement
              : deckSizeRequirement;

            quantity = (deckSize - 20) / 10;
          }

          acc[card.code] = quantity;
          return acc;
        },
        {} as Record<string, number>,
      ),
    });
  }

  if (relations?.advanced) {
    groupings.push({
      id: "advanced",
      title: "Advanced cards",
      cards: relations.advanced,
      quantities: relations.advanced.reduce(
        (acc, { card }) => {
          acc[card.code] = card.quantity;
          return acc;
        },
        {} as Record<string, number>,
      ),
    });
  }

  if (relations?.replacement) {
    groupings.push({
      id: "replacement",
      title: "Replacements",
      cards: relations.replacement,
      quantities: relations.replacement.reduce(
        (acc, { card }) => {
          acc[card.code] = card.quantity;
          return acc;
        },
        {} as Record<string, number>,
      ),
    });
  }

  if (
    relations?.parallelCards &&
    (deckCreate.investigatorBackCode === SPECIAL_CARD_CODES.PARALLEL_JIM ||
      deckCreate.investigatorFrontCode === SPECIAL_CARD_CODES.PARALLEL_WENDY ||
      deckCreate.investigatorFrontCode === SPECIAL_CARD_CODES.PARALLEL_ROLAND)
  ) {
    const quantitiesSettable =
      deckCreate.investigatorFrontCode === SPECIAL_CARD_CODES.PARALLEL_ROLAND;

    groupings.push({
      id: "extra",
      title: "Special cards",
      cards: relations.parallelCards,
      quantities: relations.parallelCards.reduce(
        (acc, { card }) => {
          acc[card.code] =
            deckCreate.extraCardQuantities[card.code] ?? card.quantity;
          return acc;
        },
        {} as Record<string, number>,
      ),
      quantitiesSettable,
      static: true,
    });
  }

  if (relations?.bound) {
    groupings.push({
      id: "bound",
      title: "Bound",
      cards: relations.bound,
      quantities: relations.bound.reduce(
        (acc, { card }) => {
          acc[card.code] = card.quantity;
          return acc;
        },
        {} as Record<string, number>,
      ),
      static: true,
    });
  }

  return groupings;
};
