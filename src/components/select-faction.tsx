import { State } from "@/store/schema";
import { FactionIcon } from "./ui/faction-icon";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

import css from "./select-faction.module.css";
import { useStore } from "@/store";

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

function selectFactions(state: State) {
  const factions = Object.values(state.factions).filter((f) => f.is_primary);
  factions.push({ code: "multiclass", name: "Multiclass", is_primary: true });
  factions.sort(
    (a, b) => FACTION_SORT.indexOf(a.code) - FACTION_SORT.indexOf(b.code),
  );
  return factions;
}

export function SelectFaction() {
  const factions = useStore(selectFactions);

  return (
    <ToggleGroup type="multiple" icons full>
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
