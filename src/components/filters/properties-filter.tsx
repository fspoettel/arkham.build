import { useStore } from "@/store";
import {
  selectActiveListFilter,
  selectPropertiesChanges,
} from "@/store/selectors/lists";
import { isPropertiesFilterObject } from "@/store/slices/lists.type-guards";
import type { PropertiesFilter as PropertiesFilterType } from "@/store/slices/lists.types";
import { assert } from "@/utils/assert";
import { useCallback } from "react";
import { Checkbox } from "../ui/checkbox";
import { CheckboxGroup } from "../ui/checkboxgroup";
import type { FilterProps } from "./filters.types";
import { FilterContainer } from "./primitives/filter-container";

const properties = [
  { key: "bonded", label: "Bonded" },
  { key: "fast", label: "Fast" },
  { key: "customizable", label: "Customizable" },
  { key: "permanent", label: "Permanent" },
  { key: "exile", label: "Exile" },
  { key: "seal", label: "Seal" },
  { key: "victory", label: "Victory" },
  { key: "specialist", label: "Specialist" },
  { key: "succeedBy", label: "Succeed By" },
  {
    key: "unique",
    label: <>Unique (&#10040;)</>,
  },
  {
    key: "healsDamage",
    label: "Heals damage",
  },
  {
    key: "healsHorror",
    label: "Heals horror",
  },
];

export function PropertiesFilter({ id }: FilterProps) {
  const filter = useStore((state) => selectActiveListFilter(state, id));
  assert(
    isPropertiesFilterObject(filter),
    `PropertiesFilter instantiated with '${filter?.type}'`,
  );

  const changes = selectPropertiesChanges(filter.value);

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

  const onPropertyChange = useCallback(
    (key: keyof PropertiesFilterType, value: boolean) => {
      setFilterValue(id, {
        [key]: value,
      });
    },
    [setFilterValue, id],
  );

  return (
    <FilterContainer
      filterString={changes}
      onOpenChange={onOpenChange}
      onReset={onReset}
      open={filter.open}
      title="Properties"
    >
      <CheckboxGroup cols={2}>
        {properties.map(({ key, label }) => (
          <Checkbox
            checked={filter.value[key as keyof PropertiesFilterType]}
            data-key={key}
            id={`property-${key}`}
            key={key}
            label={label}
            onCheckedChange={(val) =>
              onPropertyChange(key as keyof PropertiesFilterType, !!val)
            }
          />
        ))}
      </CheckboxGroup>
    </FilterContainer>
  );
}
