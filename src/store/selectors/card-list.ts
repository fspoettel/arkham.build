import { createSelector } from "reselect";

import type { Filter } from "@/utils/fp";
import { and, not, or } from "@/utils/fp";
import { isEmpty } from "@/utils/is-empty";

import { createCustomEqualSelector } from "@/utils/custom-equal-selector";
import { time, timeEnd } from "@/utils/time";
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
import { type ResolvedDeck, isResolvedDeck } from "../lib/types";
import type { Card } from "../services/queries.types";
import type { StoreState } from "../slices";
import type {
  AssetFilter,
  CostFilter,
  LevelFilter,
  List,
  MultiselectFilter,
  OwnershipFilter,
  PropertiesFilter,
  SkillIconsFilter,
  SubtypeFilter,
} from "../slices/lists.types";
import type { LookupTables } from "../slices/lookup-tables.types";
import type { Metadata } from "../slices/metadata.types";
import type { SettingsState } from "../slices/settings.types";
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
  totalCardCount: number;
};

function makeUserFilter(
  metadata: Metadata,
  lookupTables: LookupTables,
  list: List,
  settings: SettingsState,
  targetDeck?: "slots" | "extraSlots" | "both",
) {
  const filters: Filter[] = [];

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
              settings.showAllCards,
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
        const value = filterValue.value as SubtypeFilter;
        filters.push(filterSubtypes(value));
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

// This selector uses a custom equality check that avoid re-creation on every deck change.
// Deck access is only affected by a few subset of deck changes:
// 1. The deck changes.
// 2. The taboo that the deck uses changes.
// 3. An investigator side changes.
// 4. Cards that change deckbuilding rules (i.e. On Your Own, Versatile...) are added or removed.
// 5. Customizations change, some options change card properties.
// 6. Investigator option selections change.
// 7. Deck card pool changes.
const deckAccessEqualSelector = createCustomEqualSelector((a, b) => {
  if (isResolvedDeck(a) && isResolvedDeck(b)) {
    return (
      a.id === b.id && // (1)
      a.taboo_id === b.taboo_id && // 2
      a.investigatorFront.card.code === b.investigatorFront.card.code && // 3
      a.investigatorBack.card.code === b.investigatorBack.card.code && // 3
      JSON.stringify(getAdditionalDeckOptions(a)) ===
        JSON.stringify(getAdditionalDeckOptions(b)) && // 4
      JSON.stringify(a.customizations) === JSON.stringify(b.customizations) && // 5
      JSON.stringify(a.selections) === JSON.stringify(b.selections) && // 6
      JSON.stringify(a.metaParsed.card_pool) ===
        JSON.stringify(b.metaParsed.card_pool) // 7
    );
  }

  // biome-ignore lint/suspicious/noDoubleEquals: we want a shallow equality check in this context.
  return a == b;
});

// Mirrors the customization check above.
const customizationsEqualSelector = createCustomEqualSelector((a, b) => {
  return isResolvedDeck(a) && isResolvedDeck(b)
    ? JSON.stringify(a.customizations) === JSON.stringify(b.customizations)
    : // biome-ignore lint/suspicious/noDoubleEquals: we want a shallow equality check in this context.
      a == b;
});

const selectDeckInvestigatorFilter = deckAccessEqualSelector(
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (_: StoreState, resolvedDeck?: ResolvedDeck) => resolvedDeck,
  (
    _: StoreState,
    __?: ResolvedDeck,
    targetDeck?: "slots" | "extraSlots" | "both",
  ) => targetDeck,
  (state: StoreState) => state.ui.showUnusableCards,
  (metadata, lookupTables, resolvedDeck, targetDeck, showUnusableCards) => {
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

    const investigatorAccessFilter = or(ors);

    const cardPool = resolvedDeck.metaParsed.card_pool?.split(",");
    if (!cardPool?.length) return investigatorAccessFilter;

    const packFilter = filterPackCode(cardPool, metadata, lookupTables);
    if (!packFilter) return investigatorAccessFilter;

    return and([
      investigatorAccessFilter,
      or([packFilter, (c) => c.xp == null]),
    ]);
  },
);

const selectResolvedDeckCustomizations = customizationsEqualSelector(
  (_: StoreState, resolvedDeck?: ResolvedDeck) => resolvedDeck,
  (resolvedDeck) => resolvedDeck?.customizations,
);

const selectBaseListCards = createSelector(
  (state: StoreState) => state.metadata,
  (state: StoreState) => selectActiveList(state)?.systemFilter,
  selectDeckInvestigatorFilter,
  selectCanonicalTabooSetId,
  selectResolvedDeckCustomizations,
  (
    metadata,
    systemFilter,
    deckInvestigatorFilter,
    tabooSetId,
    customizations,
  ) => {
    if (isEmpty(metadata.cards)) {
      console.warn("player cards selected before store is initialized.");
      return undefined;
    }

    time("select_base_list_cards");

    let filteredCards = Object.values(metadata.cards);

    // filters can be impacted by card changes, apply them now.
    if (tabooSetId || customizations) {
      filteredCards = filteredCards.map((c) =>
        applyCardChanges(c, metadata, tabooSetId, customizations),
      );
    }

    // apply system filter early to cut down on # of cards that need to be processed.
    if (systemFilter) filteredCards = filteredCards.filter(systemFilter);

    if (deckInvestigatorFilter) {
      filteredCards = filteredCards.filter(deckInvestigatorFilter);
    }

    timeEnd("select_base_list_cards");
    return filteredCards;
  },
);

export const selectListCards = createSelector(
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (state: StoreState) => state.settings,
  selectActiveList,
  selectBaseListCards,
  (metadata, lookupTables, settings, activeList, _filteredCards) => {
    if (!_filteredCards || !activeList) return undefined;

    time("select_list_cards");
    let filteredCards = _filteredCards;

    // apply search after initial filtering to cut down on search operations.
    if (activeList.search.value) {
      filteredCards = applySearch(activeList.search, filteredCards, metadata);
    }

    // this is the count of cards that a search would have matched before user filters are taken into account.
    const totalCardCount = filteredCards.length;

    // apply user filters.
    const filter = makeUserFilter(metadata, lookupTables, activeList, settings);
    if (filter) filteredCards = filteredCards.filter(filter);

    const cards: Card[] = [];
    const groups: CardGroup[] = [];
    const groupCounts: number[] = [];

    for (const group of getGroupedCards(
      activeList.display.grouping,
      filteredCards,
      makeSortFunction(activeList.display.sorting, metadata),
      metadata,
    )) {
      cards.push(...group.cards);

      groups.push({
        key: group.key,
        type: group.type,
      });

      groupCounts.push(group.cards.length);
    }

    timeEnd("select_list_cards");

    return {
      key: activeList.key,
      groups,
      cards,
      groupCounts,
      totalCardCount,
    } as ListState;
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
