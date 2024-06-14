import { useCallback } from "react";

import { useStore } from "@/store";
import {
  selectActiveCardType,
  selectFilterOpen,
  selectSkillIconsChanges,
  selectSkillIconsValue,
} from "@/store/selectors/filters";
import type { SkillIconsFilter as SkillIconsFilterType } from "@/store/slices/filters.types";

import css from "./filters.module.css";

import { SkillIcon } from "../icons/skill-icon";
import { CheckboxGroup } from "../ui/checkboxgroup";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { FilterContainer } from "./primitives/filter-container";

type Value = SkillIconsFilterType["value"];

export function SkillIconsFilter() {
  const cardType = useStore(selectActiveCardType);
  const value = useStore(selectSkillIconsValue);
  const changes = useStore(selectSkillIconsChanges);
  const open = useStore(selectFilterOpen(cardType, "skillIcons"));

  const setFilter = useStore((state) => state.setNestedFilter);
  const setFilterOpen = useStore((state) => state.setFilterOpen);
  const resetFilter = useStore((state) => state.resetFilterKey);

  const onReset = useCallback(() => {
    resetFilter(cardType, "skillIcons");
  }, [resetFilter, cardType]);

  const onOpenChange = useCallback(
    (val: boolean) => {
      setFilterOpen(cardType, "skillIcons", val);
    },
    [setFilterOpen, cardType],
  );

  const onToggleChange = useCallback(
    (key: keyof Value, val: string) => {
      setFilter(cardType, "skillIcons", key, val ? +val : null);
    },
    [setFilter, cardType],
  );

  return (
    <FilterContainer
      alwaysShowFilterString
      className={css["skill-filter"]}
      filterString={changes}
      onOpenChange={onOpenChange}
      onReset={onReset}
      open={open}
      title="Skill Icons"
    >
      <CheckboxGroup as="div" className={css["icons"]}>
        {Object.entries(value).map(([key, value]) => (
          <div className={css["icon"]} key={key}>
            <ToggleGroup
              key={key}
              onValueChange={(val) => onToggleChange(key as keyof Value, val)}
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
