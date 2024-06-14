import { useState } from "react";
import { CARD_LEVEL_MAX, CARD_LEVEL_MIN } from "@/store/constants";
import { RangeSelect } from "../ui/range-select";
import { Checkbox } from "../ui/checkbox";

export function LevelFilter() {
  const [value, setValue] = useState<[number, number]>([
    CARD_LEVEL_MIN,
    CARD_LEVEL_MAX,
  ]);
  return (
    <RangeSelect
      id="level-select"
      label="Level"
      min={CARD_LEVEL_MIN}
      max={CARD_LEVEL_MAX}
      onValueChange={(val) => {
        setValue([val[0], val[1]]);
      }}
      value={value}
    >
      <Checkbox label="Exceptional" id="exceptional" />
      <Checkbox label="Non-exceptional" id="non-exceptional" />
    </RangeSelect>
  );
}
