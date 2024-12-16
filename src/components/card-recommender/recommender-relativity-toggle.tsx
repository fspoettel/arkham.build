import { useStore } from "@/store";
import { useCallback } from "react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

export type RecommenderRelativityToggleProps = {
  investigator: string;
};
export function RecommenderRelativityToggle(
  props: RecommenderRelativityToggleProps,
) {
  const isRelative = useStore((state) => state.recommender.isRelative);
  const setIsRelative = useStore((state) => state.setIsRelative);
  const onToggleChange = useCallback(
    (value: string) => {
      setIsRelative(value === "true");
    },
    [setIsRelative],
  );
  return (
    <ToggleGroup
      type="single"
      onValueChange={onToggleChange}
      value={isRelative ? "true" : "false"}
    >
      <ToggleGroupItem
        value={"false"}
        tooltip={`Count how many ${props.investigator} decks each card is used in`}
      >
        Absolute
      </ToggleGroupItem>
      <ToggleGroupItem
        value={"true"}
        tooltip={`Count how many ${props.investigator} decks each card is used in compared to other investigators who have access to it`}
      >
        Relative
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
