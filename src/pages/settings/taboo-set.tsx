import { Field, FieldLabel } from "@/components/ui/field";
import { useStore } from "@/store";
import { selectTabooSetOptions } from "@/store/selectors/lists";
import type { SettingsState } from "@/store/slices/settings.types";
import { formatTabooSet } from "@/utils/formatting";

type Props = {
  settings: SettingsState;
  updateSettings: (settings: React.SetStateAction<SettingsState>) => void;
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
      <select
        data-testid="settings-taboo-set"
        id="taboo-set"
        name="taboo-set"
        onChange={onChange}
        value={settings.tabooSetId ?? ""}
      >
        <option value="">None</option>
        {tabooSets.map((set) => (
          <option key={set.id} value={set.id}>
            {formatTabooSet(set)}
          </option>
        ))}
      </select>
    </Field>
  );
}
