import { useCallback, useState } from "react";

import { useStore } from "@/store";
import { selectActiveLevel } from "@/store/selectors/filters/level";
import { LevelFilter as LevelFilterSchema } from "@/store/slices/filters/types";

import css from "./level-filter.module.css";

import { Checkbox } from "../ui/checkbox";
import { CheckboxGroup } from "../ui/checkboxgroup";
import { Collapsible, CollapsibleContent } from "../ui/collapsible";
import { RangeSelect } from "../ui/range-select";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

function getToggleValue(value: [number, number] | undefined) {
  if (!value) return "";
  if (value[0] === 0 && value[1] === 0) return "0";
  if (value[0] === 1 && value[1] === 5) return "1-5";
  return "";
}

export function LevelFilter() {
  const [open, setOpen] = useState(false);
  const activeLevel = useStore(selectActiveLevel);
  const setActiveLevelShortcut = useStore(
    (state) => state.setActiveLevelShortcut,
  );

  const setFilter = useStore((store) => store.setActiveFilter);
  const resetFilterKey = useStore((store) => store.resetFilterKey);

  const setValue = useCallback(
    function setValue<K extends keyof LevelFilterSchema>(
      key: K,
      value: LevelFilterSchema[K],
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
      setOpen(val);
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
    <Collapsible
      open={open}
      className={css["level-filter"]}
      title="Level"
      onOpenChange={onOpenChange}
    >
      {!open && (
        <ToggleGroup
          type="single"
          full
          onValueChange={setActiveLevelShortcut}
          value={getToggleValue(activeLevel.value)}
        >
          <ToggleGroupItem value="0">Level 0</ToggleGroupItem>
          <ToggleGroupItem value="1-5">Level 1-5</ToggleGroupItem>
        </ToggleGroup>
      )}
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
