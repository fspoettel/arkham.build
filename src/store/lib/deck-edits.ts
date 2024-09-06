import { isEmpty } from "@/utils/is-empty";
import { omit } from "@/utils/omit";
import type { Deck, Slots } from "../slices/data.types";
import type { EditState, Slot } from "../slices/deck-edits.types";
import type { Metadata } from "../slices/metadata.types";
import {
  decodeAttachments,
  decodeCustomizations,
  decodeDeckMeta,
  encodeAttachments,
  encodeCustomizations,
} from "./deck-meta";
import { decodeExtraSlots, encodeExtraSlots } from "./slots";
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
  pruneDeletions = false,
) {
  if (!edits) return structuredClone(originalDeck);

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

  // adjust xp based on deck edits.
  if (edits.xpAdjustment != null) {
    deck.xp_adjustment = edits.xpAdjustment;
  }

  // adjust meta based on deck edits.
  const currentDeckMeta = decodeDeckMeta(deck);
  const extraSlots = decodeExtraSlots(currentDeckMeta);

  // adjust quantities based on deck edits.
  for (const [key, quantityEdits] of Object.entries(edits.quantities ?? {})) {
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
    if (!quantity && (pruneDeletions || !originalDeck.slots[code])) {
      delete deck.slots[code];
    }
  }

  if (deck.sideSlots && !Array.isArray(deck.sideSlots)) {
    for (const [code, quantity] of Object.entries(deck.sideSlots)) {
      if (!quantity) delete deck.sideSlots[code];
    }
  }

  for (const [code, quantity] of Object.entries(extraSlots)) {
    if (!quantity && (pruneDeletions || !extraSlots[code]))
      delete extraSlots[code];
  }

  if (deck.ignoreDeckLimitSlots) {
    for (const [code, quantity] of Object.entries(deck.ignoreDeckLimitSlots)) {
      if (!quantity || (pruneDeletions && !deck.slots[code])) {
        delete deck.ignoreDeckLimitSlots[code];
      }
    }
  }

  const customizationEdits = mergeCustomizationEdits(
    edits,
    deck,
    currentDeckMeta,
    metadata,
    pruneDeletions,
  );

  const attachmentEdits = mergeAttachmentEdits(
    edits,
    deck,
    currentDeckMeta,
    pruneDeletions,
  );

  // adjust customizations & attachments based on deck edits.
  const deckMeta = Object.assign(
    structuredClone(
      omit(
        currentDeckMeta,
        (k) => k.startsWith("attachments_") || k.startsWith("cus_"),
      ),
    ),
    customizationEdits,
    attachmentEdits,
  );

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

function mergeAttachmentEdits(
  edits: EditState,
  deck: Deck,
  deckMeta: DeckMeta,
  pruneDeletions = false,
) {
  const attachments = decodeAttachments(deckMeta) ?? {};

  for (const [targetCode, entries] of Object.entries(edits.attachments ?? {})) {
    if (isEmpty(entries)) continue;

    const attachment = { ...attachments[targetCode] };

    for (const [code, quantity] of Object.entries(entries)) {
      attachment[code] = quantity;
    }

    attachments[targetCode] = attachment;
  }

  if (pruneDeletions) {
    for (const [targetCode, entries] of Object.entries(attachments)) {
      if (!deck.slots[targetCode] && deck.investigator_code !== targetCode) {
        delete attachments[targetCode];
      }

      for (const code of Object.keys(entries)) {
        if (!deck.slots[code]) {
          delete attachments[targetCode][code];
        }
      }
    }
  }

  return encodeAttachments(attachments);
}

/**
 * Merges stored customizations in a deck with edits, returning a deck.meta JSON block.
 */
function mergeCustomizationEdits(
  edits: EditState,
  deck: Deck,
  deckMeta: DeckMeta,
  metadata: Metadata,
  pruneDeletions = false,
) {
  const prev = decodeCustomizations(deckMeta, metadata) ?? {};

  const next = structuredClone(prev);

  for (const [code, changes] of Object.entries(edits.customizations ?? {})) {
    next[code] ??= {};

    for (const [id, change] of Object.entries(changes)) {
      if (next[code][id]) {
        if (change.xp_spent != null) next[code][id].xp_spent = change.xp_spent;
        if (change.selections != null) {
          next[code][id].selections = isEmpty(change.selections)
            ? undefined
            : change.selections.join("^");
        }
      } else {
        next[code][id] ??= {
          index: +id,
          xp_spent: change.xp_spent ?? 0,
          selections: change.selections?.join("^") || undefined,
        };
      }
    }
  }

  if (pruneDeletions) {
    for (const code of Object.keys(next)) {
      if (!deck.slots[code]) {
        if (deck.previous_deck) {
          next[code] = prev[code];
        } else {
          delete next[code];
        }
      }
    }
  }

  return encodeCustomizations(next);
}
