import { useCallback } from "react";
import SvgAutoFail from "./icons/auto-fail";
import SvgInvestigator from "./icons/investigator";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { useStore } from "@/store";
import { CardTypeFilter } from "@/store/slices/filters/types";
import { selectActiveCardType } from "@/store/selectors/filters";

type Props = {
  className?: string;
};

export function PlayerCardToggle({ className }: Props) {
  const cardTypeFilter = useStore(selectActiveCardType);
  const setActiveCardType = useStore((state) => state.setActiveCardType);

  const onToggle = useCallback(
    (value: string) => {
      // TODO: enforce this cast in a selector.
      if (value) setActiveCardType(value as CardTypeFilter);
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
