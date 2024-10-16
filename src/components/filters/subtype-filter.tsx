import { useStore } from "@/store";
import { selectActiveListFilter } from "@/store/selectors/lists";
import { isSubtypeFilterObject } from "@/store/slices/lists.type-guards";
import { assert } from "@/utils/assert";

import {
  selectSubtypeChanges,
  selectSubtypeOptions,
} from "@/store/selectors/lists";
import type { SubtypeFilter as SubtypeFilterType } from "@/store/slices/lists.types";
import { useCallback } from "react";
import { Checkbox } from "../ui/checkbox";
import { CheckboxGroup } from "../ui/checkboxgroup";
import type { FilterProps } from "./filters.types";
import { FilterContainer } from "./primitives/filter-container";

export function SubtypeFilter({ id }: FilterProps) {
  const filter = useStore((state) => selectActiveListFilter(state, id));

  assert(
    isSubtypeFilterObject(filter),
    `SubtypeFilter instantiated with '${filter?.type}'`,
  );

  const changes = useStore((state) =>
    selectSubtypeChanges(state, filter.value),
  );

  const options = selectSubtypeOptions();

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

  const onValueChange = useCallback(
    (key: keyof SubtypeFilterType, value: boolean) => {
      setFilterValue(id, {
        [key]: value,
      });
    },
    [setFilterValue, id],
  );

  return (
    <FilterContainer
      data-testid="subtype-filter"
      filterString={changes}
      onOpenChange={onOpenChange}
      onReset={onReset}
      open={filter.open}
      title="Subtype"
    >
      <CheckboxGroup>
        {options.map(({ code, name }) => (
          <Checkbox
            checked={filter.value[code as keyof SubtypeFilterType]}
            data-key={code}
            data-testid={`subtype-${code}`}
            id={`property-${code}`}
            key={code}
            label={name}
            onCheckedChange={(val) =>
              onValueChange(code as keyof SubtypeFilterType, !!val)
            }
          />
        ))}
      </CheckboxGroup>
    </FilterContainer>
  );
}
