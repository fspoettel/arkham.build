import { useStore } from "@/store";
import {
  selectActiveListFilter,
  selectSkillIconsChanges,
} from "@/store/selectors/lists";
import { isSkillIconsFilterObject } from "@/store/slices/lists.type-guards";
import type { SkillIconsFilter as SkillIconsFilterType } from "@/store/slices/lists.types";
import { assert } from "@/utils/assert";
import { useCallback } from "react";
import { SkillIcon } from "../icons/skill-icon";
import { CheckboxGroup } from "../ui/checkboxgroup";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import css from "./filters.module.css";
import type { FilterProps } from "./filters.types";
import { FilterContainer } from "./primitives/filter-container";
import { useFilterCallbacks } from "./primitives/filter-hooks";

export function SkillIconsFilter({ id }: FilterProps) {
  const filter = useStore((state) => selectActiveListFilter(state, id));
  assert(
    isSkillIconsFilterObject(filter),
    `SkillIconsFilter instantiated with '${filter?.type}'`,
  );

  const changes = selectSkillIconsChanges(filter.value);

  const { onReset, onOpenChange, onChange } = useFilterCallbacks(id);

  const onToggleChange = useCallback(
    (key: keyof SkillIconsFilterType, val: string) => {
      onChange({
        [key]: val ? +val : undefined,
      });
    },
    [onChange],
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
      <CheckboxGroup as="div" className={css["icons"]} cols={2}>
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
              <ToggleGroupItem value="1">1+</ToggleGroupItem>
              <ToggleGroupItem value="2">2+</ToggleGroupItem>
            </ToggleGroup>
            {key === "any" ? "any" : <SkillIcon skill={key} />}
          </div>
        ))}
      </CheckboxGroup>
    </FilterContainer>
  );
}
