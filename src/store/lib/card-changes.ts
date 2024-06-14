import type { Card } from "@/store/services/types";
import type { Metadata } from "@/store/slices/metadata/types";

import type { Customizations } from "./types";

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

export function applyTaboo(
  card: Card,
  metadata: Metadata,
  tabooSetId: number | null,
): Card {
  if (!tabooSetId) return card;

  const taboo = metadata.taboos[`${card.code}-${tabooSetId}`];
  if (!taboo) return card;

  // taboos duplicate the card structure, so a simple merge is safe to apply them.
  return {
    ...card,
    ...taboo,
  };
}

function applyCustomizations(
  card: Card,
  metadata: Metadata,
  customizations: Customizations | undefined,
): Card {
  if (
    !customizations ||
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

    const xpSpent = customization.xpSpent ?? 0;
    nextCard.customization_xp += xpSpent ?? 0;

    if (customization.unlocked) {
      if (option.health) nextCard.health = (card.health ?? 0) + option.health;
      if (option.sanity) nextCard.sanity = (card.sanity ?? 0) + option.sanity;
      if (option.deck_limit) nextCard.deck_limit = option.deck_limit;
      if (option.real_slot) nextCard.real_slot = option.real_slot;
      if (option.real_traits) nextCard.real_traits = option.real_traits;
      if (option.cost) nextCard.cost = (nextCard.cost ?? 0) + option.cost;
      if (option.tags)
        nextCard.tags = [...(nextCard.tags ?? []), ...option.tags];

      const choices = customization.choices;
      let edit = customizationChanges[i];

      switch (option.choice) {
        case "choose_trait": {
          const traits = choices?.split("^")?.reduce<string>((acc, t) => {
            const trait = `[[${t}]]`;
            return acc ? `${acc}, ${trait}` : trait;
          }, "");

          edit = traits ? edit.replace("_____", traits) : edit;
          break;
        }

        case "choose_skill": {
          const skill = choices ?? "";
          edit = skill ? edit.replace("_____", `[${skill}]`) : edit;
          break;
        }

        case "choose_card": {
          const cards = choices?.split("^").map((c) => metadata.cards[c]);
          edit = cards?.length
            ? `${edit} ${cards.map((c) => `<u>${c.real_name}</u>`).join(", ")}`
            : edit;
          break;
        }

        case "remove_slot": {
          // slot choice stores the index of a slot to remove.
          const choice = Number.parseInt(choices ?? "", 10);

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
