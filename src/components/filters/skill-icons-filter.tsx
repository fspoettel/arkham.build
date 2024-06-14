import { useCallback } from "react";

import { useStore } from "@/store";
import { selectActiveCardType } from "@/store/selectors/filters/shared";
import {
  selectChanges,
  selectOpen,
  selectValue,
} from "@/store/selectors/filters/skill-icons";
import { SkillIconsFilter as SkillIconsFilterType } from "@/store/slices/filters/types";

import css from "./skill-icons-filter.module.css";

import { SkillIcon } from "../icons/skill-icon";
import { CheckboxGroup } from "../ui/checkboxgroup";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { FilterContainer } from "./primitives/filter-container";

type Value = SkillIconsFilterType["value"];

export function SkillIconsFilter() {
  const cardType = useStore(selectActiveCardType);
  const value = useStore(selectValue);
  const changes = useStore(selectChanges);
  const open = useStore(selectOpen);

  const setFilter = useStore((state) => state.setNestedFilter);
  const setFilterOpen = useStore((state) => state.setFilterOpen);
  const resetFilter = useStore((state) => state.resetFilterKey);

  const onReset = useCallback(() => {
    resetFilter("player", "skillIcons");
  }, [resetFilter]);

  const onOpenChange = useCallback(
    (val: boolean) => {
      setFilterOpen("player", "skillIcons", val);
    },
    [setFilterOpen],
  );

  const onToggleChange = useCallback(
    (key: keyof Value, val: string) => {
      setFilter(cardType, "skillIcons", key, val ? +val : null);
    },
    [setFilter, cardType],
  );

  return (
    <FilterContainer
      title="Skill Icons"
      open={open}
      filterString={changes}
      onOpenChange={onOpenChange}
      onReset={onReset}
    >
      <CheckboxGroup className={css["skill-filter-icons"]} as="div">
        {Object.entries(value).map(([key, value]) => (
          <div className={css["skill-filter-icon"]} key={key}>
            <ToggleGroup
              className={css["skill-filter-icon-toggle"]}
              key={key}
              type="single"
              onValueChange={(val) => onToggleChange(key as keyof Value, val)}
              value={value ? value.toString() : ""}
            >
              <ToggleGroupItem size="small" value="1">
                1+
              </ToggleGroupItem>
              <ToggleGroupItem size="small" value="2">
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
