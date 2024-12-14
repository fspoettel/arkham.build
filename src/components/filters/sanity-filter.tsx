import { useStore } from "@/store";
import {
  selectActiveListFilter,
  selectSanityChanges,
  selectSanityMinMax,
} from "@/store/selectors/lists";
import { isSanityFilterObject } from "@/store/slices/lists.type-guards";
import { assert } from "@/utils/assert";
import type { FilterProps } from "./filters.types";
import { RangeFilter } from "./primitives/range-filter";

export function SanityFilter(props: FilterProps) {
  const { id } = props;

  const filter = useStore((state) => selectActiveListFilter(state, id));

  assert(
    isSanityFilterObject(filter),
    `SanityFilter instantiated with '${filter?.type}'`,
  );

  const changes = selectSanityChanges(filter?.value);

  const { min, max } = useStore(selectSanityMinMax);

  return (
    <RangeFilter
      changes={changes}
      data-testid="filter-sanity"
      id={id}
      min={min}
      max={max}
      open={filter.open}
      title="Sanity"
      value={filter.value}
    />
  );
}
