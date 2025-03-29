import * as v from "valibot";
import {
  type CustomContentCard,
  type CustomContentProject,
  CustomContentProjectSchema,
} from "./custom-content.schemas";

export function parseCustomContentProject(data: unknown): CustomContentProject {
  return v.parse(CustomContentProjectSchema, data);
}

export function validateCustomContentProject(
  project: CustomContentProject,
): void {
  const errors = [];

  const encounterCodes = new Set(
    project.data.encounter_sets.map((set) => set.code),
  );

  const packCodes = new Set(project.data.packs.map((pack) => pack.code));

  const cards: Record<string, CustomContentCard> = {};
  const backLinks = new Set<string>();

  for (const card of project.data.cards) {
    // Check that the card references a pack from the project.
    if (!packCodes.has(card.pack_code)) {
      errors.push(
        `Card ${card.code} references unknown pack: ${card.pack_code}`,
      );
    }

    // Check that the card references an encounter set from the project.
    if (card.encounter_code) {
      if (!encounterCodes.has(card.encounter_code)) {
        errors.push(
          `Card ${card.code} references unknown encounter set: ${card.encounter_code}`,
        );
      }
    }

    cards[card.code] = card;
    if (card.back_link) backLinks.add(card.back_link);
  }

  // Check that backs exists and are hidden.
  for (const backLink of backLinks) {
    if (!cards[backLink]) {
      errors.push(
        `Card ${backLink} is referenced as a back_link but does not exist`,
      );
    }

    if (!cards[backLink].hidden) {
      errors.push(
        `Card ${backLink} is referenced as a back_link but is not hidden`,
      );
    }
  }

  if (errors.length) {
    const message = `Custom content project ${project.meta.code} failed validation:\n${errors.join("\n")}`;
    throw new Error(message);
  }
}
