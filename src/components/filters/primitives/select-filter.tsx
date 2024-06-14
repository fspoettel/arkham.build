import { useCallback } from "react";

import { useStore } from "@/store";

import { FilterContainer } from "./filter-container";

type Props<T, V extends number | string | undefined> = {
  id: number;
  changes?: string;
  mapValue?: (val: string) => V;
  options: T[];
  open: boolean;
  renderOption: (option: T) => React.ReactNode;
  title: string;
  value: V;
};

export function SelectFilter<T, V extends number | string | undefined>({
  changes,
  mapValue,
  id,
  options,
  renderOption,
  open,
  title,
  value,
}: Props<T, V>) {
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
    (evt: React.ChangeEvent<HTMLSelectElement>) => {
      if (evt.target instanceof HTMLSelectElement) {
        const val = evt.target.value;
        const mapped = mapValue ? mapValue(val) : val;
        setFilterValue(id, mapped);
      }
    },
    [id, setFilterValue, mapValue],
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
