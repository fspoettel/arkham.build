import { useCallback } from "react";
import SvgAutoFail from "@/assets/icons/auto_fail.svg?react";
import SvgInvestigator from "@/assets/icons/investigator.svg?react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { useStore } from "@/store";
import { CardTypeFilter as CardTypeFilterT } from "@/store/slices/filters/types";
import { selectActiveCardType } from "@/store/selectors/filters";

type Props = {
  className?: string;
};

export function CardTypeFilter({ className }: Props) {
  const cardTypeFilter = useStore(selectActiveCardType);
  const setActiveCardType = useStore((state) => state.setActiveCardType);

  const onToggle = useCallback(
    (value: string) => {
      // TODO: enforce this cast in a selector.
      if (value) setActiveCardType(value as CardTypeFilterT);
    },
    [setActiveCardType],
  );

  return (
    <ToggleGroup
      className={className}
      defaultValue="player"
      icons
      onValueChange={onToggle}
      type="single"
      value={cardTypeFilter}
    >
      <ToggleGroupItem value="player">
        <SvgInvestigator />
      </ToggleGroupItem>
      <ToggleGroupItem value="encounter">
        <SvgAutoFail />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
