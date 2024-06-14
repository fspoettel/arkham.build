import { StoreState } from "@/store/slices";
import { useStore } from "@/store";
import {
  selectActiveCardType,
  selectActiveFactions,
} from "@/store/selectors/filters";
import { FactionIcon } from "../ui/faction-icon";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

import css from "./faction-filter.module.css";
import { useCallback } from "react";
const FACTION_SORT = [
  "seeker",
  "guardian",
  "rogue",
  "mystic",
  "survivor",
  "multiclass",
  "neutral",
  "mythos",
];

function selectFactions(state: StoreState) {
  const factions = Object.values(state.metadata.factions).filter(
    (f) => f.is_primary,
  );
  factions.push({ code: "multiclass", name: "Multiclass", is_primary: true });
  factions.sort(
    (a, b) => FACTION_SORT.indexOf(a.code) - FACTION_SORT.indexOf(b.code),
  );
  return factions;
}

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
          <FactionIcon fancy code={faction.code} />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
