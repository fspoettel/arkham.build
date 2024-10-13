import { Field, FieldLabel } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { useStore } from "@/store";
import { selectTabooSetOptions } from "@/store/selectors/lists";
import type { SettingsState } from "@/store/slices/settings.types";
import { formatTabooSet } from "@/utils/formatting";

type Props = {
  settings: SettingsState;
  updateSettings: React.Dispatch<React.SetStateAction<SettingsState>>;
};

export function TabooSet(props: Props) {
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
        emptyLabel="No taboo list"
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
