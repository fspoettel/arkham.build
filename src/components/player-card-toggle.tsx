import SvgInvestigator from "./icons/investigator";
import SvgTokenAutoFailOverlay from "./icons/token-auto-fail-overlay";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

export function PlayerCardToggle() {
  return (
    <ToggleGroup type="single" defaultValue="player" icons>
      <ToggleGroupItem value="player">
        <SvgInvestigator />
      </ToggleGroupItem>
      <ToggleGroupItem value="investigator">
        <SvgTokenAutoFailOverlay />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
