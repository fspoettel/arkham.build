import { useStore } from "@/store";
import {
  selectActiveListFilter,
  selectFactionOptions,
} from "@/store/selectors/lists";
import { isFactionFilterObject } from "@/store/slices/lists.type-guards";
import { assert } from "@/utils/assert";
import { useCallback } from "react";
import { FactionToggle } from "../faction-toggle";

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
    <FactionToggle
      options={options}
      value={filter.value}
      onValueChange={onValueChange}
    />
  );
}
