import { useStore } from "@/store";
import {
  selectActiveListFilter,
  selectInvestigatorSkillIconsChanges,
  selectSkillIconsMinMax,
} from "@/store/selectors/lists";
import { isInvestigatorSkillsFilterObject } from "@/store/slices/lists.type-guards";
import type { InvestigatorSkillsFilter as InvestigatorSkillsFilterType } from "@/store/slices/lists.types";
import { assert } from "@/utils/assert";
import { SKILL_KEYS, type SkillKey } from "@/utils/constants";
import { capitalize } from "@/utils/formatting";
import { useCallback, useMemo } from "react";
import { SkillIconFancy } from "../icons/skill-icon-fancy";
import { RangeSelect } from "../ui/range-select";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import type { FilterProps } from "./filters.types";
import css from "./investigator-skills-filter.module.css";
import { FilterContainer } from "./primitives/filter-container";
import { useFilterCallbacks } from "./primitives/filter-hooks";

const INVESTIGATOR_SKILL_KEYS: SkillKey[] = SKILL_KEYS.filter(
  (key) => key !== "wild",
);

export function InvestigatorSkillsFilter(props: FilterProps) {
  const { id } = props;

  const { onReset, onChange, onOpenChange } =
    useFilterCallbacks<InvestigatorSkillsFilterType>(id);

  const filter = useStore((state) => selectActiveListFilter(state, id));

  const skillsMinMax = useStore(selectSkillIconsMinMax);

  assert(
    isInvestigatorSkillsFilterObject(filter),
    `InvestigatorSkillsFilter instantiated with '${filter?.type}'`,
  );

  const changes = selectInvestigatorSkillIconsChanges(filter?.value);

  const onSetShortcut = useCallback(
    (keys: SkillKey[]) => {
      const value = INVESTIGATOR_SKILL_KEYS.reduce((acc, key) => {
        if (keys.includes(key)) {
          acc[key as keyof InvestigatorSkillsFilterType] = [
            4,
            skillsMinMax[key].max,
          ];
        } else {
          acc[key as keyof InvestigatorSkillsFilterType] = undefined;
        }
        return acc;
      }, {} as InvestigatorSkillsFilterType);

      onChange(value);
    },
    [onChange, skillsMinMax],
  );

  const shortcutValue = useMemo(() => {
    return Object.entries(filter.value)
      .filter(([, value]) => value?.[0] === 4)
      .map(([key]) => key as SkillKey);
  }, [filter.value]);

  const onRangeChange = useCallback(
    (key: SkillKey, value: [number, number]) => {
      onChange({ ...filter.value, [key]: value });
    },
    [filter.value, onChange],
  );

  return (
    <FilterContainer
      filterString={changes}
      onReset={onReset}
      onOpenChange={onOpenChange}
      open={filter.open}
      title="Stats"
      nonCollapsibleContent={
        !filter.open && (
          <ToggleGroup
            type="multiple"
            full
            onValueChange={onSetShortcut}
            value={shortcutValue}
          >
            {INVESTIGATOR_SKILL_KEYS.map((key) => (
              <ToggleGroupItem
                className={css["toggle"]}
                data-testid={`filter-investigator-skills-shortcut-${key}`}
                key={key}
                value={key}
              >
                4+
                <SkillIconFancy skill={key} />
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )
      }
    >
      {INVESTIGATOR_SKILL_KEYS.map((key) => (
        <RangeSelect
          key={key}
          data-testid={`filter-investigator-skills-${key}`}
          id={`$filter-${id}-${key}`}
          showLabel
          label={
            <>
              <SkillIconFancy className={css["icon"]} skill={key} />
              {capitalize(key)}
            </>
          }
          min={skillsMinMax[key].min}
          max={skillsMinMax[key].max}
          value={
            filter.value[key as keyof InvestigatorSkillsFilterType] ?? [
              skillsMinMax[key].min,
              skillsMinMax[key].max,
            ]
          }
          onValueCommit={(value) =>
            onRangeChange(key, value as [number, number])
          }
        />
      ))}
    </FilterContainer>
  );
}
