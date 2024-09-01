import { useStore } from "@/store";
import type { Card } from "@/store/services/queries.types";
import type { AttachableDefinition } from "@/utils/constants";
import { useResolvedDeckChecked } from "@/utils/use-resolved-deck";
import { useMemo } from "react";

export function canAttach(card: Card, definition: AttachableDefinition) {
  return (
    definition.code !== card.code &&
    definition.traits?.some((t) => card.real_traits?.includes(t))
  );
}

function attachmentLimit(card: Card, quantityInDeck: number) {
  return Math.min(quantityInDeck, card.deck_limit ?? card.quantity);
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

export type AttachmentsChangeHandler =
  | ((definition: AttachableDefinition, card: Card, delta: number) => void)
  | undefined;

export function useAttachmentsChangeHandler() {
  const { canEdit, resolvedDeck } = useResolvedDeckChecked();

  const updateAttachment = useStore((state) => state.updateAttachment);

  const changeHandler = useMemo(() => {
    if (!canEdit) return undefined;

    const handler: AttachmentsChangeHandler = (definition, card, delta) => {
      const quantity = resolvedDeck.slots[card.code] ?? 0;

      const attached =
        resolvedDeck.attachments?.[definition.code]?.[card.code] ?? 0;
      const limit = attachmentDefinitionLimit(card, quantity, definition.limit);

      const nextQuantity = attached + delta;

      return updateAttachment(
        resolvedDeck.id,
        definition.code,
        card.code,
        nextQuantity > limit ? 0 : nextQuantity,
        attachmentLimit(card, quantity),
      );
    };

    return handler;
  }, [
    resolvedDeck.id,
    resolvedDeck.slots,
    resolvedDeck.attachments,
    canEdit,
    updateAttachment,
  ]);

  return changeHandler;
}
