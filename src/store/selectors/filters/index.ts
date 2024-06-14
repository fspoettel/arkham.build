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
import { selectOwnershipFilter } from "./ownership";
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
import { selectTabooSetFilter } from "./taboo-set";
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
  selectOwnershipFilter,
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
    ownershipFilter,
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
      ownershipFilter,
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
  selectOwnershipFilter,
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
    ownershipFilter,
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
      ownershipFilter,
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
  selectOwnershipFilter,
  (
    costFilter,
    factionFilter,
    skillIconsFilter,
    typeFilter,
    subtypeFilter,
    traitsFilter,
    actionsFilter,
    propertiesFilter,
    ownershipFilter,
  ) => {
    const filters = [
      filterBacksides,
      skillIconsFilter,
      typeFilter,
      subtypeFilter,
      traitsFilter,
      actionsFilter,
      propertiesFilter,
      ownershipFilter,
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
