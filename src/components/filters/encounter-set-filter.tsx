import { useCallback } from "react";

import { useStore } from "@/store";
import {
  selectEncounterSetChanges,
  selectEncounterSetOptions,
  selectEncounterSetValue,
} from "@/store/selectors/filters";
import type { EncounterSet } from "@/store/services/types";

import EncounterIcon from "../icons/encounter-icon";
import { MultiselectFilter } from "./primitives/multiselect-filter";

function EncounterSetName({ set }: { set: EncounterSet }) {
  return (
    <span
      style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
    >
      <EncounterIcon code={set.code} />
      {set.name}
    </span>
  );
}

export function EncounterSetFilter() {
  const changes = useStore(selectEncounterSetChanges);
  const encounterSets = useStore(selectEncounterSetOptions);
  const value = useStore(selectEncounterSetValue);

  const nameRenderer = useCallback(
    (set: EncounterSet) => <EncounterSetName set={set} />,
    [],
  );

  const itemToString = useCallback(
    (set: EncounterSet) => set.name.toLowerCase(),
    [],
  );

  return (
    <MultiselectFilter
      cardType="encounter"
      changes={changes}
      path="encounterSet"
      options={encounterSets}
      nameRenderer={nameRenderer}
      itemToString={itemToString}
      placeholder="Select encounter set..."
      value={value}
      title="Encounter Set"
    />
  );
}
