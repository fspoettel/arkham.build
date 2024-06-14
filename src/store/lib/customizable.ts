import { isEmpty } from "@/utils/is-empty";

import type { Card, CustomizationOption } from "../services/types";
import type { EditState } from "../slices/deck-view/types";
import type { Metadata } from "../slices/metadata/types";
import type { Customization, Customizations, DeckMeta } from "./types";

export function customizationOptionUnlocked(
  option: CustomizationOption,
  xpSpent: number,
) {
  return xpSpent >= option.xp;
}

/**
 * Applies customizations to a card, taking into account:
 * 1. Changes to the card text and attributes.
 * 2. Changes to the customizable_text itself.
 */
export function applyCustomizations(
  card: Card,
  metadata: Metadata,
  customizations: Customizations | undefined,
): Card {
  if (
    !customizations ||
    !customizations[card.code] ||
    !card.real_customization_change ||
    !card.real_customization_text ||
    !card.customization_options
  )
    return card;

  const cardCustomizations = customizations[card.code];
  const customizationChanges = card.real_customization_change.split("\n");

  const nextCard: Card & {
    customization_xp: number;
  } = { ...card, customization_xp: 0 };

  const lines = card.real_text?.split("\n") ?? [];
  const toInsert: { edit: string; position: number; index: number }[] = [];

  card.customization_options.forEach((option, i) => {
    const customization = cardCustomizations[i];
    if (!customization) return;

    const xpSpent = customization.xp_spent ?? 0;
    nextCard.customization_xp += xpSpent;

    if (customizationOptionUnlocked(option, xpSpent)) {
      if (option.health) nextCard.health = (card.health ?? 0) + option.health;
      if (option.sanity) nextCard.sanity = (card.sanity ?? 0) + option.sanity;
      if (option.deck_limit) nextCard.deck_limit = option.deck_limit;
      if (option.real_slot) nextCard.real_slot = option.real_slot;
      if (option.real_traits) nextCard.real_traits = option.real_traits;
      if (option.cost) nextCard.cost = (nextCard.cost ?? 0) + option.cost;
      if (option.tags) {
        nextCard.tags = [...(nextCard.tags ?? []), ...option.tags];
      }

      const selections = customization.selections;
      let edit = customizationChanges[i];

      switch (option.choice) {
        case "choose_trait": {
          const traits = selections?.split("^")?.reduce<string>((acc, t) => {
            if (!t) return acc;

            const trait = `[[${t}]]`;
            return acc ? `${acc}, ${trait}` : trait;
          }, "");

          edit = traits ? edit.replace("_____", traits) : edit;
          break;
        }

        case "choose_skill": {
          const skill = selections ?? "";
          edit = skill ? edit.replace("_____", `[${skill}]`) : edit;
          break;
        }

        case "choose_card": {
          const cards = selections?.split("^").reduce((acc, code) => {
            if (!code) return acc;
            const card = `<u>${metadata.cards[code].real_name}</u>`;
            return acc ? `${acc}, ${card}` : card;
          }, "");

          edit = `${edit} ${cards}`;
          break;
        }

        case "remove_slot": {
          // slot choice stores the index of a slot to remove.
          const choice = Number.parseInt(selections ?? "", 10);

          if (!Number.isNaN(choice) && card.real_slot) {
            nextCard.real_slot = card.real_slot
              ?.split(".")
              .reduce<string>((acc, curr, i) => {
                if (i === choice) return acc;
                const slot = curr.trim();
                return acc ? `${acc}. ${slot}` : slot;
              }, "");
          }
        }
      }

      if (option.text_change === "append") {
        lines.push(edit);
      }

      if (option.text_change === "replace") {
        lines.splice(option.position ?? 0, 1, edit);
      }

      if (option.text_change === "insert") {
        toInsert.push({ edit, position: option.position ?? 0, index: i });
      }
    }
  });

  toInsert.sort((a, b) => b.position - a.position || b.index - a.index);
  toInsert.forEach(({ edit, position }) => lines.splice(position + 1, 0, edit));

  nextCard.real_text = lines.join("\n");
  return nextCard;
}

/**
 * Decodes customizations from a parsed deck.meta JSON block.
 */
export function decodeCustomizations(deckMeta: DeckMeta, metadata: Metadata) {
  let hasCustomizations = false;
  const customizations: Customizations = {};

  for (const [key, value] of Object.entries(deckMeta)) {
    // customizations are tracked in format `cus_{code}: {index}|{xp}|{choice?},...`.
    if (key.startsWith("cus_") && value) {
      hasCustomizations = true;
      const code = key.split("cus_")[1];

      customizations[code] = value
        .split(",")
        .reduce<Record<number, Customization>>((acc, curr) => {
          const entries = curr.split("|");
          const index = Number.parseInt(entries[0], 10);

          if (entries.length > 1) {
            const xp_spent = Number.parseInt(entries[1], 10);
            const selections = entries[2] ?? "";

            const option = metadata.cards[code]?.customization_options?.[index];
            if (!option) return acc;

            acc[index] = {
              selections,
              index,
              xp_spent,
            };
          }

          return acc;
        }, {});
    }
  }

  return hasCustomizations ? customizations : undefined;
}

function encodeCustomizations(customizations: Customizations) {
  return Object.entries(customizations).reduce<Record<string, string>>(
    (acc, [code, changes]) => {
      const key = `cus_${code}`;

      const value = Object.values(changes)
        .sort((a, b) => a.index - b.index)
        .map((curr) => {
          let s = `${curr.index}`;
          if (curr.selections || curr.xp_spent != null)
            s += `|${curr.xp_spent}`;
          if (curr.selections) s += `|${curr.selections}`;
          return s;
        })
        .join(",");

      acc[key] = value;
      return acc;
    },
    {},
  );
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
