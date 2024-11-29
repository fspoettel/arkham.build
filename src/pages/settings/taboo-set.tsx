import { Field, FieldLabel } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { useStore } from "@/store";
import { selectTabooSetOptions } from "@/store/selectors/lists";
import { formatTabooSet } from "@/utils/formatting";
import type { SettingProps } from "./types";

export function TabooSetSetting(props: SettingProps) {
  const { settings, updateSettings } = props;
  const tabooSets = useStore(selectTabooSetOptions);

  const onChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    if (evt.target instanceof HTMLSelectElement) {
      const value = +evt.target.value || undefined;
      updateSettings((settings) => ({ ...settings, tabooSetId: value }));
    }
  };

  return (
    <Field bordered>
      <FieldLabel htmlFor="taboo-set">Default taboo list</FieldLabel>
      <Select
        data-testid="settings-taboo-set"
        emptyLabel="None"
        id="taboo-set"
        name="taboo-set"
        onChange={onChange}
        value={settings.tabooSetId ?? ""}
        options={tabooSets.map((set) => {
          return { label: formatTabooSet(set), value: set.id };
        })}
      />
    </Field>
  );
}
