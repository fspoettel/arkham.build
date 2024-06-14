import { useStore } from "@/store";
import { selectActiveLevel } from "@/store/selectors/filters";
import { RangeSelect } from "../ui/range-select";
import { Checkbox } from "../ui/checkbox";
import { Collapsible, CollapsibleContent } from "../ui/collapsible";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { CheckboxGroup } from "../ui/checkboxgroup";

import css from "./level-filter.module.css";
import { LevelFilter as LevelFilterT } from "@/store/slices/filters/types";
import { useCallback } from "react";

function getToggleValue(value: [number, number] | undefined) {
  if (!value) return "";
  if (value[0] === 0 && value[1] === 0) return "0";
  if (value[0] === 1 && value[1] === 5) return "1-5";
  return "";
}

export function LevelFilter() {
  const activeLevel = useStore(selectActiveLevel);
  const setActiveLevelShortcut = useStore(
    (state) => state.setActiveLevelShortcut,
  );

  const setFilter = useStore((store) => store.setActiveFilter);
  const resetFilterKey = useStore((store) => store.resetFilterKey);

  const setValue = useCallback(
    function setValue<K extends keyof LevelFilterT>(
      key: K,
      value: LevelFilterT[K],
    ) {
      setFilter("player", "level", key, value);
    },
    [setFilter],
  );

  const resetActiveLevel = useCallback(() => {
    resetFilterKey("player", "level");
  }, [resetFilterKey]);

  const onOpenChange = useCallback(
    (val: boolean) => {
      if (val) {
        if (!activeLevel.value) {
          setValue("value", [0, 5]);
        }
      } else {
        resetActiveLevel();
      }
    },
    [activeLevel, setValue, resetActiveLevel],
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
    <Collapsible title="Level" onOpenChange={onOpenChange}>
      <ToggleGroup
        type="single"
        full
        onValueChange={setActiveLevelShortcut}
        value={getToggleValue(activeLevel.value)}
      >
        <ToggleGroupItem value="0">Level 0</ToggleGroupItem>
        <ToggleGroupItem value="1-5">Level 1-5</ToggleGroupItem>
      </ToggleGroup>
      <CollapsibleContent className={css["level-filter-content"]}>
        <RangeSelect
          id="level-select"
          min={0}
          max={5}
          onValueCommit={(val) => {
            setValue("value", [val[0], val[1]]);
          }}
          value={activeLevel.value ?? [0, 5]}
        />
        <CheckboxGroup>
          <Checkbox
            label="Exceptional"
            id="exceptional"
            onCheckedChange={onSetExceptional}
            checked={activeLevel.exceptional}
          />
          <Checkbox
            label="Non-exceptional"
            id="nonexceptional"
            onCheckedChange={onSetNonexceptional}
            checked={activeLevel.nonexceptional}
          />
        </CheckboxGroup>
      </CollapsibleContent>
    </Collapsible>
  );
}
