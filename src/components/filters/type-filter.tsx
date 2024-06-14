import { useStore } from "@/store";
import { Collapsible, CollapsibleContent } from "../ui/collapsible";
import { Combobox } from "../ui/combobox/combobox";
import {
  selectActiveCardType,
  selectActiveTypes,
  selectTypes,
} from "@/store/selectors/filters";
import { useCallback } from "react";

export function TypeFilter() {
  const types = useStore(selectTypes);
  const cardType = useStore(selectActiveCardType);
  const selectedItems = useStore(selectActiveTypes);
  const updateComboboxFilter = useStore((state) => state.toggleComboboxFilter);

  const onSelectItem = useCallback(
    (code: string, value: boolean) => {
      updateComboboxFilter(cardType, "type", code, value);
    },
    [updateComboboxFilter, cardType],
  );

  return (
    <Collapsible title="Types">
      <CollapsibleContent>
        <Combobox
          id={`combobox-filter-types`}
          items={types}
          onSelectItem={onSelectItem}
          selectedItems={selectedItems}
          placeholder="Add card types..."
          label="Card type"
          itemToString={(item) => item.name.toLowerCase()}
          renderItem={(item) => item.name}
          renderResult={(item) => item.name}
        />
      </CollapsibleContent>
    </Collapsible>
  );
}
