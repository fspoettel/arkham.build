import { useStore } from "@/store";
import { RangeSelect } from "../ui/range-select";
import { Checkbox } from "../ui/checkbox";
import { Collapsible, CollapsibleContent } from "../ui/collapsible";
import { CheckboxGroup } from "../ui/checkboxgroup";
import SvgX from "@/assets/icons/x.svg?react";
import {
  selectActiveCardType,
  selectActiveCost,
  selectCostMinMax,
} from "@/store/selectors/filters";
import { useCallback } from "react";
import { CostFilter as CostFilterT } from "@/store/slices/filters/types";

export function CostFilter() {
  const [min, max] = useStore(selectCostMinMax);
  const cardType = useStore(selectActiveCardType);
  const cost = useStore(selectActiveCost);
  const setFilter = useStore((state) => state.setActiveFilter);
  const resetFilter = useStore((state) => state.resetFilterKey);

  const setValue = useCallback(
    function setValue<K extends keyof CostFilterT>(
      key: K,
      val: CostFilterT[K],
    ) {
      setFilter(cardType, "cost", key, val);
    },
    [cardType, setFilter],
  );

  const resetActiveCost = useCallback(() => {
    resetFilter(cardType, "cost");
  }, [cardType, resetFilter]);

  const onValueCommit = useCallback(
    (val: number[]) => {
      setValue("value", [val[0], val[1]]);
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

  return (
    <Collapsible
      title="Cost"
      onOpenChange={(val) => {
        if (val) {
          setValue("value", [min, max]);
        } else {
          resetActiveCost();
        }
      }}
    >
      <CollapsibleContent>
        <RangeSelect
          id="cost-select"
          min={min}
          max={max}
          onValueCommit={onValueCommit}
          value={cost.value ?? [min, max]}
        />
        <CheckboxGroup>
          <Checkbox
            label="Even"
            id="cost-even"
            onCheckedChange={onSetEven}
            checked={cost.even}
          />
          <Checkbox
            label="Odd"
            id="cost-odd"
            onCheckedChange={onSetOdd}
            checked={cost.odd}
          />
          <Checkbox
            label={<SvgX />}
            id="cost-x"
            onCheckedChange={onSetX}
            checked={cost.x}
          />
        </CheckboxGroup>
      </CollapsibleContent>
    </Collapsible>
  );
}
