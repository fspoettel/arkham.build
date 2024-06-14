import { useCallback } from "react";

import { useStore } from "@/store";
import {
  selectChanges,
  selectOpen,
  selectOptions,
  selectValue,
} from "@/store/selectors/filters/action";
import { selectActiveCardType } from "@/store/selectors/filters/shared";
import { Trait } from "@/store/slices/filters/types";
import { capitalize } from "@/utils/capitalize";

import { Combobox } from "../ui/combobox/combobox";
import { FilterContainer } from "./filter-container";

export function ActionFilter() {
  const cardType = useStore(selectActiveCardType);
  const changes = useStore(selectChanges);
  const actions = useStore(selectOptions);
  const open = useStore(selectOpen);
  const value = useStore(selectValue);

  const setActiveNestedFilter = useStore(
    (state) => state.setActiveNestedFilter,
  );
  const setFilterOpen = useStore((state) => state.setFilterOpen);
  const resetFilter = useStore((state) => state.resetFilterKey);

  const nameRenderer = useCallback((item: Trait) => capitalize(item.code), []);
  const itemToString = useCallback(
    (item: Trait) => item.code.toLowerCase(),
    [],
  );

  const onSelectAction = useCallback(
    (code: string, value: boolean) => {
      setActiveNestedFilter(cardType, "action", code, value);
    },
    [setActiveNestedFilter, cardType],
  );

  const onOpenChange = useCallback(
    (val: boolean) => {
      setFilterOpen(cardType, "action", val);
    },
    [setFilterOpen, cardType],
  );

  const onReset = useCallback(() => {
    resetFilter(cardType, "action");
  }, [resetFilter, cardType]);

  return (
    <FilterContainer
      title="Action"
      filterString={changes}
      onReset={onReset}
      onOpenChange={onOpenChange}
      open={open}
    >
      <Combobox
        id={"combobox-filter-action"}
        items={actions}
        onSelectItem={onSelectAction}
        selectedItems={value}
        placeholder="Add actions..."
        label="Actions"
        itemToString={itemToString}
        renderItem={nameRenderer}
        renderResult={nameRenderer}
      />
    </FilterContainer>
  );
}
