import { useCallback } from "react";

import { useStore } from "@/store";
import {
  selectActiveFactions,
  selectFactions,
} from "@/store/selectors/filters/faction";
import { selectActiveCardType } from "@/store/selectors/filters/shared";

import css from "./faction-filter.module.css";

import { FactionIconFancy } from "../ui/icons/faction-icon-fancy";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

export function FactionFilter() {
  const cardType = useStore(selectActiveCardType);
  const factions = useStore(selectFactions);
  const { value } = useStore(selectActiveFactions);
  const setFilter = useStore((state) => state.setActiveFilter);

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
      {factions.map((faction) => (
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
