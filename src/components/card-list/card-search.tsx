import { useCallback, useMemo, useRef, useState } from "react";

import { useStore } from "@/store";
import { debounce } from "@/utils/debounce";

import css from "./card-search.module.css";

import { Checkbox } from "../ui/checkbox";
import { SearchInput } from "../ui/search-input";

type Props = {
  slotLeft?: React.ReactNode;
  slotRight?: React.ReactNode;
};

export function CardSearch({ slotLeft, slotRight }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const setSearchValue = useStore((state) => state.setSearchValue);
  const setSearchFlag = useStore((state) => state.setSearchFlag);
  const search = useStore((state) => state.search);

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
    <search className={css["container"]} title="Card search">
      <div className={css["row"]}>
        {slotLeft}
        <div className={css["field"]}>
          <SearchInput
            id="card-search-input"
            inputClassName={css["field-input"]}
            onChangeValue={onChangeValue}
            placeholder="Search for cards..."
            ref={inputRef}
            tabIndex={0}
            value={inputValue}
          />
        </div>
        {slotRight}
      </div>
      <div className={css["flags"]}>
        <Checkbox checked disabled id="search-card-name" label="Name" />
        <Checkbox
          checked={search.includeGameText}
          id="search-game-text"
          label="Game text"
          onCheckedChange={onToggleGameText}
          tabIndex={0}
        />
        <Checkbox
          checked={search.includeFlavor}
          id="search-game-flavor"
          label="Flavor"
          onCheckedChange={onToggleFlavor}
          tabIndex={0}
        />
        <Checkbox
          checked={search.includeBacks}
          id="search-back"
          label="Backs"
          onCheckedChange={onToggleBacks}
          tabIndex={0}
        />
      </div>
    </search>
  );
}
