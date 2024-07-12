import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import type { SettingsState } from "@/store/slices/settings.types";
import { useState } from "react";

type Props = {
  settings: SettingsState;
};

export function General({ settings }: Props) {
  const [hideWeaknessesByDefault, setHideWeaknessesByDefault] = useState(
    settings.hideWeaknessesByDefault,
  );

  const onCheckHideWeaknesses = (val: boolean | string) => {
    setHideWeaknessesByDefault(!!val);
  };

  return (
    <Field
      bordered
      helpText={
        <>
          When this is checked, weaknesses are hidden in player card lists by
          default and need to be enabled in the <strong>Subtype</strong> filter
          to be visible.
        </>
      }
    >
      <Checkbox
        checked={hideWeaknessesByDefault}
        label="Hide weaknesses in player card lists by default"
        id="hide-weaknesses-by-default"
        name="hide-weaknesses-by-default"
        onCheckedChange={onCheckHideWeaknesses}
      />
    </Field>
  );
}
