import type { Card } from "@/store/services/queries.types";
import type { Metadata } from "@/store/slices/metadata.types";

import type { Customizations } from "./types";

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

    if (xpSpent >= option.xp) {
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

export function applyTaboo(
  card: Card,
  metadata: Metadata,
  tabooSetId: number | null,
): Card {
  if (!tabooSetId) return card;

  const taboo = metadata.taboos[`${card.code}-${tabooSetId}`];
  return taboo
    ? // taboos duplicate the card structure, so a simple merge is safe to apply them.
      {
        ...card,
        ...taboo,
      }
    : card;
}

export function applyCardChanges(
  card: Card,
  metadata: Metadata,
  tabooSetId: number | null,
  customizations: Customizations | undefined,
) {
  return applyCustomizations(
    applyTaboo(card, metadata, tabooSetId),
    metadata,
    customizations,
  );
}
