import { createSelector } from "reselect";

import { Card } from "../graphql/types";
import { StoreState } from "../slices";
import { selectActiveCardType } from "./filters";
import {
  and,
  filterActions,
  filterBacksides,
  filterCost,
  filterDuplicates,
  filterEncounterCards,
  filterFactions,
  filterLevel,
  filterMythosCards,
  filterProperties,
  filterSkillIcons,
  filterSubtypes,
  filterTraits,
  filterTypes,
  filterWeaknesses,
} from "./utils/filtering";
import {
  Grouping,
  getGroupCards,
  groupByEncounterSets,
  groupByPlayerCardType,
  groupByWeakness,
} from "./utils/grouping";
import { sortAlphabetically, sortByEncounterPosition } from "./utils/sorting";

const selectTypeFilter = createSelector(
  (state: StoreState) => state.filters[state.filters.cardType].type,
  (filterState) => filterTypes(filterState),
);

const selectSubtypeFilter = createSelector(
  (state: StoreState) => state.filters[state.filters.cardType].subtype,
  (state) => filterSubtypes(state),
);

const selectFactionFilter = createSelector(
  (state: StoreState) => state.filters[state.filters.cardType].faction,
  (filterState) =>
    filterState.value ? filterFactions(filterState.value) : undefined,
);

const selectLevelFilter = createSelector(
  (state: StoreState) => state.filters.player.level,
  (filterState) => (filterState.value ? filterLevel(filterState) : undefined),
);

const selectCostFilter = createSelector(
  (state: StoreState) => state.filters[state.filters.cardType].cost,
  (filterState) => (filterState.value ? filterCost(filterState) : undefined),
);

const selectSkillIconsFilter = createSelector(
  (state: StoreState) => state.filters[state.filters.cardType].skillIcons,
  (filterState) => filterSkillIcons(filterState),
);

const selectTraitsFilter = createSelector(
  (state: StoreState) => state.lookupTables.traits,
  (state: StoreState) => state.filters[state.filters.cardType].trait,
  (traitsTable, filterState) => filterTraits(filterState, traitsTable),
);

const selectActionsFilter = createSelector(
  (state: StoreState) => state.lookupTables.actions,
  (state: StoreState) => state.filters[state.filters.cardType].action,
  (actionTable, filterState) => filterActions(filterState, actionTable),
);

const selectPropertiesFilter = createSelector(
  (state: StoreState) => state.lookupTables,
  (state: StoreState) => state.filters[state.filters.cardType].properties,
  (lookupTables, filterState) => filterProperties(filterState, lookupTables),
);

const selectPlayerCardFilters = createSelector(
  selectFactionFilter,
  selectLevelFilter,
  selectCostFilter,
  selectSkillIconsFilter,
  selectTypeFilter,
  selectSubtypeFilter,
  selectTraitsFilter,
  selectActionsFilter,
  selectPropertiesFilter,
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

    return and(filters);
  },
);

const selectWeaknessFilters = createSelector(
  selectLevelFilter,
  selectCostFilter,
  selectFactionFilter,
  selectSkillIconsFilter,
  selectTypeFilter,
  selectSubtypeFilter,
  selectTraitsFilter,
  selectActionsFilter,
  selectPropertiesFilter,
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

    return and(filters);
  },
);

const selectEncounterFilters = createSelector(
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

export const selectFilteredCards = createSelector(
  selectActiveCardType,
  selectPlayerCardFilters,
  selectWeaknessFilters,
  selectEncounterFilters,
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (
    activeCardType,
    playerCardFilter,
    weaknessFilter,
    encounterFilters,
    metadata,
    lookupTables,
  ) => {
    if (!Object.keys(metadata.cards).length) {
      console.warn("player cards selected before store is initialized.");
      return undefined;
    }

    const groups: Grouping[] = [];
    const cards: Card[] = [];
    const groupCounts = [];

    if (activeCardType === "player") {
      console.time("select_player_cards");

      for (const grouping of groupByPlayerCardType(metadata, lookupTables)) {
        const groupCards = getGroupCards(
          grouping,
          metadata,
          lookupTables,
          playerCardFilter,
        );

        groupCards.sort(sortAlphabetically(lookupTables));

        if (groupCards.length) {
          groups.push(grouping);
          cards.push(...groupCards);
          groupCounts.push(groupCards.length);
        }
      }

      for (const grouping of groupByWeakness(metadata)) {
        const groupCards = getGroupCards(
          grouping,
          metadata,
          lookupTables,
          weaknessFilter,
        );

        groupCards.sort(sortAlphabetically(lookupTables));

        if (groupCards.length) {
          groups.push(grouping);
          cards.push(...groupCards);
          groupCounts.push(groupCards.length);
        }
      }

      console.timeEnd("select_player_cards");
    } else {
      console.time("select_encounter_cards");

      for (const grouping of groupByEncounterSets(metadata)) {
        const groupCards = getGroupCards(
          grouping,
          metadata,
          lookupTables,
          encounterFilters,
        );

        groupCards.sort(sortByEncounterPosition);

        if (groupCards.length) {
          groups.push(grouping);
          cards.push(...groupCards);
          groupCounts.push(groupCards.length);
        }
      }

      console.timeEnd("select_encounter_cards");
    }

    return {
      key: activeCardType,
      groups,
      cards,
      groupCounts,
    };
  },
);
