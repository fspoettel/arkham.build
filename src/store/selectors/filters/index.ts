import { createSelector } from "reselect";

import { and } from "@/utils/fp";

import { selectActionsFilter } from "./action";
import { selectCostFilter } from "./cost";
import { selectFactionFilter } from "./faction";
import {
  selectInvestigatorFilter,
  selectInvestigatorWeaknessFilter,
} from "./investigator";
import { selectLevelFilter } from "./level";
import { selectPropertiesFilter } from "./properties";
import {
  filterBacksides,
  filterDuplicates,
  filterEncounterCards,
  filterMythosCards,
  filterWeaknesses,
} from "./shared";
import { selectSkillIconsFilter } from "./skill-icons";
import { selectSubtypeFilter } from "./subtype";
import { selectTabooSetFilter } from "./tabooSet";
import { selectTraitsFilter } from "./traits";
import { selectTypeFilter } from "./type";

export const selectPlayerCardFilters = createSelector(
  selectFactionFilter,
  selectLevelFilter,
  selectCostFilter,
  selectSkillIconsFilter,
  selectTypeFilter,
  selectSubtypeFilter,
  selectTraitsFilter,
  selectActionsFilter,
  selectPropertiesFilter,
  selectInvestigatorFilter,
  selectTabooSetFilter,
  (
    factionFilter,
    levelFilter,
    costFilter,
    skillIconsFilter,
    typeFilter,
    subtypeFilter,
    traitsFilter,
    actionsFilter,
    propertiesFilter,
    investigatorFilter,
    tabooSetFilter,
  ) => {
    const filters = [
      filterMythosCards,
      filterEncounterCards,
      filterDuplicates,
      filterWeaknesses,
      skillIconsFilter,
      typeFilter,
      subtypeFilter,
      traitsFilter,
      actionsFilter,
      propertiesFilter,
    ];

    if (factionFilter) {
      filters.push(factionFilter);
    }

    if (levelFilter) {
      filters.push(levelFilter);
    }

    if (costFilter) {
      filters.push(costFilter);
    }

    if (investigatorFilter) {
      filters.push(investigatorFilter);
    }

    if (tabooSetFilter) {
      filters.push(tabooSetFilter);
    }

    return and(filters);
  },
);

export const selectWeaknessFilters = createSelector(
  selectLevelFilter,
  selectCostFilter,
  selectFactionFilter,
  selectSkillIconsFilter,
  selectTypeFilter,
  selectSubtypeFilter,
  selectTraitsFilter,
  selectActionsFilter,
  selectPropertiesFilter,
  selectInvestigatorWeaknessFilter,
  selectTabooSetFilter,
  (
    levelFilter,
    costFilter,
    factionFilter,
    skillIconsFilter,
    typeFilter,
    subtypeFilter,
    traitsFilter,
    actionsFilter,
    propertiesFilter,
    investigatorFilter,
    tabooSetFilter,
  ) => {
    const filters = [
      filterEncounterCards,
      filterDuplicates,
      skillIconsFilter,
      typeFilter,
      subtypeFilter,
      traitsFilter,
      actionsFilter,
      propertiesFilter,
    ];

    if (factionFilter) {
      filters.push(factionFilter);
    }

    if (levelFilter) {
      filters.push(levelFilter);
    }

    if (costFilter) {
      filters.push(costFilter);
    }

    if (investigatorFilter) {
      filters.push(investigatorFilter);
    }

    if (tabooSetFilter) {
      filters.push(tabooSetFilter);
    }

    return and(filters);
  },
);

export const selectEncounterFilters = createSelector(
  selectCostFilter,
  selectFactionFilter,
  selectSkillIconsFilter,
  selectTypeFilter,
  selectSubtypeFilter,
  selectTraitsFilter,
  selectActionsFilter,
  selectPropertiesFilter,
  (
    costFilter,
    factionFilter,
    skillIconsFilter,
    typeFilter,
    subtypeFilter,
    traitsFilter,
    actionsFilter,
    propertiesFilter,
  ) => {
    const filters = [
      filterBacksides,
      skillIconsFilter,
      typeFilter,
      subtypeFilter,
      traitsFilter,
      actionsFilter,
      propertiesFilter,
    ];

    if (factionFilter) {
      filters.push(factionFilter);
    }

    if (costFilter) {
      filters.push(costFilter);
    }

    return and(filters);
  },
);
