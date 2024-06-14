import { useCallback } from "react";

import { useStore } from "@/store";
import {
  selectChanges,
  selectOpen,
  selectValue,
} from "@/store/selectors/filters/level";
import { LevelFilter as LevelFilterType } from "@/store/slices/filters/types";

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
  const value = useStore(selectValue);
  const open = useStore(selectOpen);
  const changes = useStore(selectChanges);

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
      if (val) {
        if (!value.range) {
          setValue("range", [0, 5]);
        }
      }

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
      filterString={changes}
      title="Level"
      alwaysShowFilterString
      nonCollapsibleContent={
        !open && (
          <ToggleGroup
            type="single"
            full
            onValueChange={applyLevelShortcut}
            value={getToggleValue(value.range)}
          >
            <ToggleGroupItem value="0" size="small-type">
              Level 0
            </ToggleGroupItem>
            <ToggleGroupItem value="1-5" size="small-type">
              Level 1-5
            </ToggleGroupItem>
          </ToggleGroup>
        )
      }
      onReset={resetActiveLevel}
      onOpenChange={onOpenChange}
      open={open}
    >
      <RangeSelect
        id="level-select"
        min={0}
        max={5}
        onValueCommit={(val) => {
          setValue("range", [val[0], val[1]]);
        }}
        value={value.range ?? [0, 5]}
      />
      <CheckboxGroup>
        <Checkbox
          label="Exceptional"
          id="exceptional"
          onCheckedChange={onSetExceptional}
          checked={value.exceptional}
        />
        <Checkbox
          label="Non-exceptional"
          id="nonexceptional"
          onCheckedChange={onSetNonexceptional}
          checked={value.nonexceptional}
        />
      </CheckboxGroup>
    </FilterContainer>
  );
}
