import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { useCallback } from "react";
import type { SettingProps } from "./types";

export function ShowPreviewsSetting(props: SettingProps) {
  const { settings, updateSettings } = props;

  const onCheckedChange = useCallback(
    (val: boolean | string) => {
      updateSettings((settings) => ({ ...settings, showPreviews: !!val }));
    },
    [updateSettings],
  );

  return (
    <Field
      bordered
      helpText="When this is checked, unreleased cards will be shown in the application and can be added to decks."
    >
      <Checkbox
        checked={settings.showPreviews}
        data-testid="settings-show-previews"
        id="show-previews"
        label="Show previews"
        name="show-previews"
        onCheckedChange={onCheckedChange}
      />
    </Field>
  );
}
