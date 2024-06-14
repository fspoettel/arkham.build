import { StoreState } from "@/store/slices";
import { FactionIcon } from "../ui/faction-icon";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

import css from "./select-faction.module.css";
import { useStore } from "@/store";
import { selectActiveFactions } from "@/store/selectors/filters";

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
  const factions = useStore(selectFactions);
  const selectedFactions = useStore(selectActiveFactions);
  const setFactions = useStore((state) => state.setFactionFilter);

  return (
    <ToggleGroup
      type="multiple"
      icons
      onValueChange={setFactions}
      value={selectedFactions}
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
