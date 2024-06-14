import { useCallback } from "react";

import { Combobox } from "@/components/ui/combobox/combobox";
import { useStore } from "@/store";
import { selectFilterOpen } from "@/store/selectors/filters";
import type { Coded } from "@/store/services/queries.types";
import type { CardTypeFilter, Filters } from "@/store/slices/filters.types";

import { FilterContainer } from "./filter-container";

type Props<T extends Coded, K extends CardTypeFilter> = {
  cardType: K;
  path: keyof Filters[K];
  changes?: string;
  itemToString?: (val: T) => string;
  nameRenderer?: (val: T) => React.ReactNode;
  title: string;
  options: T[];
  placeholder?: string;
  value: string[];
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

  const setFilter = useStore((state) => state.setFilter);
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
    (value: string[]) => {
      setFilter(cardType, path, "value", value);
    },
    [setFilter, cardType, path],
  );

  return (
    <FilterContainer
      filterString={changes}
      onOpenChange={onOpenChange}
      onReset={onReset}
      open={open}
      title={title}
    >
      <Combobox
        autoFocus
        id={`filter-${cardType}-${path as string}`}
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
