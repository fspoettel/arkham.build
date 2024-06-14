import { Combobox } from "@/components/ui/combobox/combobox";
import { useStore } from "@/store";
import { sortAlphabetical } from "@/store/lib/sorting";
import type { StoreState } from "@/store/slices";

type Props = {
  disabled?: boolean;
  id: string;
  limit: number;
  onChange: (selections: string[]) => void;
  selections: string[];
};

const selectTraitOptions = (state: StoreState) => {
  const types = Object.keys(state.lookupTables.traits).map((code) => ({
    code,
  }));
  types.sort((a, b) => sortAlphabetical(a.code, b.code));
  return types;
};

export function CustomizationChooseTraits({
  disabled,
  id,
  limit,
  onChange,
  selections,
}: Props) {
  const traits = useStore(selectTraitOptions);

  return (
    <Combobox
      disabled={disabled}
      id={`${id}-choose-trait`}
      items={traits}
      label="Traits"
      limit={limit}
      onValueChange={onChange}
      placeholder="Select traits..."
      selectedItems={selections}
    />
  );
}
