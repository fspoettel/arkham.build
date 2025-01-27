import { useStore } from "@/store";
import type { ResolvedDeck } from "@/store/lib/types";
import type { Card } from "@/store/services/queries.types";
import { cardLimit } from "@/utils/card-utils";
import type { AttachableDefinition } from "@/utils/constants";
import { useResolvedDeckChecked } from "@/utils/use-resolved-deck";
import { useCallback } from "react";

export function canAttach(card: Card, definition: AttachableDefinition) {
  return (
    definition.code !== card.code &&
    definition.traits?.some((t) => card.real_traits?.includes(t))
  );
}

function attachmentLimit(card: Card, quantityInDeck: number) {
  return Math.min(quantityInDeck, cardLimit(card));
}

export function attachmentDefinitionLimit(
  card: Card,
  quantityInDeck: number,
  attachmentDefinitionLimit: number | undefined,
) {
  return Math.min(
    attachmentLimit(card, quantityInDeck),
    attachmentDefinitionLimit ?? Number.MAX_SAFE_INTEGER,
  );
}

export function getAttachedQuantity(
  card: Card,
  definition: AttachableDefinition,
  resolvedDeck: ResolvedDeck,
) {
  return (
    definition.requiredCards?.[card.code] ??
    resolvedDeck.attachments?.[definition.code]?.[card.code] ??
    0
  );
}

export function canUpdateAttachment(
  card: Card,
  definition: AttachableDefinition,
  resolvedDeck: ResolvedDeck,
) {
  return (
    definition.requiredCards?.[card.code] == null &&
    resolvedDeck.slots[card.code] > 0
  );
}

export function useAttachmentsChangeHandler() {
  const { canEdit, resolvedDeck } = useResolvedDeckChecked();

  const updateAttachment = useStore((state) => state.updateAttachment);

  const changeHandler = useCallback(
    (definition: AttachableDefinition, card: Card, delta: number) => {
      const quantity = resolvedDeck.slots[card.code] ?? 0;

      const attached =
        resolvedDeck.attachments?.[definition.code]?.[card.code] ?? 0;
      const limit = attachmentDefinitionLimit(card, quantity, definition.limit);

      const nextQuantity = attached + delta;

      return updateAttachment(
        resolvedDeck,
        definition.code,
        card.code,
        nextQuantity > limit ? 0 : nextQuantity,
        attachmentLimit(card, quantity),
      );
    },
    [resolvedDeck, updateAttachment],
  );

  return canEdit ? changeHandler : undefined;
}
