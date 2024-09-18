import { useCallback } from "react";
import { useLocation } from "wouter";

import { useStore } from "@/store";
import { selectActiveList } from "@/store/selectors/lists";

import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

type Props = {
  className?: string;
};

export function CardTypeFilter(props: Props) {
  const [pathname] = useLocation();
  const activeList = useStore(selectActiveList);
  const changeList = useStore((state) => state.changeList);

  const onToggle = useCallback(
    (value: string) => {
      changeList(value, pathname);
    },
    [pathname, changeList],
  );

  if (!activeList) return null;

  return (
    <ToggleGroup
      className={props.className}
      defaultValue="player"
      data-testid="toggle-card-type"
      full
      onValueChange={onToggle}
      type="single"
      value={activeList.cardType}
    >
      <ToggleGroupItem
        data-testid="card-type-player"
        value="player"
        tooltip="Show player cards"
      >
        <i className="icon-per_investigator" /> Player
      </ToggleGroupItem>
      <ToggleGroupItem
        value="encounter"
        data-testid="card-type-encounter"
        tooltip="Show encounter cards"
      >
        <i className="icon-auto_fail" /> Campaign
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
