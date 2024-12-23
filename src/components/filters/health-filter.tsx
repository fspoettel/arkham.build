import { useStore } from "@/store";
import {
  selectActiveListFilter,
  selectHealthChanges,
  selectHealthMinMax,
} from "@/store/selectors/lists";
import { isHealthFilterObject } from "@/store/slices/lists.type-guards";
import { assert } from "@/utils/assert";
import type { FilterProps } from "./filters.types";
import { RangeFilter } from "./primitives/range-filter";

export function HealthFilter(props: FilterProps) {
  const { id, resolvedDeck } = props;

  const filter = useStore((state) => selectActiveListFilter(state, id));

  assert(
    isHealthFilterObject(filter),
    `SanityFilter instantiated with '${filter?.type}'`,
  );

  const changes = selectHealthChanges(filter?.value);

  const { min, max } = useStore((state) =>
    selectHealthMinMax(state, resolvedDeck),
  );

  return (
    <RangeFilter
      changes={changes}
      data-testid="filter-health"
      id={id}
      min={min}
      max={max}
      open={filter.open}
      title="Health"
      value={filter.value}
    />
  );
}
