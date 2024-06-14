import { isEmpty } from "@/utils/is-empty";

import type { Deck, Slots } from "../slices/data/types";
import type { DeckViewState, EditState, Slot } from "../slices/deck-view/types";
import type { Metadata } from "../slices/metadata/types";
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
  deckView: DeckViewState,
  metadata: Metadata,
) {
  if (deckView.mode !== "edit") return originalDeck;

  const deck = structuredClone(originalDeck);

  // adjust name based on deck edits.
  if (deckView.edits.name != undefined) {
    deck.name = deckView.edits.name;
  }

  if (deckView.edits.description_md != undefined) {
    deck.description_md = deckView.edits.description_md;
  }

  // adjust taboo id based on deck edits.
  if (deckView.edits.tabooId !== undefined) {
    deck.taboo_id = deckView.edits.tabooId;
  }

  // adjust meta based on deck edits.
  const deckMeta = decodeDeckMeta(deck);

  // adjust customizations based on deck edits.
  Object.assign(
    deckMeta,
    mergeCustomizationEdits(deckView, deckMeta, metadata),
  );

  const extraSlots = decodeExtraSlots(deckMeta);

  // adjust quantities based on deck edits.
  for (const [key, edits] of Object.entries(deckView.edits.quantities)) {
    for (const edit of edits) {
      const slotKey = key as Slot;

      if (slotKey === "extraSlots") {
        const current = extraSlots[edit.code];
        extraSlots[edit.code] = Math.max((current ?? 0) + edit.quantity, 0);
        continue;
      }

      // account for arkhamdb representing empty side slots as an array.
      if (!deck[slotKey] || Array.isArray(deck[slotKey])) {
        deck[slotKey] = {};
      }

      const current = (deck[slotKey] as Slots)?.[edit.code];

      (deck[slotKey] as Slots)[edit.code] = Math.max(
        (current ?? 0) + edit.quantity,
        0,
      );
    }
  }

  for (const [code, quantity] of Object.entries(deck.slots)) {
    if (!quantity && !originalDeck.slots[code]) delete deck.slots[code];
  }

  if (deck.sideSlots && !Array.isArray(deck.sideSlots)) {
    for (const [code, quantity] of Object.entries(deck.sideSlots)) {
      if (!quantity) delete deck.sideSlots[code];
    }
  }

  for (const [code, quantity] of Object.entries(extraSlots)) {
    if (!quantity && !extraSlots[code]) delete extraSlots[code];
  }

  deck.meta = JSON.stringify({
    ...deckMeta,
    ...deckView.edits.meta,
    extra_deck: encodeExtraSlots(extraSlots),
    alternate_back: applyInvestigatorSide(
      deck,
      deckMeta,
      deckView,
      "investigatorBack",
    ),
    alternate_front: applyInvestigatorSide(
      deck,
      deckMeta,
      deckView,
      "investigatorFront",
    ),
  });

  return deck;
}

function applyInvestigatorSide(
  deck: Deck,
  deckMeta: DeckMeta,
  deckView: EditState,
  key: "investigatorFront" | "investigatorBack",
) {
  const current = deckView.edits[key];

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
  state: EditState,
  deckMeta: DeckMeta,
  metadata: Metadata,
) {
  if (isEmpty(state.edits.customizations)) {
    return {};
  }

  const customizations = decodeCustomizations(deckMeta, metadata) ?? {};

  for (const [code, changes] of Object.entries(state.edits.customizations)) {
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
