import { useStore } from "@/store";
import {
  selectActiveListFilter,
  selectPropertiesChanges,
} from "@/store/selectors/lists";
import { isPropertiesFilterObject } from "@/store/slices/lists.type-guards";
import type { PropertiesFilter as PropertiesFilterType } from "@/store/slices/lists.types";
import { assert } from "@/utils/assert";
import { useCallback } from "react";
import { FactionIconFancy } from "../icons/faction-icon-fancy";
import { Checkbox } from "../ui/checkbox";
import { CheckboxGroup } from "../ui/checkboxgroup";
import type { FilterProps } from "./filters.types";
import { FilterContainer } from "./primitives/filter-container";
import { useFilterCallbacks } from "./primitives/filter-hooks";

const properties = [
  { key: "bonded", label: "Bonded" },
  { key: "customizable", label: "Customizable" },
  { key: "exile", label: "Exile" },
  { key: "fast", label: "Fast" },
  {
    key: "healsDamage",
    label: "Heals damage",
  },
  {
    key: "healsHorror",
    label: "Heals horror",
  },
  {
    key: "multiClass",
    label: (
      <>
        Multi-Class (<FactionIconFancy code="multiclass" />)
      </>
    ),
  },
  { key: "permanent", label: "Permanent" },
  { key: "seal", label: "Seal" },
  { key: "specialist", label: "Specialist" },
  { key: "succeedBy", label: "Succeed By" },
  {
    key: "unique",
    label: <>Unique (&#10040;)</>,
  },
  { key: "victory", label: "Victory" },
];

export function PropertiesFilter({ id }: FilterProps) {
  const filter = useStore((state) => selectActiveListFilter(state, id));
  assert(
    isPropertiesFilterObject(filter),
    `PropertiesFilter instantiated with '${filter?.type}'`,
  );

  const changes = selectPropertiesChanges(filter.value);

  const { onReset, onChange, onOpenChange } = useFilterCallbacks(id);

  const onPropertyChange = useCallback(
    (key: keyof PropertiesFilterType, value: boolean) => {
      onChange({
        [key]: value,
      });
    },
    [onChange],
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
