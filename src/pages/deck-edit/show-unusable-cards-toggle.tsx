import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { HotkeyTooltip } from "@/components/ui/hotkey";
import { useStore } from "@/store";
import { useHotkey } from "@/utils/use-hotkey";
import { useCallback } from "react";
import css from "./deck-edit.module.css";

export function ShowUnusableCardsToggle() {
  const checked = useStore((state) => state.ui.showUnusableCards);
  const setChecked = useStore((state) => state.setShowUnusableCards);

  const onValueChange = useCallback(
    (val: boolean) => {
      setChecked(val);
    },
    [setChecked],
  );

  const onHotkey = useCallback(() => {
    setChecked(!checked);
  }, [checked, setChecked]);

  useHotkey("alt+u", onHotkey);

  return (
    <Field bordered className={css["show-unusable-filter"]}>
      <HotkeyTooltip keybind="alt+u" description="Show unusable cards">
        <Checkbox
          checked={checked}
          id="show-unusable-cards"
          label="Show unusable cards"
          onCheckedChange={onValueChange}
        />
      </HotkeyTooltip>
    </Field>
  );
}
