import { useCallback, useMemo, useState } from "react";

import { useStore } from "@/store";
import { debounce } from "@/utils/debounce";

import css from "./card-search.module.css";

import { Checkbox } from "../ui/checkbox";
import { SearchInput } from "../ui/search-input";

export function CardSearch() {
  const setSearchValue = useStore((state) => state.setSearchValue);
  const setSearchFlag = useStore((state) => state.setSearchFlag);
  const search = useStore((state) => state.search);
  const searchOpen = useStore((state) => state.ui.searchOpen);

  const [inputValue, setInputValue] = useState(search.value);

  const debouncedSetSearchValue = useMemo(
    () => debounce(setSearchValue, 50),
    [setSearchValue],
  );

  const onChangeValue = useCallback(
    (val: string) => {
      setInputValue(val);
      debouncedSetSearchValue(val);
    },
    [debouncedSetSearchValue],
  );

  const onToggleGameText = useCallback(
    (val: boolean | string) => {
      setSearchFlag("includeGameText", !!val);
    },
    [setSearchFlag],
  );

  const onToggleFlavor = useCallback(
    (val: boolean | string) => {
      setSearchFlag("includeFlavor", !!val);
    },
    [setSearchFlag],
  );

  const onToggleBacks = useCallback(
    (val: boolean | string) => {
      setSearchFlag("includeBacks", !!val);
    },
    [setSearchFlag],
  );

  return (
    <search
      data-state={searchOpen ? "open" : "closed"}
      className={css["search"]}
      title="Card search"
    >
      <div className={css["search-row"]}>
        <div className={css["search-input"]}>
          <SearchInput
            autoFocus
            tabIndex={0}
            className={css["search-field"]}
            inputClassName={css["search-input-field"]}
            placeholder="Search for cards..."
            onChangeValue={onChangeValue}
            id="search-card-input"
            value={inputValue}
          />
        </div>
      </div>
      <div className={css["search-toggles"]}>
        <Checkbox
          tabIndex={0}
          checked={search.includeGameText}
          id="search-game-text"
          label="Game text"
          onCheckedChange={onToggleGameText}
        />
        <Checkbox
          tabIndex={0}
          checked={search.includeFlavor}
          id="search-game-flavor"
          label="Flavor"
          onCheckedChange={onToggleFlavor}
        />
        <Checkbox
          tabIndex={0}
          checked={search.includeBacks}
          id="search-back"
          label="Backs"
          onCheckedChange={onToggleBacks}
        />
      </div>
    </search>
  );
}
