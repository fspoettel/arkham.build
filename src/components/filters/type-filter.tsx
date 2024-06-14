import { useCallback } from "react";

import { useStore } from "@/store";
import { selectActiveCardType } from "@/store/selectors/filters/shared";
import {
  selectChanges,
  selectOpen,
  selectOptions,
  selectValue,
} from "@/store/selectors/filters/type";
import { Type } from "@/store/services/types";

import { Combobox } from "../ui/combobox/combobox";
import { FilterContainer } from "./filter-container";

export function TypeFilter() {
  const cardType = useStore(selectActiveCardType);
  const changes = useStore(selectChanges);
  const types = useStore(selectOptions);
  const open = useStore(selectOpen);
  const value = useStore(selectValue);

  const setActiveNestedFilter = useStore(
    (state) => state.setActiveNestedFilter,
  );
  const setFilterOpen = useStore((state) => state.setFilterOpen);
  const resetFilter = useStore((state) => state.resetFilterKey);

  const onOpenChange = useCallback(
    (val: boolean) => {
      setFilterOpen(cardType, "type", val);
    },
    [setFilterOpen, cardType],
  );

  const onReset = useCallback(() => {
    resetFilter(cardType, "type");
  }, [resetFilter, cardType]);

  const onSelectType = useCallback(
    (code: string, value: boolean) => {
      setActiveNestedFilter(cardType, "type", code, value);
    },
    [setActiveNestedFilter, cardType],
  );

  const nameRenderer = useCallback((item: Type) => item.name, []);
  const itemToString = useCallback((item: Type) => item.name.toLowerCase(), []);

  return (
    <FilterContainer
      title="Type"
      filterString={changes}
      onReset={onReset}
      onOpenChange={onOpenChange}
      open={open}
    >
      <Combobox
        id={"combobox-filter-type"}
        items={types}
        onSelectItem={onSelectType}
        selectedItems={value}
        placeholder="Add types..."
        label="Type"
        itemToString={itemToString}
        renderItem={nameRenderer}
        renderResult={nameRenderer}
      />
    </FilterContainer>
  );
}
