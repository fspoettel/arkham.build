import { useCallback } from "react";
import { FilterContainer } from "./filter-container";
import { useFilterCallbacks } from "./filter-hooks";

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

export function SelectFilter<T, V extends number | string | undefined>(
  props: Props<T, V>,
) {
  const { changes, mapValue, id, options, renderOption, open, title, value } =
    props;

  const { onReset, onOpenChange, onChange } = useFilterCallbacks<V>(id);

  const onValueChange = useCallback(
    (evt: React.ChangeEvent<HTMLSelectElement>) => {
      if (evt.target instanceof HTMLSelectElement) {
        const val = evt.target.value;
        const mapped = mapValue ? mapValue(val) : (val as V);
        onChange(mapped);
      }
    },
    [mapValue, onChange],
  );

  return (
    <FilterContainer
      filterString={changes}
      onOpenChange={onOpenChange}
      onReset={onReset}
      open={open}
      title={title}
    >
      <select
        onChange={onValueChange}
        data-testid={`filter-${title}-input`}
        value={value ?? ""}
      >
        <option value="">All cards</option>
        {options.map(renderOption)}
      </select>
    </FilterContainer>
  );
}
