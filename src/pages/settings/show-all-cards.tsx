import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { useCallback } from "react";
import type { SettingProps } from "./types";

export function ShowAllCardsSetting(props: SettingProps) {
  const { settings, updateSettings } = props;

  const onCheckShowAll = useCallback(
    (val: boolean | string) => {
      updateSettings((settings) => ({ ...settings, showAllCards: !!val }));
    },
    [updateSettings],
  );

  return (
    <Field
      bordered
      helpText="When this is checked, the collection settings below are ignored when checking card ownership in card and deck lists."
    >
      <Checkbox
        checked={settings.showAllCards}
        data-testid="settings-show-all"
        id="show-all-cards"
        label="Show all cards as owned"
        name="show-all-cards"
        onCheckedChange={onCheckShowAll}
      />
    </Field>
  );
}
