import { useCallback } from "react";

import { useStore } from "@/store";
import { SubType } from "@/store/graphql/types";
import {
  selectActiveCardType,
  selectActiveSubtypes,
  selectSubtypes,
} from "@/store/selectors/filters";

import { Collapsible, CollapsibleContent } from "../ui/collapsible";
import { Combobox } from "../ui/combobox/combobox";

export function SubtypeFilter() {
  const subtypes = useStore(selectSubtypes);
  const cardType = useStore(selectActiveCardType);
  const selectedSubtypes = useStore(selectActiveSubtypes);
  const resetFilter = useStore((state) => state.resetFilterKey);
  const updateComboboxFilter = useStore((state) => state.toggleComboboxFilter);

  const onOpenChange = useCallback(
    (val: boolean) => {
      if (!val) {
        resetFilter(cardType, "subtype");
      }
    },
    [cardType, resetFilter],
  );

  const onSelectSubType = useCallback(
    (code: string, value: boolean) => {
      updateComboboxFilter(cardType, "subtype", code, value);
    },
    [updateComboboxFilter, cardType],
  );

  const nameRenderer = useCallback((item: SubType) => item.name, []);

  const itemToString = useCallback(
    (item: SubType) => item.name.toLowerCase(),
    [],
  );

  return (
    <Collapsible title="Subtype" onOpenChange={onOpenChange}>
      <CollapsibleContent>
        <Combobox
          id={"combobox-filter-subtype"}
          items={subtypes}
          onSelectItem={onSelectSubType}
          selectedItems={selectedSubtypes}
          placeholder="Add subtypes..."
          label="Subtype"
          itemToString={itemToString}
          renderItem={nameRenderer}
          renderResult={nameRenderer}
        />
      </CollapsibleContent>
    </Collapsible>
  );
}
