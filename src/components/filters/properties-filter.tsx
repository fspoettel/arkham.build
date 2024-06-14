import { useCallback } from "react";

import { useStore } from "@/store";
import {
  selectActiveCardType,
  selectFilterOpen,
  selectPropertiesChanges,
  selectPropertiesValue,
} from "@/store/selectors/filters";
import type { PropertiesFilter as PropertiesFilterType } from "@/store/slices/filters/types";

import { Checkbox } from "../ui/checkbox";
import { CheckboxGroup } from "../ui/checkboxgroup";
import { FilterContainer } from "./primitives/filter-container";

const properties = [
  { key: "bonded", label: "Bonded" },
  { key: "fast", label: "Fast" },
  { key: "customizable", label: "Customizable" },
  { key: "permanent", label: "Permanent" },
  { key: "exile", label: "Exile" },
  { key: "seal", label: "Seal" },
  { key: "victory", label: "Victory" },
  { key: "succeedBy", label: "Succeed By" },
  {
    key: "unique",
    label: <>Unique (&#10040;)</>,
  },
];

type Value = PropertiesFilterType["value"];

export function PropertiesFilter() {
  const cardType = useStore(selectActiveCardType);
  const value = useStore(selectPropertiesValue);
  const changes = useStore(selectPropertiesChanges);
  const open = useStore(selectFilterOpen(cardType, "properties"));

  const setFilter = useStore((state) => state.setNestedFilter);
  const setFilterOpen = useStore((state) => state.setFilterOpen);
  const resetFilter = useStore((state) => state.resetFilterKey);

  const onReset = useCallback(() => {
    resetFilter(cardType, "properties");
  }, [resetFilter, cardType]);

  const onOpenChange = useCallback(
    (val: boolean) => {
      setFilterOpen(cardType, "properties", val);
    },
    [setFilterOpen, cardType],
  );

  const onPropertyChange = useCallback(
    (key: keyof Value, val: boolean) => {
      setFilter(cardType, "properties", key, val);
    },
    [setFilter, cardType],
  );

  return (
    <FilterContainer
      title="Properties"
      open={open}
      filterString={changes}
      onOpenChange={onOpenChange}
      onReset={onReset}
    >
      <CheckboxGroup>
        {properties.map(({ key, label }) => (
          <Checkbox
            data-key={key}
            key={key}
            label={label}
            id={`property-${key}`}
            onCheckedChange={(val) =>
              onPropertyChange(key as keyof Value, !!val)
            }
            checked={value[key as keyof Value]}
          />
        ))}
      </CheckboxGroup>
    </FilterContainer>
  );
}
