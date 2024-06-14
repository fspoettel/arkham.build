import { ToggleGroup, ToggleGroupItem } from "./primitives/toggle-group";

export function LevelToggle() {
  return (
    <ToggleGroup full type="single">
      <ToggleGroupItem value="0">Level 0</ToggleGroupItem>
      <ToggleGroupItem value="1-5">Level 1-5</ToggleGroupItem>
    </ToggleGroup>
  );
}
