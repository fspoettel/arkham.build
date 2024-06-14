import { useState } from "react";
import { useStore } from "@/store";
import { StoreState } from "@/store/slices";
import { RangeSelect } from "../ui/range-select";
import { Checkbox } from "../ui/checkbox";

function selectCostMinMax(state: StoreState) {
  const costs = Object.keys(state.lookupTables.cost).map((x) =>
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

export function CostFilter() {
  const [min, max] = useStore(selectCostMinMax);
  const [value, setValue] = useState<[number, number]>([min, max]);

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
    >
      <Checkbox label="Even" id="even" />
      <Checkbox label="Odd" id="odd" />
    </RangeSelect>
  );
}
