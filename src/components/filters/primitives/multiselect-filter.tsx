import { ReactNode, useCallback } from "react";

import { Combobox } from "@/components/ui/combobox/combobox";
import { useStore } from "@/store";
import { selectFilterOpen } from "@/store/selectors/filters";
import { Coded } from "@/store/services/types";
import { CardTypeFilter, Filters } from "@/store/slices/filters/types";

import { FilterContainer } from "./filter-container";

type Props<T extends Coded, K extends CardTypeFilter> = {
  cardType: K;
  path: keyof Filters[K];
  changes?: string;
  itemToString?: (val: T) => string;
  nameRenderer?: (val: T) => ReactNode;
  title: ReactNode;
  options: T[];
  placeholder?: string;
  value: Record<string, T>;
};

export function MultiselectFilter<T extends Coded, K extends CardTypeFilter>({
  cardType,
  changes,
  path,
  itemToString,
  nameRenderer,
  options,
  placeholder,
  title,
  value,
}: Props<T, K>) {
  const open = useStore(selectFilterOpen(cardType, path));

  const setNestedFilter = useStore((state) => state.setNestedFilter);
  const setFilterOpen = useStore((state) => state.setFilterOpen);
  const resetFilter = useStore((state) => state.resetFilterKey);

  const onOpenChange = useCallback(
    (val: boolean) => {
      setFilterOpen(cardType, path, val);
    },
    [setFilterOpen, cardType, path],
  );

  const onReset = useCallback(() => {
    resetFilter(cardType, path);
  }, [resetFilter, cardType, path]);

  const onChange = useCallback(
    (code: string, value: boolean) => {
      setNestedFilter(cardType, path, code, value);
    },
    [setNestedFilter, cardType, path],
  );

  return (
    <FilterContainer
      title={title}
      filterString={changes}
      onReset={onReset}
      onOpenChange={onOpenChange}
      open={open}
    >
      <Combobox
        id={`filter-${cardType}-${path as string}`}
        items={options}
        onSelectItem={onChange}
        selectedItems={value}
        placeholder={placeholder}
        label={title}
        itemToString={itemToString}
        renderItem={nameRenderer}
        renderResult={nameRenderer}
      />
    </FilterContainer>
  );
}
