import { useStore } from "@/store";
import {
  selectDeckFactionFilters,
  selectFactionsInLocalDecks,
} from "@/store/selectors/deck-filters";
import { FactionToggle } from "./faction-toggle";

export function DeckCollectionFilters() {
  const factionOptions = useStore(selectFactionsInLocalDecks);
  const selectedFactions = useStore(selectDeckFactionFilters);

  const addFilter = useStore((state) => state.addDecksFilter);

  const onFactionFilterChange = (value: string[]) => {
    addFilter("faction", value);
  };

  return (
    <div>
      {factionOptions.length > 1 && (
        <FactionToggle
          options={factionOptions}
          value={selectedFactions}
          onValueChange={onFactionFilterChange}
        />
      )}
    </div>
  );
}
