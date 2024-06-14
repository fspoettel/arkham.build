import { useCallback } from "react";

import { useStore } from "@/store";
import {
  selectChanges,
  selectOpen,
  selectValue,
} from "@/store/selectors/filters/properties";
import { selectActiveCardType } from "@/store/selectors/filters/shared";
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
  {
    key: "unique",
    label: <>Unique (&#10040;)</>,
  },
];

type Value = PropertiesFilterType["value"];

export function PropertiesFilter() {
  const cardType = useStore(selectActiveCardType);
  const value = useStore(selectValue);
  const changes = useStore(selectChanges);
  const open = useStore(selectOpen);

  const setFilter = useStore((state) => state.setNestedFilter);
  const setFilterOpen = useStore((state) => state.setFilterOpen);
  const resetFilter = useStore((state) => state.resetFilterKey);

  const onReset = useCallback(() => {
    resetFilter("player", "properties");
  }, [resetFilter]);

  const onOpenChange = useCallback(
    (val: boolean) => {
      setFilterOpen("player", "properties", val);
    },
    [setFilterOpen],
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
