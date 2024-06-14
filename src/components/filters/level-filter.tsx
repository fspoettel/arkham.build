import { RangeSelect } from "../ui/range-select";
import { Checkbox } from "../ui/checkbox";
import { CARD_LEVEL_MAX, CARD_LEVEL_MIN } from "@/utils/constants";
import { useStore } from "@/store";
import { selectActiveLevels } from "@/store/selectors/filters";

export function LevelFilter() {
  const activeLevels = useStore(selectActiveLevels);
  const setActiveLevelsValue = useStore((state) => state.setActiveLevelValue);
  const setActiveLevelsFlag = useStore((state) => state.setActiveLevelFlag);

  return (
    <RangeSelect
      id="level-select"
      label="Level"
      min={CARD_LEVEL_MIN}
      max={CARD_LEVEL_MAX}
      onValueChange={(val) => {
        setActiveLevelsValue([val[0], val[1]]);
      }}
      value={activeLevels.value ?? [CARD_LEVEL_MIN, CARD_LEVEL_MAX]}
    >
      <Checkbox
        label="Exceptional"
        id="exceptional"
        onCheckedChange={(value) => setActiveLevelsFlag("exceptional", !!value)}
        checked={activeLevels.exceptional}
      />
      <Checkbox
        label="Non-exceptional"
        id="nonexceptional"
        onCheckedChange={(value) =>
          setActiveLevelsFlag("nonexceptional", !!value)
        }
        checked={activeLevels.nonexceptional}
      />
    </RangeSelect>
  );
}
