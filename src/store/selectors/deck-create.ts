import { assert } from "@/utils/assert";
import { SPECIAL_CARD_CODES } from "@/utils/constants";
import { formatRelationTitle } from "@/utils/formatting";

import { resolveCardWithRelations } from "../lib/resolve-card";
import type { CardSet, ResolvedCard } from "../lib/types";
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

export const selectDeckCreateCardSets = (state: StoreState) => {
  const deckCreate = selectDeckCreateChecked(state);

  const back = selectDeckCreateInvestigatorBack(state);

  const groupings: CardSet[] = [
    {
      id: "random_basic_weakness",
      title: "Random basic weakness",
      canSelect: false,
      selected: true,
      cards: [
        resolveCardWithRelations(
          state.metadata,
          state.lookupTables,
          SPECIAL_CARD_CODES.RANDOM_BASIC_WEAKNESS,
          undefined,
        ) as ResolvedCard,
      ],
      quantities: {
        [SPECIAL_CARD_CODES.RANDOM_BASIC_WEAKNESS]:
          back.card.deck_requirements?.random.length ?? 1,
      },
    },
  ];

  const investigator = selectDeckCreateInvestigator(state);
  const { relations } = investigator;

  const deckSizeRequirement = investigator.card.deck_requirements?.size ?? 30;

  const hasDeckSizeOption = investigator.card.deck_options?.find((o) =>
    Array.isArray(o.deck_size_select),
  );

  if (relations?.requiredCards) {
    groupings.push({
      id: "requiredCards",
      canSelect: true,
      cards: relations.requiredCards,
      title: formatRelationTitle("requiredCards"),
      selected: deckCreate.sets.includes("requiredCards"),
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
      title: formatRelationTitle("advanced"),
      canSelect: true,
      cards: relations.advanced,
      selected: deckCreate.sets.includes("advanced"),
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
      title: formatRelationTitle("replacement"),
      canSelect: true,
      cards: relations.replacement,
      selected: deckCreate.sets.includes("replacement"),
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
    groupings.push({
      id: "extra",
      title: "Special cards",
      cards: relations.parallelCards,
      canSetQuantity:
        deckCreate.investigatorFrontCode === SPECIAL_CARD_CODES.PARALLEL_ROLAND,
      canSelect: false,
      selected: true,
      quantities: relations.parallelCards.reduce(
        (acc, { card }) => {
          acc[card.code] =
            deckCreate.extraCardQuantities[card.code] ?? card.quantity;
          return acc;
        },
        {} as Record<string, number>,
      ),
    });
  }

  if (relations?.bound) {
    groupings.push({
      id: "bound",
      title: formatRelationTitle("bound"),
      canSelect: false,
      selected: false,
      cards: relations.bound,
      quantities: relations.bound.reduce(
        (acc, { card }) => {
          acc[card.code] = card.quantity;
          return acc;
        },
        {} as Record<string, number>,
      ),
    });
  }

  return groupings;
};
