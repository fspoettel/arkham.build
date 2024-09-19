import { useStore } from "@/store";
import { selectFactionsInLocalDecks } from "@/store/selectors/deck-collection";
import { FactionToggle } from "./faction-toggle";

export function DeckCollectionFilters() {
  const factionOptions = useStore(selectFactionsInLocalDecks);

  const onValueChange = () => {};

  return (
    <div>
      {factionOptions.length > 1 && (
        <FactionToggle
          options={factionOptions}
          value={[]}
          onValueChange={onValueChange}
        />
      )}
    </div>
  );
}
