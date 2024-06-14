import type { Card } from "@/store/services/types";
import type { Metadata } from "@/store/slices/metadata/types";

import { applyCustomizations } from "./customizable";
import type { Customizations } from "./types";

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
