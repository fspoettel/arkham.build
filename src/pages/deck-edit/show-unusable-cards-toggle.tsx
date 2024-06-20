import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";

import css from "./deck-edit.module.css";

type Props = {
  checked: boolean;
  onValueChange: (checked: boolean) => void;
};

export function ShowUnusableCardsToggle({ checked, onValueChange }: Props) {
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
