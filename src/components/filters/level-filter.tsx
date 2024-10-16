import { useCallback } from "react";

import { useStore } from "@/store";
import {
  selectActiveListFilter,
  selectLevelChanges,
} from "@/store/selectors/lists";
import { isLevelFilterObject } from "@/store/slices/lists.type-guards";
import { assert } from "@/utils/assert";

import { Checkbox } from "../ui/checkbox";
import { CheckboxGroup } from "../ui/checkboxgroup";
import { RangeSelect } from "../ui/range-select";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import type { FilterProps } from "./filters.types";
import { FilterContainer } from "./primitives/filter-container";

function getToggleValue(value: [number, number] | undefined) {
  if (!value) return "";
  if (value[0] === 0 && value[1] === 0) return "0";
  if (value[0] === 1 && value[1] === 5) return "1-5";
  return "";
}

export function LevelFilter({ id }: FilterProps) {
  const filter = useStore((state) => selectActiveListFilter(state, id));
  assert(
    isLevelFilterObject(filter),
    `LevelFilter instantiated with '${filter?.type}'`,
  );

  const changes = selectLevelChanges(filter.value);

  const setFilterValue = useStore((state) => state.setFilterValue);

  const setFilterOpen = useStore((state) => state.setFilterOpen);

  const resetFilter = useStore((state) => state.resetFilter);

  const onChangeRange = useCallback(
    (val: [number, number] | undefined) => {
      setFilterValue(id, {
        range: val,
      });
    },
    [id, setFilterValue],
  );

  const onChangeOpen = useCallback(
    (val: boolean) => {
      if (val && !filter.value.range) {
        onChangeRange([0, 5]);
      }
      setFilterOpen(id, val);
    },
    [onChangeRange, id, filter.value.range, setFilterOpen],
  );

  const onSetExceptional = useCallback(
    (val: boolean) => {
      setFilterValue(id, {
        exceptional: val,
      });
    },
    [setFilterValue, id],
  );

  const onSetNonexceptional = useCallback(
    (val: boolean) => {
      setFilterValue(id, {
        nonexceptional: val,
      });
    },
    [setFilterValue, id],
  );

  const onReset = useCallback(() => {
    resetFilter(id);
  }, [resetFilter, id]);

  const onApplyLevelShortcut = useCallback(
    (value: string) => {
      if (value === "0") {
        setFilterValue(id, {
          range: [0, 0],
        });
      } else if (value === "1-5") {
        setFilterValue(id, {
          range: [1, 5],
        });
      } else {
        setFilterValue(id, {
          range: undefined,
        });
      }
    },
    [id, setFilterValue],
  );

  return (
    <FilterContainer
      alwaysShowFilterString
      filterString={changes}
      nonCollapsibleContent={
        !filter.open && (
          <ToggleGroup
            data-testid="filters-level-shortcut"
            full
            onValueChange={onApplyLevelShortcut}
            type="single"
            value={getToggleValue(filter.value.range)}
          >
            <ToggleGroupItem value="0">Level 0</ToggleGroupItem>
            <ToggleGroupItem value="1-5">Level 1-5</ToggleGroupItem>
          </ToggleGroup>
        )
      }
      onOpenChange={onChangeOpen}
      onReset={onReset}
      open={filter.open}
      title="Level"
    >
      <RangeSelect
        id="level-select"
        label="Level"
        max={5}
        min={0}
        onValueCommit={(val) => {
          onChangeRange([val[0], val[1]]);
        }}
        value={filter.value.range ?? [0, 5]}
      />
      <CheckboxGroup>
        <Checkbox
          checked={filter.value.exceptional}
          id="exceptional"
          label="Exceptional"
          onCheckedChange={onSetExceptional}
        />
        <Checkbox
          checked={filter.value.nonexceptional}
          id="nonexceptional"
          label="Non-exceptional"
          onCheckedChange={onSetNonexceptional}
        />
      </CheckboxGroup>
    </FilterContainer>
  );
}
