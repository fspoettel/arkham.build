import { assert } from "@/utils/assert";
import { cardLimit } from "@/utils/card-utils";
import { SPECIAL_CARD_CODES } from "@/utils/constants";
import { capitalize } from "@/utils/formatting";
import type { StateCreator } from "zustand";
import type { StoreState } from ".";
import { clampAttachmentQuantity } from "../lib/attachments";
import { applyDeckEdits } from "../lib/deck-edits";
import { randomBasicWeaknessForDeck } from "../lib/random-basic-weakness";
import { getDeckLimitOverride, resolveDeck } from "../lib/resolve-deck";
import {
  selectCurrentCardQuantity,
  selectResolvedDeckById,
} from "../selectors/decks";
import type { Id } from "./data.types";
import { type DeckEditsSlice, mapTabToSlot } from "./deck-edits.types";

function currentEdits(state: StoreState, deckId: Id) {
  return state.deckEdits[deckId] ?? {};
}

export const createDeckEditsSlice: StateCreator<
  StoreState,
  [],
  [],
  DeckEditsSlice
> = (set, get) => ({
  deckEdits: {},

  discardEdits(deckId) {
    const state = get();
    const deckEdits = { ...state.deckEdits };
    delete deckEdits[deckId];
    set({ deckEdits });
  },

  updateCardQuantity(deckId, code, quantity, limit, tab, mode = "increment") {
    const state = get();

    const edits = currentEdits(state, deckId);

    const targetTab = tab || "slots";
    const slot = mapTabToSlot(targetTab);

    const deck = selectResolvedDeckById(state, deckId, true);
    assert(deck, `Tried to edit deck that does not exist: ${deckId}`);

    const current = deck[slot]?.[code] ?? 0;

    const newValue =
      mode === "increment"
        ? Math.min(Math.max(current + quantity, 0), limit)
        : Math.max(Math.min(quantity, limit), 0);

    const nextState = {
      deckEdits: {
        ...state.deckEdits,
        [deckId]: {
          ...edits,
          quantities: {
            ...edits.quantities,
            [slot]: {
              ...edits.quantities?.[slot],
              [code]: newValue,
            },
          },
        },
      },
    };

    // ensure quantity of attachments is less than quantity in deck.
    if (deck.attachments) {
      nextState.deckEdits[deckId].attachments = clampAttachmentQuantity(
        edits.attachments,
        deck.attachments,
        code,
        newValue,
      );
    }

    set(nextState);
  },
  updateTabooId(deckId, value) {
    const state = get();

    set({
      deckEdits: {
        ...state.deckEdits,
        [deckId]: {
          ...currentEdits(state, deckId),
          tabooId: value,
        },
      },
    });
  },
  updateDescription(deckId, value) {
    const state = get();

    set({
      deckEdits: {
        ...state.deckEdits,
        [deckId]: {
          ...currentEdits(state, deckId),
          description_md: value,
        },
      },
    });
  },
  updateName(deckId, value) {
    const state = get();

    set({
      deckEdits: {
        ...state.deckEdits,
        [deckId]: {
          ...currentEdits(state, deckId),
          name: value,
        },
      },
    });
  },
  updateMetaProperty(deckId, key, value) {
    const state = get();
    const edits = currentEdits(state, deckId);

    set({
      deckEdits: {
        ...state.deckEdits,
        [deckId]: {
          ...edits,
          meta: {
            ...edits.meta,
            [key]: value || null,
          },
        },
      },
    });
  },
  updateInvestigatorSide(deckId, side, code) {
    const state = get();

    set({
      deckEdits: {
        ...state.deckEdits,
        [deckId]: {
          ...currentEdits(state, deckId),
          [`investigator${capitalize(side)}`]: code,
        },
      },
    });
  },
  updateCustomization(deckId, code, index, patch) {
    const state = get();
    const edits = currentEdits(state, deckId);

    set({
      deckEdits: {
        ...state.deckEdits,
        [deckId]: {
          ...edits,
          customizations: {
            ...edits.customizations,
            [code]: {
              ...edits.customizations?.[code],
              [index]: {
                ...edits.customizations?.[code]?.[index],
                ...patch,
              },
            },
          },
        },
      },
    });
  },
  updateTags(deckId, value) {
    const state = get();

    set({
      deckEdits: {
        ...state.deckEdits,
        [deckId]: {
          ...currentEdits(state, deckId),
          tags: value,
        },
      },
    });
  },
  updateXpAdjustment(deckId, value) {
    const state = get();

    set({
      deckEdits: {
        ...state.deckEdits,
        [deckId]: {
          ...currentEdits(state, deckId),
          xpAdjustment: value,
        },
      },
    });
  },
  drawRandomBasicWeakness(deckId) {
    const state = get();

    assert(
      state.data.decks[deckId],
      "Tried to draw a random basic weakness for a deck that does not exist.",
    );

    const weakness = randomBasicWeaknessForDeck(state, deckId);
    assert(weakness, "Could not find a random basic weakness to draw.");

    const rbwQuantity = selectCurrentCardQuantity(
      state,
      deckId,
      SPECIAL_CARD_CODES.RANDOM_BASIC_WEAKNESS,
      "slots",
    );

    const weaknessQuantity = selectCurrentCardQuantity(
      state,
      deckId,
      weakness,
      "slots",
    );

    const edits = currentEdits(state, deckId);

    set({
      deckEdits: {
        ...state.deckEdits,
        [deckId]: {
          ...edits,
          quantities: {
            ...edits.quantities,
            slots: {
              ...edits.quantities?.slots,
              [SPECIAL_CARD_CODES.RANDOM_BASIC_WEAKNESS]: Math.max(
                rbwQuantity - 1,
                0,
              ),
              [weakness]: weaknessQuantity + 1,
            },
          },
        },
      },
    });
  },
  updateAttachment(deckId, targetCode, code, quantity, limit) {
    const state = get();
    const edits = currentEdits(state, deckId);

    const deck = resolveDeck(
      state.metadata,
      state.lookupTables,
      state.sharing,
      applyDeckEdits(state.data.decks[deckId], edits, state.metadata, false),
    );

    const attachments = structuredClone(deck.attachments ?? {});

    attachments[targetCode] ??= {};
    attachments[targetCode][code] = quantity;

    const availableQuantity = Math.max(limit - quantity, 0);

    for (const [key, entries] of Object.entries(attachments)) {
      if (key === targetCode) continue;

      for (const [other, quantity] of Object.entries(entries)) {
        if (code !== other) continue;
        attachments[key][other] = Math.min(availableQuantity, quantity);
      }
    }

    set({
      deckEdits: {
        ...state.deckEdits,
        [deckId]: {
          ...edits,
          attachments,
        },
      },
    });
  },

  moveToMainDeck(card, deckId) {
    const state = get();

    const deck = selectResolvedDeckById(state, deckId, true);

    const quantity = deck?.sideSlots?.[card.code] ?? 0;
    if (!quantity) return;

    const edits = currentEdits(state, deckId);

    const limitOverride = getDeckLimitOverride(deck, card.code);

    const nextQuantity = Math.min(
      (deck?.slots?.[card.code] ?? 0) + 1,
      cardLimit(card, limitOverride),
    );

    const nextSideQuantity = Math.max(
      (deck?.sideSlots?.[card.code] ?? 0) - 1,
      0,
    );

    set({
      deckEdits: {
        ...state.deckEdits,
        [deckId]: {
          ...edits,
          quantities: {
            ...edits.quantities,
            slots: {
              ...edits.quantities?.slots,
              [card.code]: nextQuantity,
            },
            sideSlots: {
              ...currentEdits(state, deckId).quantities?.sideSlots,
              [card.code]: nextSideQuantity,
            },
          },
        },
      },
    });
  },
});
