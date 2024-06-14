import { useCallback } from "react";
import { useLocation } from "wouter";

import { useStore } from "@/store";
import { selectActiveList } from "@/store/selectors/lists";

import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

type Props = {
  className?: string;
};

export function CardTypeFilter({ className }: Props) {
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
      className={className}
      defaultValue="player"
      icons
      onValueChange={onToggle}
      type="single"
      value={activeList.cardType}
    >
      <ToggleGroupItem size="small" value="player">
        <i className="icon-per_investigator" />
      </ToggleGroupItem>
      <ToggleGroupItem size="small" value="encounter">
        <i className="icon-auto_fail" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
