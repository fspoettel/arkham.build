import { useStore } from "@/store";
import {
  selectDeckFactionFilters,
  selectDeckSearchTerm,
  selectFactionsInLocalDecks,
} from "@/store/selectors/deck-filters";
import { FactionToggle } from "./faction-toggle";
import { SearchInput } from "./ui/search-input";

import { useRef } from "react";
import css from "./deck-collection-filters.module.css";

export function DeckCollectionFilters() {
  const addFilter = useStore((state) => state.addDecksFilter);

  const onSearchChange = (value: string) => {
    console.log("value");
    addFilter("search", value);
  };
  const searchRef = useRef<HTMLInputElement>(null);
  const searchValue = useStore(selectDeckSearchTerm);

  const factionOptions = useStore(selectFactionsInLocalDecks);
  const selectedFactions = useStore(selectDeckFactionFilters);
  const onFactionFilterChange = (value: string[]) => {
    addFilter("faction", value);
  };

  return (
    <div>
      <div className={css["search-container"]}>
        <SearchInput
          data-testid="deck-search-input"
          id="deck-search-input"
          inputClassName={css["search-input"]}
          onChangeValue={onSearchChange}
          placeholder="Search for decks..."
          ref={searchRef}
          value={searchValue}
        />
      </div>
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
