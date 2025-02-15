import { Combobox } from "@/components/ui/combobox/combobox";
import { useStore } from "@/store";
import { sortAlphabetical } from "@/store/lib/sorting";
import type { StoreState } from "@/store/slices";
import { useTranslation } from "react-i18next";
import { createSelector } from "reselect";

type Props = {
  disabled?: boolean;
  id: string;
  limit: number;
  onChange: (selections: string[]) => void;
  readonly?: boolean;
  selections: string[];
};

const selectTraitOptions = createSelector(
  (state: StoreState) => state.lookupTables.traits,
  (traits) =>
    Object.keys(traits)
      .map((code) => ({ code }))
      .sort((a, b) => sortAlphabetical(a.code, b.code)),
);

export function CustomizationChooseTraits(props: Props) {
  const { disabled, id, limit, onChange, readonly, selections } = props;
  const traits = useStore(selectTraitOptions);
  const { t } = useTranslation();

  return (
    <Combobox
      disabled={disabled}
      id={`${id}-choose-trait`}
      items={traits}
      label={t("common.trait", { count: limit })}
      limit={limit}
      readonly={readonly}
      onValueChange={onChange}
      placeholder={t("deck_edit.customizable.traits_placeholder", {
        count: limit,
      })}
      selectedItems={selections}
    />
  );
}
