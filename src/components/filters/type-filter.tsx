import { useCallback } from "react";

import { useStore } from "@/store";
import { Type } from "@/store/graphql/types";
import {
  selectActiveCardType,
  selectActiveTypes,
  selectTypes,
} from "@/store/selectors/filters";

import { Collapsible, CollapsibleContent } from "../ui/collapsible";
import { Combobox } from "../ui/combobox/combobox";

export function TypeFilter() {
  const types = useStore(selectTypes);
  const cardType = useStore(selectActiveCardType);
  const selectedTypes = useStore(selectActiveTypes);
  const resetFilter = useStore((state) => state.resetFilterKey);
  const updateComboboxFilter = useStore((state) => state.toggleComboboxFilter);

  const onOpenChange = useCallback(
    (val: boolean) => {
      if (!val) {
        resetFilter(cardType, "type");
      }
    },
    [cardType, resetFilter],
  );

  const onSelectType = useCallback(
    (code: string, value: boolean) => {
      updateComboboxFilter(cardType, "type", code, value);
    },
    [updateComboboxFilter, cardType],
  );

  const nameRenderer = useCallback((item: Type) => item.name, []);

  const itemToString = useCallback((item: Type) => item.name.toLowerCase(), []);

  return (
    <Collapsible title="Type" onOpenChange={onOpenChange}>
      <CollapsibleContent>
        <Combobox
          id={"combobox-filter-type"}
          items={types}
          onSelectItem={onSelectType}
          selectedItems={selectedTypes}
          placeholder="Add types..."
          label="Type"
          itemToString={itemToString}
          renderItem={nameRenderer}
          renderResult={nameRenderer}
        />
      </CollapsibleContent>
    </Collapsible>
  );
}
