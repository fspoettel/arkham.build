import { useStore } from "@/store";
import {
  selectDeckFactionFilter,
  selectDeckSearchTerm,
  selectFactionsInLocalDecks,
} from "@/store/selectors/deck-filters";
import { FactionToggle } from "../faction-toggle";
import { SearchInput } from "../ui/search-input";

import { Filter, Minimize2 } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import css from "./deck-filters-wrapper.module.css";

import { Content, Root, Trigger } from "@radix-ui/react-collapsible";
import { TagsFilter } from "./tags-filter";

export function DeckCollectionFilters() {
  const [open, setOpen] = useState(false);

  const addFilter = useStore((state) => state.addDecksFilter);

  const onSearchChange = (value: string) => {
    addFilter("search", value);
  };
  const searchRef = useRef<HTMLInputElement>(null);
  const searchValue = useStore(selectDeckSearchTerm);

  const factionOptions = useStore(selectFactionsInLocalDecks);
  const selectedFactions = useStore(selectDeckFactionFilter);
  const onFactionFilterChange = (value: string[]) => {
    addFilter("faction", value);
  };

  return (
    <Root
      open={open}
      onOpenChange={setOpen}
      className={css["filters-wrap"]}
      data-testid="deck-filters-container"
    >
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
            tooltip={open ? "Close Filters" : "More filters"}
            variant="bare"
          >
            {open ? <Minimize2 /> : <Filter />}
          </Button>
        </Trigger>
      </div>
      <Content className={css["filtersContainer"]}>
        {factionOptions.length > 1 && (
          <FactionToggle
            options={factionOptions}
            value={selectedFactions}
            onValueChange={onFactionFilterChange}
          />
        )}
        <TagsFilter containerClass={css["filter"]} />
      </Content>
    </Root>
  );
}
