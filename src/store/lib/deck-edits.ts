import { isEmpty } from "@/utils/is-empty";

import type { Deck, Slots } from "../slices/data.types";
import type { EditState, Slot } from "../slices/deck-edits.types";
import type { Metadata } from "../slices/metadata.types";
import {
  decodeCustomizations,
  encodeCustomizations,
} from "./serialization/customizable";
import { decodeDeckMeta } from "./serialization/deck-meta";
import { decodeExtraSlots, encodeExtraSlots } from "./serialization/slots";
import type { DeckMeta } from "./types";

/**
 * Given a stored deck, apply deck edits and return a new, serializable deck.
 * This function is inefficient in the context of the deck editor as it parses
 * and encodes the "serialized" deck form to apply edits, which has to be decoded again
 * in the resolver.
 * However, this allows us to re-use this logic to encode the persisted deck to storage upon
 * saving a deck.
 */
export function applyDeckEdits(
  originalDeck: Deck,
  edits: EditState | undefined,
  metadata: Metadata,
  alwaysDeleteEmpty = false,
) {
  if (!edits) return originalDeck;

  const deck = structuredClone(originalDeck);

  if (edits.name != null) {
    deck.name = edits.name;
  }

  if (edits.description_md != null) {
    deck.description_md = edits.description_md;
  }

  if (edits.tags != null) {
    deck.tags = edits.tags;
  }

  // adjust taboo id based on deck edits.
  if (edits.tabooId !== undefined) {
    deck.taboo_id = edits.tabooId;
  }

  // adjust meta based on deck edits.
  const deckMeta = decodeDeckMeta(deck);

  // adjust customizations based on deck edits.
  Object.assign(deckMeta, mergeCustomizationEdits(edits, deckMeta, metadata));

  const extraSlots = decodeExtraSlots(deckMeta);

  // adjust quantities based on deck edits.
  for (const [key, quantityEdits] of Object.entries(edits.quantities)) {
    for (const [code, value] of Object.entries(quantityEdits)) {
      const slotKey = key as Slot;

      if (slotKey === "extraSlots") {
        extraSlots[code] = value;
        continue;
      }

      // account for arkhamdb representing empty side slots as an array.
      if (!deck[slotKey] || Array.isArray(deck[slotKey])) {
        deck[slotKey] = {};
      }

      (deck[slotKey] as Slots)[code] = value;
    }
  }

  for (const [code, quantity] of Object.entries(deck.slots)) {
    if (!quantity && (alwaysDeleteEmpty || !originalDeck.slots[code]))
      delete deck.slots[code];
  }

  if (deck.sideSlots && !Array.isArray(deck.sideSlots)) {
    for (const [code, quantity] of Object.entries(deck.sideSlots)) {
      if (!quantity) delete deck.sideSlots[code];
    }
  }

  for (const [code, quantity] of Object.entries(extraSlots)) {
    if (!quantity && (alwaysDeleteEmpty || !extraSlots[code]))
      delete extraSlots[code];
  }

  if (deck.ignoreDeckLimitSlots) {
    for (const [code, quantity] of Object.entries(deck.ignoreDeckLimitSlots)) {
      if (!quantity || (alwaysDeleteEmpty && !deck.slots[code])) {
        delete deck.ignoreDeckLimitSlots[code];
      }
    }
  }

  deck.meta = JSON.stringify({
    ...deckMeta,
    ...edits.meta,
    extra_deck: encodeExtraSlots(extraSlots),
    alternate_back: applyInvestigatorSide(
      deck,
      deckMeta,
      edits,
      "investigatorBack",
    ),
    alternate_front: applyInvestigatorSide(
      deck,
      deckMeta,
      edits,
      "investigatorFront",
    ),
  });

  return deck;
}

function applyInvestigatorSide(
  deck: Deck,
  deckMeta: DeckMeta,
  edits: EditState,
  key: "investigatorFront" | "investigatorBack",
) {
  const current = edits[key];

  if (!current) {
    const deckMetaKey =
      key === "investigatorFront" ? "alternate_front" : "alternate_back";
    return deckMeta[deckMetaKey];
  }

  return current === deck.investigator_code ? null : current;
}

/**
 * Merges stored customizations in a deck with edits, returning a deck.meta JSON block.
 */
export function mergeCustomizationEdits(
  edits: EditState,
  deckMeta: DeckMeta,
  metadata: Metadata,
) {
  if (isEmpty(edits.customizations)) {
    return {};
  }

  const customizations = decodeCustomizations(deckMeta, metadata) ?? {};

  for (const [code, changes] of Object.entries(edits.customizations)) {
    customizations[code] ??= {};

    for (const [id, change] of Object.entries(changes)) {
      if (customizations[code][id]) {
        if (change.xp_spent != null)
          customizations[code][id].xp_spent = change.xp_spent;
        if (change.selections != null) {
          customizations[code][id].selections = isEmpty(change.selections)
            ? undefined
            : change.selections.join("^");
        }
      } else {
        customizations[code][id] ??= {
          index: +id,
          xp_spent: change.xp_spent ?? 0,
          selections: change.selections?.join("^") || undefined,
        };
      }
    }
  }

  return encodeCustomizations(customizations);
}
