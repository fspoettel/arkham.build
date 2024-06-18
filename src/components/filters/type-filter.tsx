import { useCallback } from "react";

import { useStore } from "@/store";
import {
  selectActiveList,
  selectActiveListFilter,
  selectMultiselectChanges,
  selectTypeOptions,
} from "@/store/selectors/lists";
import type { Type } from "@/store/services/queries.types";
import { isTypeFilterObject } from "@/store/slices/lists.type-guards";
import { assert } from "@/utils/assert";

import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { MultiselectFilter } from "./primitives/multiselect-filter";

const nameRenderer = (item: Type) => item.name;
const itemToString = (item: Type) => item.name.toLowerCase();

export function TypeFilter({ id }: { id: number }) {
  const activeList = useStore(selectActiveList);
  const filter = useStore((state) => selectActiveListFilter(state, id));
  const setFilterValue = useStore((state) => state.setFilterValue);

  assert(
    isTypeFilterObject(filter),
    `TypeFilter instantiated with '${filter?.type}'`,
  );

  const changes = selectMultiselectChanges(filter.value);
  const options = useStore(selectTypeOptions);

  const handleApplyShortcut = useCallback(
    (value: string[]) => {
      setFilterValue(id, value);
    },
    [id, setFilterValue, filter.value],
  );

  return (
    <MultiselectFilter
      changes={changes}
      id={id}
      itemToString={itemToString}
      nameRenderer={nameRenderer}
      open={filter.open}
      options={options}
      placeholder="Select type(s)..."
      title="Type"
      value={filter.value}
    >
      {!filter.open && activeList?.cardType === "player" && (
        <ToggleGroup
          full
          type="multiple"
          onValueChange={handleApplyShortcut}
          value={filter.value}
        >
          <ToggleGroupItem value="asset" size="small-type">
            Asset
          </ToggleGroupItem>
          <ToggleGroupItem value="event" size="small-type">
            Event
          </ToggleGroupItem>
          <ToggleGroupItem value="skill" size="small-type">
            Skill
          </ToggleGroupItem>
        </ToggleGroup>
      )}
    </MultiselectFilter>
  );
}
