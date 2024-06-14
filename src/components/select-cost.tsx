import { useState } from "react";
import { RangeSelect } from "./ui/range-select";
import { useStore } from "@/store";
import { State } from "@/store/schema";

function selectCostMinMax(state: State) {
  const costs = Object.keys(state.indexes["byCost"] ?? {}).map((x) =>
    Number.parseInt(x, 10),
  );

  if (costs.length < 2) {
    throw new TypeError(
      "selector {selectCostMinMax} expects store to contain metadata.",
    );
  }

  costs.sort((a, b) => a - b);

  const min = 0; // arkhamdb data has some cards set to negative values.
  const max = costs[costs.length - 1];
  return [min, max];
}

export function SelectCost() {
  const [min, max] = useStore(selectCostMinMax);

  const [value, setValue] = useState<[number, number]>([min, max]);

  // TODO: add checkboxes for exceptional / non-exceptional.
  return (
    <RangeSelect
      id="level-select"
      label="Cost"
      min={min}
      max={max}
      onValueChange={(val) => {
        setValue([val[0], val[1]]);
      }}
      value={value}
    />
  );
}
