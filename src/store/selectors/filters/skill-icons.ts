import { createSelector } from "reselect";

import { Card } from "@/store/services/types";
import { StoreState } from "@/store/slices";
import { SkillIconsFilter } from "@/store/slices/filters/types";
import { capitalize } from "@/utils/capitalize";
import { SKILL_KEYS, SkillKey } from "@/utils/constants";
import { Filter, and, or } from "@/utils/fp";

function filterSkill(skill: SkillKey, amount: number) {
  return (card: Card) =>
    card.type_code !== "investigator" &&
    (card[`skill_${skill}`] ?? 0) >= amount;
}

function filterSkillIcons(filterState: SkillIconsFilter["value"]) {
  const iconFilter: Filter[] = [];
  const anyFilter: Filter[] = [];

  const anyV = filterState.any;

  SKILL_KEYS.forEach((skill) => {
    const v = filterState[skill];
    if (v) {
      iconFilter.push(filterSkill(skill, v));
    }

    if (anyV) {
      anyFilter.push(filterSkill(skill, anyV));
    }
  });

  const filter = anyFilter.length
    ? and([or(anyFilter), and(iconFilter)])
    : and(iconFilter);

  return (card: Card) => {
    return filter(card);
  };
}

export const selectSkillIconsFilter = createSelector(
  (state: StoreState) => state.filters[state.filters.cardType].skillIcons,
  (filterState) => filterSkillIcons(filterState.value),
);

export const selectValue = (state: StoreState) =>
  state.filters[state.filters.cardType].skillIcons.value;

export const selectChanges = createSelector(selectValue, (value) =>
  Object.entries(value).reduce((acc, [key, val]) => {
    if (!val) return acc;
    const s = `${val}+ ${capitalize(key)}`;
    return acc ? `${acc}, ${s}` : s;
  }, ""),
);

export const selectOpen = createSelector(
  (state: StoreState) => state.filters[state.filters.cardType].skillIcons,
  (filterState) => filterState.open,
);
