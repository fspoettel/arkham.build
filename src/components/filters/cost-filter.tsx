import { useCallback } from "react";

import { useStore } from "@/store";
import {
  selectActiveCardType,
  selectCostChanges,
  selectCostMinMax,
  selectCostValue,
  selectFilterOpen,
} from "@/store/selectors/filters";
import type { CostFilter as CostFilterType } from "@/store/slices/filters/types";

import { Checkbox } from "../ui/checkbox";
import { CheckboxGroup } from "../ui/checkboxgroup";
import { RangeSelect } from "../ui/range-select";
import { FilterContainer } from "./primitives/filter-container";

type Value = CostFilterType["value"];

export function CostFilter() {
  const [min, max] = useStore(selectCostMinMax);
  const cardType = useStore(selectActiveCardType);
  const changes = useStore(selectCostChanges);
  const value = useStore(selectCostValue);
  const open = useStore(selectFilterOpen(cardType, "cost"));

  const setFilter = useStore((state) => state.setNestedFilter);
  const resetFilter = useStore((state) => state.resetFilterKey);
  const setFilterOpen = useStore((state) => state.setFilterOpen);

  const setValue = useCallback(
    function setValue<K extends keyof Value>(key: K, val: Value[K]) {
      setFilter(cardType, "cost", key, val);
    },
    [cardType, setFilter],
  );

  const resetActiveCost = useCallback(() => {
    resetFilter(cardType, "cost");
  }, [cardType, resetFilter]);

  const onValueCommit = useCallback(
    (val: number[]) => {
      setValue("range", [val[0], val[1]]);
    },
    [setValue],
  );

  const onSetEven = useCallback(
    (val: boolean | string) => {
      setValue("even", !!val);
    },
    [setValue],
  );

  const onSetOdd = useCallback(
    (val: boolean | string) => {
      setValue("odd", !!val);
    },
    [setValue],
  );

  const onSetX = useCallback(
    (val: boolean | string) => {
      setValue("x", !!val);
    },
    [setValue],
  );

  const onOpenChange = useCallback(
    (val: boolean) => {
      if (val && !value.range) setValue("range", [min, max]);
      setFilterOpen(cardType, "cost", val);
    },
    [min, max, setValue, setFilterOpen, cardType, value.range],
  );

  return (
    <FilterContainer
      filterString={changes}
      onOpenChange={onOpenChange}
      onReset={resetActiveCost}
      open={open}
      title="Cost"
    >
      <RangeSelect
        id="cost-select"
        label="Cost"
        max={max}
        min={min}
        onValueCommit={onValueCommit}
        value={value.range ?? [min, max]}
      />
      <CheckboxGroup>
        <Checkbox
          checked={value.even}
          id="cost-even"
          label="Even"
          onCheckedChange={onSetEven}
        />
        <Checkbox
          checked={value.odd}
          id="cost-odd"
          label="Odd"
          onCheckedChange={onSetOdd}
        />
        <Checkbox
          checked={value.x}
          id="cost-x"
          label={<i className="icon-x" />}
          onCheckedChange={onSetX}
        />
      </CheckboxGroup>
    </FilterContainer>
  );
}
