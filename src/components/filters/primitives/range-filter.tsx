import { RangeSelect } from "@/components/ui/range-select";
import { FilterContainer } from "./filter-container";
import { useFilterCallbacks } from "./filter-hooks";

type Props = {
  id: number;
  changes?: string;
  min: number;
  max: number;
  onChange: (val: [number, number]) => void;
  open: boolean;
  title: string;
  value: [number, number] | undefined;
};

export function RangeFilter(props: Props) {
  const { changes, id, min, max, open, title, value } = props;

  const { onReset, onChange, onOpenChange } = useFilterCallbacks(id);

  return (
    <FilterContainer
      filterString={changes}
      onOpenChange={onOpenChange}
      onReset={onReset}
      open={open}
      title={title}
    >
      <RangeSelect
        id={`range-filter-${id}`}
        max={max}
        min={min}
        label={title}
        onValueCommit={onChange}
        value={value ?? [min, max]}
      />
    </FilterContainer>
  );
}
