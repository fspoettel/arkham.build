import { LimitedCardPoolField } from "@/components/limited-card-pool";
import { useStore } from "@/store";

export function DeckCreateCardPool() {
  const setCardPool = useStore((state) => state.deckCreatesetCardPool);

  const selectedItems = useStore((state) => state.deckCreate?.cardPool ?? []);

  return (
    <LimitedCardPoolField
      onValueChange={setCardPool}
      selectedItems={selectedItems}
    />
  );
}
