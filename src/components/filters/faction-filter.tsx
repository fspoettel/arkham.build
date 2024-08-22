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

export function FactionFilter(props: Props) {
  const { id } = props;
  const filter = useStore((state) => selectActiveListFilter(state, id));
  assert(
    isFactionFilterObject(filter),
    `FactionFilter instantiated with '${filter?.type}'`,
  );

  const options = useStore(selectFactionOptions);
  const onFilterChange = useStore((state) => state.setFilterValue);

  const onValueChange = useCallback(
    (value: string[]) => {
      onFilterChange(id, value);
    },
    [onFilterChange, id],
  );

  return (
    <ToggleGroup
      className={css["faction-filter"]}
      data-testid="filters-faction"
      full
      icons
      onValueChange={onValueChange}
      type="multiple"
      value={filter.value}
    >
      {options.map((faction) => (
        <ToggleGroupItem
          className={css[`color-active-${faction.code}`]}
          data-testid={`filters-faction-${faction.code}`}
          key={faction.code}
          tooltip={faction.name}
          value={faction.code}
        >
          <FactionIconFancy code={faction.code} />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
