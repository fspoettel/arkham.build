import { splitMultiValue } from "@/utils/card-utils";
import { ASSET_SLOT_ORDER, FACTION_ORDER, SKILL_KEYS } from "@/utils/constants";
import { createCustomEqualSelector } from "@/utils/custom-equal-selector";
import { capitalize, formatTabooSet } from "@/utils/formatting";
import type { Filter } from "@/utils/fp";
import { and, not, or } from "@/utils/fp";
import { isEmpty } from "@/utils/is-empty";
import { time, timeEnd } from "@/utils/time";
import { createSelector } from "reselect";
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
  filterSealed,
  filterSkillIcons,
  filterSubtypes,
  filterTabooSet,
  filterTraits,
  filterType,
} from "../lib/filtering";
import { getGroupedCards } from "../lib/grouping";
import { resolveCardWithRelations } from "../lib/resolve-card";
import { applySearch } from "../lib/searching";
import {
  makeSortFunction,
  sortAlphabetical,
  sortByName,
  sortedEncounterSets,
} from "../lib/sorting";
import {
  type FactionName,
  type ResolvedDeck,
  isResolvedDeck,
} from "../lib/types";
import type { Card, Cycle, Pack } from "../services/queries.types";
import type { StoreState } from "../slices";
import type {
  AssetFilter,
  CostFilter,
  LevelFilter,
  List,
  MultiselectFilter,
  OwnershipFilter,
  PropertiesFilter,
  SelectFilter,
  SkillIconsFilter,
  SubtypeFilter,
} from "../slices/lists.types";
import type { LookupTables } from "../slices/lookup-tables.types";
import type { Metadata } from "../slices/metadata.types";

export type CardGroup = {
  type: string;
  key: string;
};

export type ListState = {
  cards: Card[];
  groupCounts: number[];
  groups: CardGroup[];
  key: string;
  totalCardCount: number;
};

function makeUserFilter(
  metadata: Metadata,
  lookupTables: LookupTables,
  list: List,
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

      // These filters are handled in the "system" filter of the list since they should
      // be reflected in the choices available to the user.
      // For instance, it does not make sense to show weakness or non-collection card traits
      // as options in the trait filter.
      // TODO: At some point, we might want to refactor the store data structure to reflect this.
      case "subtype":
      case "ownership": {
        break;
      }
    }
  });

  return filters.length ? and(filters) : undefined;
}

export const selectActiveList = (state: StoreState) => {
  const active = state.activeList;
  return active ? state.lists[active] : undefined;
};

export const selectActiveListFilters = (state: StoreState) => {
  const active = selectActiveList(state);
  return active ? active.filters : [];
};

export const selectActiveListFilter = createSelector(
  selectActiveList,
  (_: StoreState, id: number) => id,
  (list, id) => {
    return list ? list.filterValues[id] : undefined;
  },
);

export const selectCanonicalTabooSetId = (
  state: StoreState,
  resolvedDeck?: ResolvedDeck,
) => {
  if (resolvedDeck?.taboo_id) {
    return resolvedDeck.taboo_id;
  }

  const filters = selectActiveListFilters(state);
  const filterId = filters.findIndex((f) => f === "tabooSet");

  const filterValue = filterId
    ? selectActiveListFilter(state, filterId)
    : undefined;

  if (typeof filterValue?.value === "number") return filterValue.value;

  return state.settings.tabooSetId;
};

// This selector uses a custom equality check that avoid re-creation on every deck change.
// Deck access is only affected by a few subset of deck changes:
// 1. The deck changes.
// 2. The taboo that the deck uses changes.
// 3. An investigator side changes.
// 4. Cards that change deckbuilding rules (i.e. On Your Own, Versatile...) are added or removed.
// 5. Customizations change, some options change card properties.
// 6. Investigator option selections change.
// 7. Deck card pool changes.
// 8. Sealed deck chanees.
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
        JSON.stringify(b.metaParsed.card_pool) && // 7
      a.metaParsed.sealed_deck === b.metaParsed.sealed_deck // 8
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
  ) => targetDeck ?? "slots",
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
            card.restrictions?.investigator?.[card.code]),
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

    const cardPool = resolvedDeck.cardPool;
    const sealedDeck = resolvedDeck.sealedDeck?.cards;

    if (!cardPool?.length && !sealedDeck) {
      return investigatorAccessFilter;
    }
    const ands = [investigatorAccessFilter];

    if (cardPool) {
      const packFilter = filterPackCode(cardPool, metadata, lookupTables);
      if (packFilter) {
        ands.push(or([packFilter, (c) => c.xp == null]));
      }
    }

    if (sealedDeck) {
      ands.push(
        or([filterSealed(sealedDeck, lookupTables), (c) => c.xp == null]),
      );
    }

    return and(ands);
  },
);

const selectResolvedDeckCustomizations = customizationsEqualSelector(
  (_: StoreState, resolvedDeck?: ResolvedDeck) => resolvedDeck,
  (resolvedDeck) => resolvedDeck?.customizations,
);

const selectBaseListCards = createSelector(
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (state: StoreState) => state.settings,
  (state: StoreState) => selectActiveList(state)?.systemFilter,
  (state: StoreState) => selectActiveList(state)?.filterValues,
  selectDeckInvestigatorFilter,
  selectCanonicalTabooSetId,
  selectResolvedDeckCustomizations,
  (
    metadata,
    lookupTables,
    settings,
    systemFilter,
    filterValues,
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

    const filters = [];

    if (systemFilter) filters.push(systemFilter);

    if (deckInvestigatorFilter) {
      filters.push(deckInvestigatorFilter);
    }

    if (filterValues) {
      const ownershipFilter = Object.values(filterValues).find(
        (f) => f.type === "ownership",
      );

      if (ownershipFilter) {
        const value = ownershipFilter.value as OwnershipFilter;
        if (value !== "all") {
          filters.push((card: Card) => {
            const ownership = filterOwnership(
              card,
              metadata,
              lookupTables,
              settings.collection,
              false,
            );
            return value === "owned" ? ownership : !ownership;
          });
        }
      }

      const subtypeFilter = Object.values(filterValues).find(
        (f) => f.type === "subtype",
      );

      if (subtypeFilter) {
        const value = subtypeFilter.value as SubtypeFilter;
        if (value) {
          filters.push(filterSubtypes(value));
        }
      }
    }

    if (filters.length) {
      filteredCards = filteredCards.filter(and(filters));
    }

    timeEnd("select_base_list_cards");
    return filteredCards;
  },
);

export const selectListCards = createSelector(
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  selectActiveList,
  selectBaseListCards,
  (metadata, lookupTables, activeList, _filteredCards) => {
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
    const filter = makeUserFilter(metadata, lookupTables, activeList);
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

/**
 * Utilities
 */

const selectListFilterProperties = createSelector(
  (state: StoreState) => state.lookupTables.actions,
  selectBaseListCards,
  (actionTable, cards) => {
    time("select_card_list_properties");

    const cost = { min: 0, max: 0 };
    const health = { min: 0, max: 0 };
    const sanity = { min: 0, max: 0 };

    const actions: Set<string> = new Set();
    const traits: Set<string> = new Set();
    const types: Set<string> = new Set();

    if (cards) {
      for (const card of cards) {
        types.add(card.type_code);

        if (card.cost != null && card.cost >= 0) {
          cost.min = Math.min(cost.min, card.cost);
          cost.max = Math.max(cost.max, card.cost);
        }

        if (card.health != null && card.health >= 0) {
          health.min = Math.min(health.min, card.health);
          health.max = Math.max(health.max, card.health);
        }

        if (card.sanity != null && card.sanity >= 0) {
          sanity.min = Math.min(sanity.min, card.sanity);
          sanity.max = Math.max(sanity.max, card.sanity);
        }

        for (const trait of splitMultiValue(card.real_traits)) {
          traits.add(trait);
        }

        for (const trait of splitMultiValue(card.real_back_traits)) {
          traits.add(trait);
        }
      }

      for (const [key, table] of Object.entries(actionTable)) {
        for (const card of cards) {
          if (actions.has(key)) {
            break;
          }

          if (table[card.code]) {
            actions.add(key);
          }
        }
      }
    }

    timeEnd("select_card_list_properties");

    return {
      actions,
      cost,
      health,
      sanity,
      traits,
      types,
    };
  },
);

/**
 * Actions
 */

export const selectActionOptions = createSelector(
  selectListFilterProperties,
  ({ actions }) => {
    return Array.from(actions)
      .sort()
      .map((code) => ({ code }));
  },
);

export const selectMultiselectChanges = (value: MultiselectFilter) => {
  if (!value) return "";
  return value.map(capitalize).join(" or ");
};

/**
 * Asset
 */

export const selectAssetOptions = createSelector(
  (state: StoreState) => state.lookupTables,
  selectListFilterProperties,
  (lookupTables, filterProps) => {
    const uses = Object.keys(lookupTables.uses)
      .map((code) => ({ code }))
      .sort((a, b) => sortAlphabetical(a.code, b.code));

    const skillBoosts = SKILL_KEYS.filter((x) => x !== "wild");

    uses.sort();

    return {
      health: filterProps.health,
      sanity: filterProps.sanity,
      uses,
      slots: ASSET_SLOT_ORDER.map((code) => ({ code })),
      skillBoosts,
    };
  },
);

export const selectAssetChanges = (value: AssetFilter) => {
  const slot = value.slots.reduce((acc, key) => {
    return !acc ? `Slot: ${capitalize(key)}` : `${acc} or ${key}`;
  }, "");

  const uses = value.uses.reduce((acc, key) => {
    return !acc ? `Uses: ${capitalize(key)}` : `${acc} or ${key}`;
  }, "");

  const skillBoosts = value.skillBoosts.reduce((acc, key) => {
    return !acc
      ? `Skill boost: ${capitalize(key)}`
      : `${acc} or ${capitalize(key)}`;
  }, "");

  let healthFilter = "";

  if (value.health) {
    let s = `${value.health[0]}`;
    if (value.health[1] !== value.health[0]) {
      s = `${s}-${value.health[1]}`;
    }
    healthFilter = `Health: ${s}`;
  }

  let sanityFilter = "";

  if (value.sanity) {
    let s = `${value.sanity[0]}`;

    if (value.sanity[1] !== value.sanity[0]) {
      s = `${s}-${value.sanity[1]}`;
    }

    sanityFilter = `Sanity: ${s}`;
  }

  return [slot, uses, skillBoosts, sanityFilter, healthFilter]
    .filter((x) => x)
    .join(", ");
};

/**
 * Cost
 */

export const selectCostMinMax = createSelector(
  selectListFilterProperties,
  ({ cost }) => cost,
);

export const selectCostChanges = (value: CostFilter) => {
  if (!value.range) return "";

  let s = `${value.range[0]}`;
  if (value.range[1] !== value.range[0]) s = `${s}-${value.range[1]}`;
  if (value.even) s = `${s}, even`;
  if (value.odd) s = `${s}, odd`;
  if (value.x) s = `${s}, X`;

  return s;
};

/**
 * Encounter Set
 */

export const selectEncounterSetOptions = createSelector(
  (state: StoreState) => state.metadata,
  (metadata) => sortedEncounterSets(metadata),
);

export const selectEncounterSetChanges = createSelector(
  (_: StoreState, value: MultiselectFilter) => value,
  (state: StoreState) => state.metadata,
  (value, metadata) => {
    return value.map((id) => metadata.encounterSets[id].name).join(" or ");
  },
);

/**
 * Factions
 */

export const selectFactionOptions = createSelector(
  selectActiveList,
  (state: StoreState) => state.metadata.factions,
  (list, factionMeta) => {
    if (!list) return [];

    const cardType = list.cardType;

    const factions = Object.values(factionMeta).filter((f) =>
      cardType === "player" ? f.is_primary : !f.is_primary,
    );

    if (cardType === "player") {
      factions.push({
        code: "multiclass",
        name: "Multiclass",
        is_primary: true,
      });
    } else {
      factions.push(factionMeta["neutral"]);
    }

    factions.sort(
      (a, b) =>
        FACTION_ORDER.indexOf(a.code as FactionName) -
        FACTION_ORDER.indexOf(b.code as FactionName),
    );

    return factions;
  },
);

/**
 * Investigator
 */

export const selectInvestigatorOptions = createSelector(
  (state: StoreState) => state.lookupTables,
  (state: StoreState) => state.metadata,
  (lookupTables, metadata) => {
    const investigatorTable = lookupTables.typeCode["investigator"];

    const investigators = Object.keys(investigatorTable).reduce<Card[]>(
      (acc, code) => {
        const card = metadata.cards[code];

        if (
          card &&
          !card.encounter_code &&
          (!card.alt_art_investigator || card.parallel)
        ) {
          acc.push(card);
        }

        return acc;
      },
      [],
    );

    investigators.sort(sortByName);
    return investigators;
  },
);

export const selectInvestigatorChanges = createSelector(
  (_: StoreState, value: SelectFilter) => value,
  (state: StoreState) => state.metadata,
  (value, metadata) => {
    if (!value) return "";
    const card = metadata.cards[value];
    return card
      ? `${card.real_name}${card.parallel ? " (Parallel)" : ""}`
      : value.toString();
  },
);

/**
 * Level
 */

export const selectLevelChanges = (value: LevelFilter) => {
  if (!value.range) return undefined;
  let s = `${value.range[0]}`;
  if (value.range[1] !== value.range[0]) s = `${s}-${value.range[1]}`;
  if (value.exceptional) s = `${s}, exceptional`;
  if (value.nonexceptional) s = `${s}, nonexceptional`;
  return s;
};

/**
 * Packs
 */

type CycleWithPacks = (Cycle & {
  packs: Pack[];
  reprintPacks: Pack[];
})[];

export const selectCyclesAndPacks = createSelector(
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (metadata, lookupTables) => {
    const cycles: CycleWithPacks = Object.entries(
      lookupTables.packsByCycle,
    ).map(([cycleCode, packTable]) => {
      const cycle = metadata.cycles[cycleCode];

      const packs: Pack[] = [];
      const reprintPacks: Pack[] = [];

      for (const code of Object.keys(packTable)) {
        const pack = metadata.packs[code];
        (pack.reprint ? reprintPacks : packs).push(pack);
      }

      reprintPacks.sort((a, b) => a.position - b.position);
      packs.sort((a, b) => a.position - b.position);

      return { ...cycle, packs, reprintPacks };
    });

    cycles.sort((a, b) => a.position - b.position);

    return cycles;
  },
);

const filterNewFormat = (packs: Pack[], cardType: string) => {
  return packs.filter((pack) =>
    cardType === "encounter"
      ? pack.code.endsWith("c")
      : pack.code.endsWith("p"),
  );
};

export const selectPackOptions = createSelector(
  selectCyclesAndPacks,
  selectActiveList,
  (cycles, list) => {
    if (!list) return [];

    return cycles.flatMap((cycle) => {
      if (cycle.reprintPacks.length && cycle.code !== "core") {
        return filterNewFormat(cycle.reprintPacks, list?.cardType);
      }

      return cycle.packs.length === 2
        ? filterNewFormat(cycle.packs, list.cardType)
        : [...cycle.reprintPacks, ...cycle.packs];
    });
  },
);

export const selectPackChanges = createSelector(
  (_: StoreState, value: MultiselectFilter) => value,
  (state: StoreState) => state.metadata,
  (value, metadata) => {
    if (!value) return "";
    return value.map((id) => metadata.packs[id].real_name).join(" or ");
  },
);

/**
 * Properties
 */

export const selectPropertiesChanges = (value: PropertiesFilter) => {
  return Object.entries(value).reduce((acc, [key, filterValue]) => {
    if (!filterValue) return acc;
    return !acc ? capitalize(key) : `${acc} and ${capitalize(key)}`;
  }, "");
};

/**
 * Skill Icons
 */

export const selectSkillIconsChanges = (value: SkillIconsFilter) => {
  return Object.entries(value).reduce((acc, [key, val]) => {
    if (!val) return acc;
    const s = `${val}+ ${capitalize(key)}`;
    return acc ? `${acc} and ${s}` : s;
  }, "");
};

/**
 * Taboo Set
 */

export const selectTabooSetOptions = (state: StoreState) => {
  const sets = Object.values(state.metadata.tabooSets);
  sets.sort((a, b) => sortAlphabetical(b.date, a.date));
  return sets;
};

export const selectTabooSetSelectOptions = (state: StoreState) => {
  const sets = Object.values(state.metadata.tabooSets);
  sets.sort((a, b) => sortAlphabetical(b.date, a.date));
  return sets.map((s) => ({
    label: formatTabooSet(s),
    value: s.id,
  }));
};

export const selectTabooSetChanges = createSelector(
  (_: StoreState, value: SelectFilter) => value,
  (state: StoreState) => state.metadata,
  (value, metadata) => {
    if (!value) return "";
    const set = metadata.tabooSets[value];
    return set ? formatTabooSet(set) : value.toString();
  },
);

/**
 * Trait
 */

export const selectTraitOptions = createSelector(
  selectListFilterProperties,
  ({ traits }) =>
    Array.from(traits)
      .sort()
      .map((code) => ({ code })),
);

/**
 * Subtype
 */

const subtypeLabels: Record<string, string> = {
  none: "None",
  weakness: "Weakness",
  basicweakness: "Basic weakness",
};

export function selectSubtypeOptions() {
  return [
    { code: "none", name: "None" },
    { code: "weakness", name: "Weakness" },
    { code: "basicweakness", name: "Basic weakness" },
  ];
}

export const selectSubtypeChanges = createSelector(
  (_: StoreState, value: SubtypeFilter) => value,
  (value) => {
    const options = Object.entries(value);
    const enabled = options.filter(([, value]) => !!value);

    if (enabled.length === 0) return "None";
    if (enabled.length === options.length) return "";

    return enabled.map(([key]) => subtypeLabels[key]).join(" or ");
  },
);

/**
 * Type
 */

export const selectTypeOptions = createSelector(
  selectListFilterProperties,
  (state: StoreState) => state.metadata.types,
  ({ types }, typeTable) =>
    Array.from(types)
      .sort()
      .map((code) => typeTable[code]),
);

/**
 * Search
 */

export const selectActiveListSearch = createSelector(
  selectActiveList,
  (list) => list?.search,
);

export const selectResolvedCardById = createSelector(
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (_: StoreState, code: string) => code,
  (_: StoreState, __: string, resolvedDeck?: ResolvedDeck) => resolvedDeck,
  (metadata, lookupTables, code, resolvedDeck) => {
    return resolveCardWithRelations(
      metadata,
      lookupTables,
      code,
      resolvedDeck?.taboo_id,
      resolvedDeck?.customizations,
      true,
    );
  },
);
