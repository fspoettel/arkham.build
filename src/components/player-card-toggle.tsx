import SvgAutoFail from "./icons/auto-fail";
import SvgInvestigator from "./icons/investigator";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

export function PlayerCardToggle() {
  return (
    <ToggleGroup type="single" defaultValue="player" icons>
      <ToggleGroupItem value="player">
        <SvgInvestigator />
      </ToggleGroupItem>
      <ToggleGroupItem value="investigator">
        <SvgAutoFail />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
