import { useCallback } from "react";

import { useStore } from "@/store";
import {
  selectEncounterSetChanges,
  selectEncounterSetOptions,
  selectEncounterSetValue,
} from "@/store/selectors/filters";
import type { EncounterSet } from "@/store/services/queries.types";

import css from "./filters.module.css";

import EncounterIcon from "../icons/encounter-icon";
import { MultiselectFilter } from "./primitives/multiselect-filter";

function EncounterSetName({ set }: { set: EncounterSet }) {
  return (
    <>
      <span className={css["filter-menu-icon"]}>
        <EncounterIcon code={set.code} />
      </span>
      {set.name}
    </>
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
      itemToString={itemToString}
      nameRenderer={nameRenderer}
      options={encounterSets}
      path="encounterSet"
      placeholder="Select encounter set..."
      title="Encounter Set"
      value={value}
    />
  );
}
