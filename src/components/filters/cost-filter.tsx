import { useStore } from "@/store";
import { selectActiveListFilter } from "@/store/selectors/lists";
import { selectCostChanges, selectCostMinMax } from "@/store/selectors/lists";
import { isCostFilterObject } from "@/store/slices/lists.type-guards";
import { assert } from "@/utils/assert";
import { useCallback, useMemo } from "react";
import { Checkbox } from "../ui/checkbox";
import { CheckboxGroup } from "../ui/checkboxgroup";
import { RangeSelect } from "../ui/range-select";
import type { FilterProps } from "./filters.types";
import { FilterContainer } from "./primitives/filter-container";

export function CostFilter({ id, resolvedDeck }: FilterProps) {
  const filter = useStore((state) => selectActiveListFilter(state, id));
  assert(
    isCostFilterObject(filter),
    `CostFilter instantiated with '${filter?.type}'`,
  );

  const { min, max } = useStore((state) =>
    selectCostMinMax(state, resolvedDeck),
  );
  const changes = selectCostChanges(filter.value);

  const setFilter = useStore((state) => state.setFilterValue);
  const resetFilter = useStore((state) => state.resetFilter);
  const setFilterOpen = useStore((state) => state.setFilterOpen);

  const resetActiveCost = useCallback(() => {
    resetFilter(id);
  }, [resetFilter, id]);

  const onValueCommit = useCallback(
    (val: number[]) => {
      setFilter(id, {
        range: [val[0], val[1]],
      });
    },
    [setFilter, id],
  );

  const onSetEven = useCallback(
    (val: boolean | string) => {
      setFilter(id, {
        even: !!val,
      });
    },
    [setFilter, id],
  );

  const onSetOdd = useCallback(
    (val: boolean | string) => {
      setFilter(id, {
        odd: !!val,
      });
    },
    [setFilter, id],
  );

  const onSetX = useCallback(
    (val: boolean | string) => {
      setFilter(id, {
        x: !!val,
      });
    },
    [setFilter, id],
  );

  const onSetNoCost = useCallback(
    (val: boolean | string) => {
      setFilter(id, {
        nocost: !!val,
      });
    },
    [setFilter, id],
  );

  const onOpenChange = useCallback(
    (val: boolean) => {
      if (val && !filter.value.range) {
        setFilter(id, {
          range: [min, max],
        });
      }
      setFilterOpen(id, val);
    },
    [min, max, id, filter.value.range, setFilter, setFilterOpen],
  );

  const rangeValue = useMemo(
    () => (filter.value.range as [number, number]) ?? [min, max],
    [filter.value.range, min, max],
  );

  return (
    <FilterContainer
      data-testid="filters-cost"
      filterString={changes}
      onOpenChange={onOpenChange}
      onReset={resetActiveCost}
      open={filter.open}
      title="Cost"
    >
      <RangeSelect
        data-testid="filters-cost-range"
        id="cost-select"
        label="Cost"
        max={max}
        min={min}
        onValueCommit={onValueCommit}
        value={rangeValue}
      />
      <CheckboxGroup cols={2}>
        <Checkbox
          data-testid="filters-cost-even"
          checked={filter.value.even}
          id="cost-even"
          label="Even"
          onCheckedChange={onSetEven}
        />
        <Checkbox
          data-testid="filters-cost-x"
          checked={filter.value.x}
          id="cost-x"
          label={<i className="icon-x" />}
          onCheckedChange={onSetX}
        />
        <Checkbox
          data-testid="filters-cost-odd"
          checked={filter.value.odd}
          id="cost-odd"
          label="Odd"
          onCheckedChange={onSetOdd}
        />
        <Checkbox
          data-testid="filters-cost-nocost"
          checked={filter.value.nocost}
          id="cost-nocost"
          label="No cost"
          onCheckedChange={onSetNoCost}
        />
      </CheckboxGroup>
    </FilterContainer>
  );
}
