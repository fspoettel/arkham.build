import { useCallback } from "react";

import { useStore } from "@/store";
import { selectActiveCardType } from "@/store/selectors/filters";
import type { CardTypeFilter as CardTypeFilterType } from "@/store/slices/filters/types";

import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

type Props = {
  className?: string;
};

export function CardTypeFilter({ className }: Props) {
  const cardTypeFilter = useStore(selectActiveCardType);
  const setActiveCardType = useStore((state) => state.setActiveCardType);

  const onToggle = useCallback(
    (value: CardTypeFilterType) => {
      if (value) setActiveCardType(value);
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
      <ToggleGroupItem value="player" size="small">
        <i className="icon-per_investigator" />
      </ToggleGroupItem>
      <ToggleGroupItem value="encounter" size="small">
        <i className="icon-auto_fail" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
