import { createSelector } from "reselect";

import type { Filter } from "@/utils/fp";
import { and, not, or } from "@/utils/fp";
import { isEmpty } from "@/utils/is-empty";

import { applyCardChanges } from "../lib/card-edits";
import { getAdditionalDeckOptions } from "../lib/deck-validation";
import {
  filterActions,
  filterAssets,
  filterCost,
  filterEncounterCode,
  filterFactions,
  filterInvestigatorAccess,
  filterInvestigatorWeaknessAccess,
  filterLevel,
  filterMythosCards,
  filterOwnership,
  filterPackCode,
  filterProperties,
  filterSkillIcons,
  filterSubtypes,
  filterTabooSet,
  filterTraits,
  filterType,
} from "../lib/filtering";
import { getGroupedCards } from "../lib/grouping";
import { resolveCardWithRelations } from "../lib/resolve-card";
import { applySearch } from "../lib/searching";
import { makeSortFunction } from "../lib/sorting";
import type { Card } from "../services/queries.types";
import type { StoreState } from "../slices";
import type { Id } from "../slices/data.types";
import type {
  AssetFilter,
  CostFilter,
  LevelFilter,
  List,
  MultiselectFilter,
  OwnershipFilter,
  PropertiesFilter,
  SkillIconsFilter,
} from "../slices/lists.types";
import type { LookupTables } from "../slices/lookup-tables.types";
import type { Metadata } from "../slices/metadata.types";
import type { SettingsState } from "../slices/settings.types";
import { selectResolvedDeckById } from "./deck-view";
import { selectActiveList, selectCanonicalTabooSetId } from "./lists";

export type CardGroup = {
  type: string;
  key: string;
};

export type ListState = {
  key: string;
  groups: CardGroup[];
  cards: Card[];
  groupCounts: number[];
};

function makeUserFilter(
  metadata: Metadata,
  lookupTables: LookupTables,
  list: List,
  settings: SettingsState,
  deckInvestigatorFilter?: Filter,
  targetDeck?: "slots" | "extraSlots" | "both",
) {
  const filters: Filter[] = [];

  if (deckInvestigatorFilter) filters.push(deckInvestigatorFilter);

  if (!list.filtersEnabled) return and(filters);

  list.filters.forEach((_, id) => {
    const filterValue = list.filterValues[id];
    if (!filterValue) return;

    switch (filterValue.type) {
      case "action": {
        const value = filterValue.value as MultiselectFilter;
        if (value.length) {
          filters.push(filterActions(value, lookupTables.actions));
        }
        break;
      }

      case "asset": {
        const value = filterValue.value as AssetFilter;
        const filter = filterAssets(value, lookupTables);
        if (filter) filters.push(filter);
        break;
      }

      case "cost": {
        const value = filterValue.value as CostFilter;
        if (value.range) filters.push(filterCost(value));
        break;
      }

      case "encounterSet": {
        const value = filterValue.value as MultiselectFilter;
        if (value.length) filters.push(filterEncounterCode(value));
        break;
      }

      case "faction": {
        const value = filterValue.value as MultiselectFilter;
        if (value.length) filters.push(filterFactions(value));
        break;
      }

      case "investigator": {
        const value = filterValue.value as string | undefined;

        if (value) {
          const filter = [];
          const accessFilter = filterInvestigatorAccess(
            metadata.cards[value],
            lookupTables,
            {
              targetDeck,
            },
          );
          const weaknessFilter = filterInvestigatorWeaknessAccess(
            metadata.cards[value],
            lookupTables,
            { targetDeck },
          );

          if (accessFilter) filter.push(accessFilter);
          if (weaknessFilter) filter.push(weaknessFilter);

          filters.push(or(filter));
        }

        break;
      }

      case "level": {
        const value = filterValue.value as LevelFilter;
        if (value.range) filters.push(filterLevel(value));
        break;
      }

      case "ownership": {
        const value = filterValue.value as OwnershipFilter;
        if (value !== "all") {
          filters.push((card: Card) => {
            const ownership = filterOwnership(
              card,
              metadata,
              lookupTables,
              settings.collection,
            );

            return value === "owned" ? ownership : !ownership;
          });
        }

        break;
      }

      case "pack": {
        const value = filterValue.value as MultiselectFilter;
        if (value.length) {
          const filter = filterPackCode(value, metadata, lookupTables);
          if (filter) filters.push(filter);
        }
        break;
      }

      case "properties": {
        const value = filterValue.value as PropertiesFilter;
        filters.push(filterProperties(value, lookupTables));
        break;
      }

      case "skillIcons": {
        const value = filterValue.value as SkillIconsFilter;
        filters.push(filterSkillIcons(value));
        break;
      }

      case "subtype": {
        const value = filterValue.value as MultiselectFilter;
        if (value.length) filters.push(filterSubtypes(value));
        break;
      }

      case "tabooSet": {
        const value = filterValue.value as number | undefined;
        if (value != null) filters.push(filterTabooSet(value, metadata));
        break;
      }

      case "trait": {
        const value = filterValue.value as MultiselectFilter;
        if (value.length)
          filters.push(filterTraits(value, lookupTables.traits));
        break;
      }

      case "type": {
        const value = filterValue.value as MultiselectFilter;
        if (value.length) filters.push(filterType(value));
        break;
      }
    }
  });

  return filters.length ? and(filters) : undefined;
}

// TODO: There is some room for optimization here.
// This filter does not have to be re-calculated every time the deck changes,
// only when the investigator back changes or certain slots are changed.
const selectDeckInvestigatorFilter = createSelector(
  (state: StoreState) => state.lookupTables,
  selectResolvedDeckById,
  (
    state: StoreState,
    id?: Id,
    applyEdits?: boolean,
    targetDeck?: "slots" | "extraSlots" | "both",
  ) => targetDeck,
  (state: StoreState) => state.ui.showUnusableCards,
  (lookupTables, resolvedDeck, targetDeck, showUnusableCards) => {
    if (!resolvedDeck) return undefined;

    const investigator = resolvedDeck.investigatorBack.card;
    if (!investigator) return undefined;

    if (showUnusableCards) {
      return and([
        not(filterType(["investigator", "story", "location"])),
        filterMythosCards,
        (card: Card) =>
          !lookupTables.relations.bonded[card.code] &&
          (card?.xp != null ||
            !card.restrictions ||
            card.restrictions?.investigator[card.code]),
      ]);
    }

    const ors = [];

    const investigatorFilter = filterInvestigatorAccess(
      investigator,
      lookupTables,
      {
        additionalDeckOptions: getAdditionalDeckOptions(resolvedDeck),
        selections: resolvedDeck.selections,
        targetDeck,
      },
    );

    const weaknessFilter = filterInvestigatorWeaknessAccess(
      investigator,
      lookupTables,
      {
        targetDeck,
      },
    );

    if (investigatorFilter) ors.push(investigatorFilter);
    if (weaknessFilter) ors.push(weaknessFilter);

    return or(ors);
  },
);

export const selectListCards = createSelector(
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (state: StoreState) => state.settings,
  selectActiveList,
  selectResolvedDeckById,
  selectCanonicalTabooSetId,
  selectDeckInvestigatorFilter,
  (
    state: StoreState,
    id?: Id,
    applyEdits?: boolean,
    targetDeck?: "slots" | "extraSlots" | "both",
  ) => targetDeck,
  (
    metadata,
    lookupTables,
    settings,
    activeList,
    resolvedDeck,
    tabooSetId,
    deckInvestigatorFilter,
  ) => {
    if (!activeList) return undefined;

    if (isEmpty(metadata.cards)) {
      console.warn("player cards selected before store is initialized.");
      return undefined;
    }

    console.time("[perf] select_list_cards");

    // apply system filter first to cut down on card count.
    let filteredCards = activeList.systemFilter
      ? Object.values(metadata.cards).filter(activeList.systemFilter)
      : Object.values(metadata.cards);

    // other filters can be impacted by card changes, apply them now.
    if (tabooSetId || resolvedDeck?.customizations) {
      filteredCards = filteredCards.map((c) =>
        applyCardChanges(c, metadata, tabooSetId, resolvedDeck?.customizations),
      );
    }

    // apply user filters.
    const filter = makeUserFilter(
      metadata,
      lookupTables,
      activeList,
      settings,
      deckInvestigatorFilter,
    );
    if (filter) filteredCards = filteredCards.filter(filter);

    // apply search, do this after filtering to cut down on search operations.
    if (activeList.search.value) {
      filteredCards = applySearch(activeList.search, filteredCards, metadata);
    }

    const cards: Card[] = [];
    const groups: CardGroup[] = [];
    const groupCounts: number[] = [];

    for (const group of getGroupedCards(
      activeList.grouping,
      filteredCards,
      makeSortFunction(activeList.sorting, metadata),
      metadata,
    )) {
      cards.push(...group.cards);

      groups.push({
        key: group.key,
        type: group.type,
      });

      groupCounts.push(group.cards.length);
    }

    console.timeEnd("[perf] select_list_cards");

    return { key: activeList.key, groups, cards, groupCounts } as ListState;
  },
);

export const selectCardRelationsResolver = createSelector(
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (metadata, lookupTables) => {
    return (code: string) => {
      // for the current use case (investigator signatures), customizations and taboo are irrelevant.
      return resolveCardWithRelations(
        metadata,
        lookupTables,
        code,
        undefined,
        undefined,
        true,
      );
    };
  },
);
