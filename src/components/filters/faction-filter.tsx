import { useStore } from "@/store";
import {
  selectActiveListFilter,
  selectFactionOptions,
} from "@/store/selectors/lists";
import { isFactionFilterObject } from "@/store/slices/lists.type-guards";
import { assert } from "@/utils/assert";
import { useCallback } from "react";
import { FactionToggle } from "../faction-toggle";
import { useFilterCallbacks } from "./primitives/filter-hooks";

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

  const { onChange } = useFilterCallbacks(id);

  const onValueChange = useCallback(
    (value: string[]) => {
      onChange(value);
    },
    [onChange],
  );

  return (
    <FactionToggle
      options={options}
      value={filter.value}
      onValueChange={onValueChange}
    />
  );
}
