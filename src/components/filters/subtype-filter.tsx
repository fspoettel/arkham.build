import { useCallback } from "react";

import { useStore } from "@/store";
import { selectActiveCardType } from "@/store/selectors/filters/shared";
import {
  selectChanges,
  selectOpen,
  selectOptions,
  selectValue,
} from "@/store/selectors/filters/subtype";
import { SubType } from "@/store/services/types";

import { Combobox } from "../ui/combobox/combobox";
import { FilterContainer } from "./filter-container";

export function SubtypeFilter() {
  const cardType = useStore(selectActiveCardType);
  const changes = useStore(selectChanges);
  const subtypes = useStore(selectOptions);
  const open = useStore(selectOpen);
  const value = useStore(selectValue);

  const setActiveNestedFilter = useStore(
    (state) => state.setActiveNestedFilter,
  );
  const setFilterOpen = useStore((state) => state.setFilterOpen);
  const resetFilter = useStore((state) => state.resetFilterKey);

  const onOpenChange = useCallback(
    (val: boolean) => {
      setFilterOpen(cardType, "subtype", val);
    },
    [setFilterOpen, cardType],
  );

  const onReset = useCallback(() => {
    resetFilter(cardType, "subtype");
  }, [resetFilter, cardType]);

  const onSelectSubType = useCallback(
    (code: string, value: boolean) => {
      setActiveNestedFilter(cardType, "subtype", code, value);
    },
    [setActiveNestedFilter, cardType],
  );

  const nameRenderer = useCallback((item: SubType) => item.name, []);

  const itemToString = useCallback(
    (item: SubType) => item.name.toLowerCase(),
    [],
  );

  return (
    <FilterContainer
      title="Subtype"
      filterString={changes}
      onReset={onReset}
      onOpenChange={onOpenChange}
      open={open}
    >
      <Combobox
        id={"combobox-filter-subtype"}
        items={subtypes}
        onSelectItem={onSelectSubType}
        selectedItems={value}
        placeholder="Add subtypes..."
        label="Subtype"
        itemToString={itemToString}
        renderItem={nameRenderer}
        renderResult={nameRenderer}
      />
    </FilterContainer>
  );
}
