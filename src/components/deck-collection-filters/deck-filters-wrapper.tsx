import { useStore } from "@/store";
import {
  selectDeckFactionFilters,
  selectDeckSearchTerm,
  selectFactionsInLocalDecks,
} from "@/store/selectors/deck-filters";
import { FactionToggle } from "../faction-toggle";
import { SearchInput } from "../ui/search-input";

import { Filter } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import css from "./deck-filters-wrapper.module.css";

import { Content, Root, Trigger } from "@radix-ui/react-collapsible";

export function DeckCollectionFilters() {
  const [open, setOpen] = useState(false);

  const addFilter = useStore((state) => state.addDecksFilter);

  const onSearchChange = (value: string) => {
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
    <Root open={open} onOpenChange={setOpen}>
      <div className={css["search-container"]}>
        <SearchInput
          data-testid="deck-search-input"
          id="deck-search-input"
          inputClassName={css["search-input"]}
          onChangeValue={onSearchChange}
          placeholder="Search for decks..."
          ref={searchRef}
          value={searchValue}
          className={css["search-outer"]}
        />
        <Trigger asChild>
          <Button
            as="a"
            data-testid="collection-create-deck"
            tooltip="More filters"
            variant="bare"
          >
            <Filter />
          </Button>
        </Trigger>
      </div>
      <Content>
        {factionOptions.length > 1 && (
          <FactionToggle
            options={factionOptions}
            value={selectedFactions}
            onValueChange={onFactionFilterChange}
          />
        )}
      </Content>
    </Root>
  );
}
