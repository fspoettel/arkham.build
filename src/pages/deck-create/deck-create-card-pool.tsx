import {
  LimitedCardPoolField,
  SealedDeckField,
} from "@/components/limited-card-pool";
import { Field, FieldLabel } from "@/components/ui/field";
import { useStore } from "@/store";
import { useMemo } from "react";

export function DeckCreateCardPool() {
  const setCardPool = useStore((state) => state.deckCreateSetCardPool);
  const setSealedDeck = useStore((state) => state.deckCreateSetSealed);

  const deckCreate = useStore((state) => state.deckCreate);

  const sealedDeck = useMemo(
    () =>
      deckCreate?.sealed
        ? {
            name: deckCreate.sealed.name,
            cards: deckCreate.sealed.cards,
          }
        : undefined,
    [deckCreate],
  );

  const selectedItems = useMemo(() => deckCreate?.cardPool ?? [], [deckCreate]);

  return (
    <Field full padded bordered>
      <FieldLabel>Card pool settings</FieldLabel>
      <LimitedCardPoolField
        onValueChange={setCardPool}
        selectedItems={selectedItems}
      />
      <SealedDeckField onValueChange={setSealedDeck} value={sealedDeck} />
    </Field>
  );
}
