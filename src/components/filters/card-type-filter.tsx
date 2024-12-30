import { useStore } from "@/store";
import { selectActiveList } from "@/store/selectors/lists";
import { useHotkey } from "@/utils/use-hotkey";
import { useCallback } from "react";
import { HotkeyTooltip } from "../ui/hotkey";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

type Props = {
  className?: string;
};

export function CardTypeFilter(props: Props) {
  const activeList = useStore(selectActiveList);
  const changeList = useStore((state) => state.changeList);

  const onToggle = useCallback(
    (value: string) => {
      changeList(value, window.location.href);
    },
    [changeList],
  );

  useHotkey("alt+p", () => onToggle("player"));
  useHotkey("alt+c", () => onToggle("encounter"));

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
      <HotkeyTooltip keybind="alt+p" description="Player cards">
        <ToggleGroupItem data-testid="card-type-player" value="player">
          <i className="icon-per_investigator" /> Player
        </ToggleGroupItem>
      </HotkeyTooltip>
      <HotkeyTooltip keybind="alt+c" description="Campaign cards">
        <ToggleGroupItem value="encounter" data-testid="card-type-encounter">
          <i className="icon-auto_fail" /> Campaign
        </ToggleGroupItem>
      </HotkeyTooltip>
    </ToggleGroup>
  );
}
