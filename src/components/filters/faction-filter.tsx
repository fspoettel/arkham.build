import { useCallback } from "react";

import { useStore } from "@/store";
import {
  selectActiveListFilter,
  selectFactionOptions,
} from "@/store/selectors/lists";
import { isFactionFilterObject } from "@/store/slices/lists.type-guards";
import { assert } from "@/utils/assert";

import css from "./filters.module.css";

import { FactionIconFancy } from "../icons/faction-icon-fancy";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

type Props = {
  id: number;
};

export function FactionFilter({ id }: Props) {
  const filter = useStore((state) => selectActiveListFilter(state, id));
  assert(
    isFactionFilterObject(filter),
    `FactionFilter instantiated with '${filter?.type}'`,
  );

  const options = useStore(selectFactionOptions);
  const handleFilterChange = useStore((state) => state.setFilterValue);

  const handleValueChange = useCallback(
    (value: string[]) => {
      handleFilterChange(id, value);
    },
    [handleFilterChange, id],
  );

  return (
    <ToggleGroup
      className={css["faction-filter"]}
      full
      icons
      onValueChange={handleValueChange}
      type="multiple"
      value={filter.value}
    >
      {options.map((faction) => (
        <ToggleGroupItem
          className={css[`color-active-${faction.code}`]}
          key={faction.code}
          title={faction.name}
          value={faction.code}
        >
          <FactionIconFancy code={faction.code} />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
