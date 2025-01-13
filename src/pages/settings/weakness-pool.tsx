import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { useCallback } from "react";
import type { SettingProps } from "./types";

export function WeaknessPoolSetting(props: SettingProps) {
  const { settings, updateSettings } = props;

  const onCheckWeaknessPool = useCallback(
    (val: boolean | string) => {
      updateSettings((settings) => ({
        ...settings,
        useLimitedPoolForWeaknessDraw: !!val,
      }));
    },
    [updateSettings],
  );

  return (
    <Field
      bordered
      helpText="When this is checked, the random basic weakness draw will respect the limited card pool of a deck if one is defined."
    >
      <Checkbox
        checked={settings.useLimitedPoolForWeaknessDraw}
        data-testid="settings-weakness-pool"
        id="weakness-pool"
        label="Use limited card pool for random basic weakness draws"
        name="weakness-pool"
        onCheckedChange={onCheckWeaknessPool}
      />
    </Field>
  );
}
