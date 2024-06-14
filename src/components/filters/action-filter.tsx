import { useStore } from "@/store";
import { Trait } from "@/store/slices/filters/types";
import { useCallback } from "react";
import { Collapsible, CollapsibleContent } from "../ui/collapsible";
import { Combobox } from "../ui/combobox/combobox";
import {
  selectActiveCardType,
  selectActiveActions,
  selectActions,
} from "@/store/selectors/filters";
import { capitalize } from "@/utils/capitalize";

export function ActionFilter() {
  const cardType = useStore(selectActiveCardType);
  const actions = useStore(selectActions);
  const selectedActions = useStore(selectActiveActions);
  const updateComboboxFilter = useStore((state) => state.toggleComboboxFilter);
  const resetFilter = useStore((state) => state.resetFilterKey);

  const nameRenderer = useCallback((item: Trait) => capitalize(item.code), []);
  const itemToString = useCallback(
    (item: Trait) => item.code.toLowerCase(),
    [],
  );

  const onSelectTrait = useCallback(
    (code: string, value: boolean) => {
      updateComboboxFilter(cardType, "action", code, value);
    },
    [updateComboboxFilter, cardType],
  );

  const onOpenChange = useCallback(
    (val: boolean) => {
      if (!val) {
        resetFilter(cardType, "action");
      }
    },
    [cardType, resetFilter],
  );

  return (
    <Collapsible title="Actions" onOpenChange={onOpenChange}>
      <CollapsibleContent>
        <Combobox
          id={"combobox-filter-action"}
          items={actions}
          onSelectItem={onSelectTrait}
          selectedItems={selectedActions}
          placeholder="Add actions..."
          label="Actions"
          itemToString={itemToString}
          renderItem={nameRenderer}
          renderResult={nameRenderer}
        />
      </CollapsibleContent>
    </Collapsible>
  );
}
