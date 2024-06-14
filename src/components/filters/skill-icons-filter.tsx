import { useCallback } from "react";

import { useStore } from "@/store";
import {
  selectActiveListFilter,
  selectSkillIconsChanges,
} from "@/store/selectors/lists";
import { isSkillIconsFilterObject } from "@/store/slices/lists.type-guards";
import type { SkillIconsFilter as SkillIconsFilterType } from "@/store/slices/lists.types";
import { assert } from "@/utils/assert";

import css from "./filters.module.css";

import { SkillIcon } from "../icons/skill-icon";
import { CheckboxGroup } from "../ui/checkboxgroup";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { FilterContainer } from "./primitives/filter-container";

export function SkillIconsFilter({ id }: { id: number }) {
  const filter = useStore((state) => selectActiveListFilter(state, id));
  assert(
    isSkillIconsFilterObject(filter),
    `SkillIconsFilter instantiated with '${filter?.type}'`,
  );

  const changes = selectSkillIconsChanges(filter.value);

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

  const onToggleChange = useCallback(
    (key: keyof SkillIconsFilterType, val: string) => {
      setFilterValue(id, {
        [key]: val ? +val : undefined,
      });
    },
    [setFilterValue, id],
  );

  return (
    <FilterContainer
      alwaysShowFilterString
      className={css["skill-filter"]}
      filterString={changes}
      onOpenChange={onOpenChange}
      onReset={onReset}
      open={filter.open}
      title="Skill Icons"
    >
      <CheckboxGroup as="div" className={css["icons"]}>
        {Object.entries(filter.value).map(([key, value]) => (
          <div className={css["icon"]} key={key}>
            <ToggleGroup
              key={key}
              onValueChange={(val) =>
                onToggleChange(key as keyof SkillIconsFilterType, val)
              }
              type="single"
              value={value ? value.toString() : ""}
            >
              <ToggleGroupItem size="small-type" value="1">
                1+
              </ToggleGroupItem>
              <ToggleGroupItem size="small-type" value="2">
                2+
              </ToggleGroupItem>
            </ToggleGroup>
            {key === "any" ? "any" : <SkillIcon skill={key} />}
          </div>
        ))}
      </CheckboxGroup>
    </FilterContainer>
  );
}
