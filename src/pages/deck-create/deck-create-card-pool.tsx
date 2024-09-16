import {
  LimitedCardPoolField,
  SealedDeckField,
} from "@/components/limited-card-pool";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { useStore } from "@/store";

export function DeckCreateCardPool() {
  const setCardPool = useStore((state) => state.deckCreateSetCardPool);
  const setSealedDeck = useStore((state) => state.deckCreateSetSealed);

  const sealedDeck = useStore((state) =>
    state.deckCreate?.sealed
      ? {
          name: state.deckCreate.sealed.name,
          cards: state.deckCreate.sealed.cards,
        }
      : undefined,
  );

  const selectedItems = useStore((state) => state.deckCreate?.cardPool ?? []);

  return (
    <Collapsible title="Card pool settings">
      <CollapsibleContent>
        <LimitedCardPoolField
          onValueChange={setCardPool}
          selectedItems={selectedItems}
        />
        <SealedDeckField onValueChange={setSealedDeck} value={sealedDeck} />
      </CollapsibleContent>
    </Collapsible>
  );
}
