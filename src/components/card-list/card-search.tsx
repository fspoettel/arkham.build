import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useStore } from "@/store";
import { selectActiveListSearch } from "@/store/selectors/lists";
import { assert, isDefined } from "@/utils/assert";
import { debounce } from "@/utils/debounce";
import { inputFocused } from "@/utils/keyboard";

import css from "./card-search.module.css";

import { Checkbox } from "../ui/checkbox";
import { SearchInput } from "../ui/search-input";

type Props = {
  onKeyboardNavigate: (evt: React.KeyboardEvent) => void;
  slotLeft?: React.ReactNode;
  slotRight?: React.ReactNode;
};

export function CardSearch(props: Props) {
  const { onKeyboardNavigate, slotLeft, slotRight } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  const setSearchValue = useStore((state) => state.setSearchValue);
  const setSearchFlag = useStore((state) => state.setSearchFlag);

  const search = useStore(selectActiveListSearch);
  assert(isDefined(search), "Search bar requires an active list.");

  const [inputValue, setInputValue] = useState(search.value ?? "");

  useEffect(() => {
    function onShortcut(evt: KeyboardEvent) {
      if (evt.key === "/" && !inputFocused()) {
        evt.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }

    document.addEventListener("keydown", onShortcut);
    return () => {
      document.removeEventListener("keydown", onShortcut);
    };
  }, []);

  useEffect(() => {
    setInputValue(search.value ?? "");
  }, [search]);

  const debouncedSetSearchValue = useMemo(
    () => debounce(setSearchValue, 50),
    [setSearchValue],
  );

  const onValueChange = useCallback(
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
    <search className={css["container"]} data-testid="search">
      <div className={css["row"]}>
        {slotLeft}
        <div className={css["field"]}>
          <SearchInput
            data-testid="search-input"
            id="card-search-input"
            inputClassName={css["field-input"]}
            onChangeValue={onValueChange}
            onKeyDown={onKeyboardNavigate}
            placeholder="Search for cards..."
            ref={inputRef}
            value={inputValue}
          />
        </div>
        {slotRight}
      </div>
      <div className={css["flags"]}>
        <Checkbox checked disabled id="search-card-name" label="Name" />
        <Checkbox
          checked={search.includeGameText}
          data-testid="search-game-text"
          id="search-game-text"
          label="Game text"
          onCheckedChange={onToggleGameText}
        />
        <Checkbox
          checked={search.includeFlavor}
          id="search-game-flavor"
          label="Flavor"
          onCheckedChange={onToggleFlavor}
        />
        <Checkbox
          checked={search.includeBacks}
          id="search-back"
          label="Backs"
          onCheckedChange={onToggleBacks}
        />
      </div>
    </search>
  );
}
