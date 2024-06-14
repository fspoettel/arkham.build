import type { ChangeEvent, ReactNode } from "react";
import { useCallback } from "react";

import { useStore } from "@/store";
import { selectFilterOpen } from "@/store/selectors/filters";
import type { CardTypeFilter, Filters } from "@/store/slices/filters.types";

import { FilterContainer } from "./filter-container";

type Props<
  T,
  K extends CardTypeFilter,
  V extends number | string | undefined,
> = {
  cardType: K;
  path: keyof Filters[K];
  changes?: string;
  mapValue?: (val: string) => V;
  options: T[];
  renderOption: (option: T) => ReactNode;
  title: string;
  value: V;
};

export function SelectFilter<
  T,
  K extends CardTypeFilter,
  V extends number | string | undefined,
>({
  cardType,
  changes,
  mapValue,
  path,
  options,
  renderOption,
  title,
  value,
}: Props<T, K, V>) {
  const open = useStore(selectFilterOpen(cardType, path));

  const setFilter = useStore((state) => state.setFilter);
  const setFilterOpen = useStore((state) => state.setFilterOpen);
  const resetFilter = useStore((state) => state.resetFilterKey);

  const onReset = useCallback(() => {
    resetFilter(cardType, path);
  }, [resetFilter, cardType, path]);

  const onOpenChange = useCallback(
    (val: boolean) => {
      setFilterOpen(cardType, path, val);
    },
    [setFilterOpen, cardType, path],
  );

  const onChange = useCallback(
    (evt: ChangeEvent<HTMLSelectElement>) => {
      const val = evt.target.value;
      const mapped = mapValue ? mapValue(val) : val;
      setFilter(cardType, path, "value", mapped);
    },
    [setFilter, cardType, path, mapValue],
  );

  return (
    <FilterContainer
      filterString={changes}
      onOpenChange={onOpenChange}
      onReset={onReset}
      open={open}
      title={title}
    >
      <select onChange={onChange} value={value ?? ""}>
        <option value="">All cards</option>
        {options.map(renderOption)}
      </select>
    </FilterContainer>
  );
}
