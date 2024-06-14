import { useCallback } from "react";

import { useStore } from "@/store";
import {
  selectActiveCardType,
  selectFactionOptions,
  selectFactionValue,
} from "@/store/selectors/filters";

import css from "./faction-filter.module.css";

import { FactionIconFancy } from "../icons/faction-icon-fancy";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

export function FactionFilter() {
  const cardType = useStore(selectActiveCardType);
  const options = useStore(selectFactionOptions);
  const value = useStore(selectFactionValue);
  const setFilter = useStore((state) => state.setFilter);

  const setFactions = useCallback(
    (val: string[]) => {
      setFilter(cardType, "faction", "value", val);
    },
    [cardType, setFilter],
  );

  return (
    <ToggleGroup
      className={css["faction-filter"]}
      type="multiple"
      icons
      onValueChange={setFactions}
      value={value}
      full
    >
      {options.map((faction) => (
        <ToggleGroupItem
          className={css[`color-active-${faction.code}`]}
          key={faction.code}
          value={faction.code}
          title={faction.name}
        >
          <FactionIconFancy code={faction.code} />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
