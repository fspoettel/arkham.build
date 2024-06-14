import { useStore } from "@/store";
import { Collapsible, CollapsibleContent } from "../ui/collapsible";
import { Combobox } from "../ui/combobox/combobox";
import {
  selectActiveCardType,
  selectActiveTypes,
  selectTypes,
  selectSubtypes,
  selectActiveSubtypes,
} from "@/store/selectors/filters";
import { useCallback } from "react";
import { SubType, Type } from "@/store/graphql/types";

export function TypeFilter() {
  const types = useStore(selectTypes);
  const subtypes = useStore(selectSubtypes);
  const cardType = useStore(selectActiveCardType);
  const selectedTypes = useStore(selectActiveTypes);
  const selectedSubtypes = useStore(selectActiveSubtypes);
  const resetFilters = useStore((state) => state.resetFilterKeys);
  const updateComboboxFilter = useStore((state) => state.toggleComboboxFilter);

  const onOpenChange = useCallback(
    (val: boolean) => {
      if (!val) {
        resetFilters(cardType, ["type", "subtype"]);
      }
    },
    [cardType, resetFilters],
  );

  const onSelectType = useCallback(
    (code: string, value: boolean) => {
      updateComboboxFilter(cardType, "type", code, value);
    },
    [updateComboboxFilter, cardType],
  );

  const onSelectSubType = useCallback(
    (code: string, value: boolean) => {
      updateComboboxFilter(cardType, "subtype", code, value);
    },
    [updateComboboxFilter, cardType],
  );

  const nameRenderer = useCallback((item: Type | SubType) => item.name, []);

  const itemToString = useCallback(
    (item: Type | SubType) => item.name.toLowerCase(),
    [],
  );

  return (
    <Collapsible title="Types" onOpenChange={onOpenChange}>
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
