import { Combobox } from "@/components/ui/combobox/combobox";
import type { Coded } from "@/store/services/queries.types";
import { FilterContainer } from "./filter-container";
import { useFilterCallbacks } from "./filter-hooks";

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

export function MultiselectFilter<T extends Coded>(props: Props<T>) {
  const {
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
  } = props;

  const { onReset, onOpenChange, onChange } = useFilterCallbacks<string[]>(id);

  return (
    <FilterContainer
      changes={changes}
      nonCollapsibleContent={children}
      onOpenChange={onOpenChange}
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
