import { useStore } from "@/store";
import { Trait } from "@/store/slices/filters/types";
import { useCallback } from "react";
import { Collapsible, CollapsibleContent } from "../ui/collapsible";
import { Combobox } from "../ui/combobox/combobox";
import {
  selectActiveCardType,
  selectActiveTraits,
  selectTraits,
} from "@/store/selectors/filters";

export function TraitFilter() {
  const cardType = useStore(selectActiveCardType);
  const traits = useStore(selectTraits);
  const selectedTraits = useStore(selectActiveTraits);
  const updateComboboxFilter = useStore((state) => state.toggleComboboxFilter);
  const resetFilter = useStore((state) => state.resetFilterKey);

  const nameRenderer = useCallback((item: Trait) => item.code, []);
  const itemToString = useCallback(
    (item: Trait) => item.code.toLowerCase(),
    [],
  );

  const onSelectTrait = useCallback(
    (code: string, value: boolean) => {
      updateComboboxFilter(cardType, "trait", code, value);
    },
    [updateComboboxFilter, cardType],
  );

  const onOpenChange = useCallback(
    (val: boolean) => {
      if (!val) {
        resetFilter(cardType, "trait");
      }
    },
    [cardType, resetFilter],
  );

  return (
    <Collapsible title="Trait" onOpenChange={onOpenChange}>
      <CollapsibleContent>
        <Combobox
          id={"combobox-filter-trait"}
          items={traits}
          onSelectItem={onSelectTrait}
          selectedItems={selectedTraits}
          placeholder="Add traits..."
          label="Traits"
          itemToString={itemToString}
          renderItem={nameRenderer}
          renderResult={nameRenderer}
        />
      </CollapsibleContent>
    </Collapsible>
  );
}
