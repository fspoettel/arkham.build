import type { Metadata } from "@/store/slices/metadata.types";

import type { Customization, Customizations, DeckMeta } from "../types";

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

export function encodeCustomizations(customizations: Customizations) {
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
