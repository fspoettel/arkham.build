import { Combobox } from "@/components/ui/combobox/combobox";
import { useStore } from "@/store";
import type { Coded } from "@/store/services/types";
import type { StoreState } from "@/store/slices";

type Props = {
  id: string;
  choices: string[];
  limit: number;
};

const selectPlayerTraitOptions = (state: StoreState) => {
  const types = Object.keys(
    state.lookupTables.traitsByCardTypeSeletion["player"],
  ).map((code) => ({ code }));
  types.sort((a, b) => a.code.localeCompare(b.code));
  return types;
};

export function CustomizationChooseTraits({ choices, id, limit }: Props) {
  const traits = useStore(selectPlayerTraitOptions);

  const selectedItems = choices.reduce<Record<string, Coded>>((acc, curr) => {
    if (curr) acc[curr] = { code: curr };
    return acc;
  }, {});

  return (
    <Combobox
      label="Traits"
      id={`${id}-choose-trait`}
      disabled={Object.values(selectedItems).length === limit}
      items={traits}
      selectedItems={selectedItems}
      placeholder="Select traits..."
    />
  );
}
