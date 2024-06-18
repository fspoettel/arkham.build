import { useCallback } from "react";

import { Combobox } from "@/components/ui/combobox/combobox";
import { useStore } from "@/store";
import type { Coded } from "@/store/services/queries.types";

import { FilterContainer } from "./filter-container";

type Props<T extends Coded> = {
  changes?: string;
  children?: React.ReactNode;
  id: number;
  itemToString?: (val: T) => string;
  nameRenderer?: (val: T) => React.ReactNode;
  title: string;
  open: boolean;
  options: T[];
  placeholder?: string;
  value: string[];
};

export function MultiselectFilter<T extends Coded>({
  changes,
  children,
  id,
  itemToString,
  nameRenderer,
  open,
  options,
  placeholder,
  title,
  value,
}: Props<T>) {
  const setFilterValue = useStore((state) => state.setFilterValue);
  const setFilterOpen = useStore((state) => state.setFilterOpen);
  const resetFilter = useStore((state) => state.resetFilter);

  const onReset = useCallback(() => {
    resetFilter(id);
  }, [resetFilter, id]);

  const onOpenChange = useCallback(
    (val: boolean) => {
      setFilterOpen(id, val);
    },
    [setFilterOpen, id],
  );

  const onChange = useCallback(
    (value: string[]) => {
      setFilterValue(id, value);
    },
    [id, setFilterValue],
  );

  return (
    <FilterContainer
      filterString={changes}
      onOpenChange={onOpenChange}
      nonCollapsibleContent={children}
      onReset={onReset}
      open={open}
      title={title}
    >
      <Combobox
        autoFocus
        id={`filter-${id}`}
        itemToString={itemToString}
        items={options}
        label={title}
        onValueChange={onChange}
        placeholder={placeholder}
        renderItem={nameRenderer}
        renderResult={nameRenderer}
        selectedItems={value}
      />
    </FilterContainer>
  );
}
