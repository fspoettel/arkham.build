import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { useStore } from "@/store";
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

  return (
    <Field bordered className={css["show-unusable-filter"]}>
      <Checkbox
        checked={checked}
        id="show-unusable-cards"
        label="Show unusable cards"
        onCheckedChange={onValueChange}
      />
    </Field>
  );
}
