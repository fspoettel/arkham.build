import { useCallback } from "react";

import { useStore } from "@/store";
import {
  selectFilterOpen,
  selectLevelChanges,
  selectLevelValue,
} from "@/store/selectors/filters";
import type { LevelFilter as LevelFilterType } from "@/store/slices/filters.types";

import { Checkbox } from "../ui/checkbox";
import { CheckboxGroup } from "../ui/checkboxgroup";
import { RangeSelect } from "../ui/range-select";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { FilterContainer } from "./primitives/filter-container";

function getToggleValue(value: [number, number] | undefined) {
  if (!value) return "";
  if (value[0] === 0 && value[1] === 0) return "0";
  if (value[0] === 1 && value[1] === 5) return "1-5";
  return "";
}

export function LevelFilter() {
  const changes = useStore(selectLevelChanges);
  const open = useStore(selectFilterOpen("player", "level"));
  const value = useStore(selectLevelValue);

  const applyLevelShortcut = useStore((state) => state.applyLevelShortcut);
  const setFilter = useStore((state) => state.setNestedFilter);
  const resetFilter = useStore((state) => state.resetFilterKey);
  const setFilterOpen = useStore((state) => state.setFilterOpen);

  const setValue = useCallback(
    function setValue<K extends keyof LevelFilterType["value"]>(
      key: K,
      value: LevelFilterType["value"][K],
    ) {
      setFilter("player", "level", key, value);
    },
    [setFilter],
  );

  const resetActiveLevel = useCallback(() => {
    resetFilter("player", "level");
  }, [resetFilter]);

  const onOpenChange = useCallback(
    (val: boolean) => {
      if (val && !value.range) setValue("range", [0, 5]);
      setFilterOpen("player", "level", val);
    },
    [value, setValue, setFilterOpen],
  );

  const onSetExceptional = useCallback(
    (val: boolean | string) => {
      setValue("exceptional", !!val);
    },
    [setValue],
  );

  const onSetNonexceptional = useCallback(
    (val: boolean | string) => {
      setValue("nonexceptional", !!val);
    },
    [setValue],
  );

  return (
    <FilterContainer
      alwaysShowFilterString
      filterString={changes}
      nonCollapsibleContent={
        !open && (
          <ToggleGroup
            full
            onValueChange={applyLevelShortcut}
            type="single"
            value={getToggleValue(value.range)}
          >
            <ToggleGroupItem size="small-type" value="0">
              Level 0
            </ToggleGroupItem>
            <ToggleGroupItem size="small-type" value="1-5">
              Level 1-5
            </ToggleGroupItem>
          </ToggleGroup>
        )
      }
      onOpenChange={onOpenChange}
      onReset={resetActiveLevel}
      open={open}
      title="Level"
    >
      <RangeSelect
        id="level-select"
        label="Level"
        max={5}
        min={0}
        onValueCommit={(val) => {
          setValue("range", [val[0], val[1]]);
        }}
        value={value.range ?? [0, 5]}
      />
      <CheckboxGroup>
        <Checkbox
          checked={value.exceptional}
          id="exceptional"
          label="Exceptional"
          onCheckedChange={onSetExceptional}
        />
        <Checkbox
          checked={value.nonexceptional}
          id="nonexceptional"
          label="Non-exceptional"
          onCheckedChange={onSetNonexceptional}
        />
      </CheckboxGroup>
    </FilterContainer>
  );
}
