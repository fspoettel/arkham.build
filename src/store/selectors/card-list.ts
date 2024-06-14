import { createSelector } from "reselect";

import { capitalize } from "@/utils/capitalize";
import type { SkillKey } from "@/utils/constants";
import { PLAYER_TYPE_ORDER, SKILL_KEYS } from "@/utils/constants";
import type { Filter } from "@/utils/fp";
import { and, not, or, pass } from "@/utils/fp";

import type { Grouping } from "../lib/grouping";
import { getGroupCards } from "../lib/grouping";
import { applySearch } from "../lib/searching";
import {
  sortAlphabetically,
  sortByEncounterPosition,
  sortedBySlots,
  sortedEncounterSets,
} from "../lib/sorting";
import { applyTaboo } from "../lib/taboos";
import type { Card } from "../services/types";
import type { StoreState } from "../slices";
import type {
  AssetFilter,
  CardTypeFilter,
  CostFilter,
  LevelFilter,
  MultiselectFilter,
  PropertiesFilter,
  SkillIconsFilter,
} from "../slices/filters/types";
import type { LookupTables } from "../slices/lookup-tables/types";
import type { Metadata } from "../slices/metadata/types";
import { selectCanonicalTabooSetId } from "./filters";

export type ListState = {
  key: CardTypeFilter;
  groups: Grouping[];
  cards: Card[];
  groupCounts: number[];
};

/**
 * Grouping
 */

export const selectGroupedBySlot = createSelector(
  (state: StoreState) => state.lookupTables.slots,
  (slotsTable) =>
    sortedBySlots(slotsTable).map((slot) => ({
      name: `Asset: ${slot}`,
      code: slot,
      grouping_type: "slot",
    })),
);

export const selectPlayerCardGroups = createSelector(
  (state: StoreState) => state.metadata,
  selectGroupedBySlot,
  (metadata, slotGroups) => {
    return PLAYER_TYPE_ORDER.flatMap((type) =>
      type === "asset"
        ? slotGroups
        : { ...metadata.types[type], grouping_type: "type" },
    ) as Grouping[];
  },
);

const selectWeaknessGroups = createSelector(
  (state: StoreState) => state.metadata.subtypes,
  (subtypes) => {
    const groups = Object.keys(subtypes).map((code) => ({
      code: code,
      name: code === "weakness" ? "Weakness" : "Basic Weakness",
      grouping_type: "subtype",
    }));

    groups.sort((a) => (a.code === "weakness" ? -1 : 1));

    return groups;
  },
);

const selectEncounterSetGroups = createSelector(
  (state: StoreState) => state.metadata,
  (metadata) => {
    return sortedEncounterSets(metadata).map((e) => ({
      code: e.code,
      name: e.name,
      grouping_type: "encounter_set",
    }));
  },
);

/**
 * Shared
 */

function filterWeaknesses(card: Card) {
  return !card.subtype_code;
}

function filterDuplicates(card: Card) {
  return (
    !card.hidden && // filter hidden cards (usually backsides)
    !card.alt_art_investigator && // filter novellas && parallel investigators
    !card.duplicate_of_code // filter revised_code.
  );
}

function filterEncounterCards(card: Card) {
  return !card.encounter_code; // filter out encounter cards (story player cards).
}

// needs to filter out some bad data that would otherwise end up in player cards (i.e. 04325).
function filterMythosCards(card: Card) {
  return card.faction_code !== "mythos";
}

function filterBacksides(card: Card) {
  return !card.linked;
}

const selectActiveCardType = (state: StoreState) => state.filters.cardType;

/**
 * Actions
 */

function filterActions(
  filterState: MultiselectFilter["value"],
  actionTable: LookupTables["actions"],
) {
  const filters: Filter[] = [];

  for (const [key, value] of Object.entries(filterState)) {
    if (value) filters.push((c: Card) => !!actionTable[key][c.code]);
  }

  const filter = or(filters);
  return (card: Card) => filter(card);
}

const selectActionsFilter = createSelector(
  (state: StoreState) => state.lookupTables.actions,
  (state: StoreState) => state.filters[state.filters.cardType].action,
  (actionTable, filterState) => filterActions(filterState.value, actionTable),
);

/**
 * Asset
 */

function filterUses(uses: string, usesTable: LookupTables["uses"]) {
  return (card: Card) => !!usesTable[uses]?.[card.code];
}

function filterSkillBoost(
  skillBoost: string,
  skillBoostsTable: LookupTables["skillBoosts"],
) {
  return (card: Card) => !!skillBoostsTable[skillBoost]?.[card.code];
}

function filterSlots(slot: string, slotsTable: LookupTables["slots"]) {
  return (card: Card) => !!slotsTable[slot]?.[card.code];
}

function filterHealthProp(
  minMax: [number, number],
  healthX: boolean,
  key: "health" | "sanity",
) {
  return (card: Card) => {
    if (card.health === -2) return healthX;

    const health = card[key] ?? 0;
    return (
      card.type_code === "asset" && health >= minMax[0] && health <= minMax[1]
    );
  };
}

function filterAssets(
  { value: filterValue }: AssetFilter,
  lookupTables: LookupTables,
) {
  const filters: Filter[] = [];

  if (filterValue.health)
    filters.push(
      filterHealthProp(filterValue.health, filterValue.healthX, "health"),
    );
  if (filterValue.sanity)
    filters.push(
      filterHealthProp(filterValue.sanity, filterValue.healthX, "sanity"),
    );

  const usesFilters: Filter[] = [];
  const skillBoostFilters: Filter[] = [];
  const slotsFilter: Filter[] = [];

  for (const [key, val] of Object.entries(filterValue.skillBoosts)) {
    if (val)
      skillBoostFilters.push(filterSkillBoost(key, lookupTables.skillBoosts));
  }

  for (const [key, val] of Object.entries(filterValue.uses)) {
    if (val) usesFilters.push(filterUses(key, lookupTables.uses));
  }

  for (const [key, val] of Object.entries(filterValue.slots)) {
    if (val) slotsFilter.push(filterSlots(key, lookupTables.slots));
  }

  if (skillBoostFilters.length) filters.push(or(skillBoostFilters));
  if (usesFilters.length) filters.push(or(usesFilters));
  if (slotsFilter.length) filters.push(or(slotsFilter));

  return (card: Card) => and(filters)(card);
}

const selectAssetFilter = createSelector(
  (state: StoreState) => state.filters[state.filters.cardType].asset,
  (state: StoreState) => state.lookupTables,
  (filterState, lookupTables) => filterAssets(filterState, lookupTables),
);

/**
 * Cost
 */

function filterEvenCost(card: Card) {
  return card.cost != null && card.cost % 2 === 0;
}

function filterOddCost(card: Card) {
  return card.cost != null && card.cost % 2 !== 0;
}

function filterXCost(xCost: boolean) {
  return (card: Card) => xCost && card.cost === -2;
}

function filterCardCost(value: [number, number] | undefined) {
  if (!value) return pass;

  return (card: Card) =>
    card.cost != null && card.cost >= value[0] && card.cost <= value[1];
}

function filterCost(filterState: CostFilter["value"]) {
  // apply level range if provided. `0-5` is assumed, null-costed cards are excluded.
  const filters = [filterCardCost(filterState.range)];

  // apply even / odd filters
  const moduloFilters = [];

  if (filterState.even) moduloFilters.push(filterEvenCost);
  if (filterState.odd) moduloFilters.push(filterOddCost);

  filters.push(or(moduloFilters));

  const filter = or([filterXCost(filterState.x), and(filters)]);

  return (card: Card) => filter(card);
}

const selectCostFilter = createSelector(
  (state: StoreState) => state.filters[state.filters.cardType].cost.value,
  (filterState) => (filterState.range ? filterCost(filterState) : undefined),
);

/**
 * Encounter Set
 */

function filterEncounterCode(filterState: MultiselectFilter["value"]) {
  const filters: Filter[] = [];

  for (const [key, value] of Object.entries(filterState)) {
    if (value) filters.push((c: Card) => c.encounter_code === key);
  }

  const filter = or(filters);
  return (card: Card) => filter(card);
}

const selectEncounterSetFilter = createSelector(
  (state: StoreState) => state.filters.encounter.encounterSet,
  (filterState) => filterEncounterCode(filterState.value),
);

/**
 * Factions
 */

function filterMulticlass(card: Card) {
  return !!card.faction2_code;
}

function filterFaction(faction: string) {
  return (card: Card) =>
    card.faction_code === faction ||
    (!!card.faction2_code && card.faction2_code === faction) ||
    (!!card.faction3_code && card.faction3_code === faction);
}

function filterFactions(factions: string[]) {
  if (!factions.length) return pass;

  if (factions.length === 1 && factions[0] === "multiclass") {
    return filterMulticlass;
  }

  const ands: Filter[] = [];
  const ors: Filter[] = [];

  for (const faction of factions) {
    if (faction === "multiclass") {
      ands.push(filterMulticlass);
    } else {
      ors.push(filterFaction(faction));
    }
  }

  const filter = and([or(ors), ...ands]);
  return (card: Card) => filter(card);
}

const selectFactionFilter = createSelector(
  (state: StoreState) => state.filters[state.filters.cardType].faction,
  (filterState) =>
    filterState.value ? filterFactions(filterState.value) : undefined,
);

/**
 * Level
 */

function filterExceptional(card: Card) {
  return !!card.exceptional;
}

function filterNonexceptional(card: Card) {
  return !card.exceptional;
}

function filterCardLevel(value: [number, number] | undefined) {
  if (!value) return pass;

  return (card: Card) => {
    return card.xp != null && card.xp >= value[0] && card.xp <= value[1];
  };
}

function filterLevel(filterState: LevelFilter["value"]) {
  if (!filterState.range) return pass;

  const filters = [];

  if (filterState.range) {
    filters.push(filterCardLevel(filterState.range));
  }

  if (filterState.exceptional !== filterState.nonexceptional) {
    if (filterState.exceptional) {
      filters.push(filterExceptional);
    } else {
      filters.push(filterNonexceptional);
    }
  }

  const filter = and(filters);

  return (card: Card) => {
    return filter(card);
  };
}

const selectLevelFilter = createSelector(
  (state: StoreState) => state.filters.player.level.value,
  (filterState) => (filterState.range ? filterLevel(filterState) : undefined),
);

/**
 * Ownership
 */

function filterOwnership(
  card: Card,
  metadata: Metadata,
  lookupTables: LookupTables,
  setting: Record<string, number | boolean>,
) {
  // direct pack ownership.
  if (setting[card.pack_code]) return true;

  // ownership of the new format.
  const pack = metadata.packs[card.pack_code];
  const reprintId = `${pack.cycle_code}${card.encounter_code ? "c" : "p"}`;
  if (setting[reprintId]) return true;

  // revised core.
  if (!setting["rcore"]) return false;

  // core.
  if (card.pack_code === "core") return true;

  // reprints from other cycles.
  const duplicates = lookupTables.relations.duplicates[card.code];

  return (
    duplicates &&
    Object.keys(duplicates).some((code) => {
      const packCode = metadata.cards[code].pack_code;
      return packCode && setting[packCode];
    })
  );
}

const selectOwnershipFilter = createSelector(
  (state: StoreState) => state.settings.collection,
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (state: StoreState) => state.filters[state.filters.cardType].ownership.value,
  (setting, metadata, lookupTables, filterState) => {
    if (filterState === "all") return pass;
    return (card: Card) => {
      const ownsCard = filterOwnership(card, metadata, lookupTables, setting);
      return filterState === "owned" ? ownsCard : !ownsCard;
    };
  },
);

/**
 * Pack
 */

const selectPackCodeFilter = createSelector(
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (state: StoreState) => state.filters[state.filters.cardType].packCode,
  (metadata, lookupTables, filterState) => {
    if (!Object.keys(filterState.value).length) return pass;

    const active = Object.values(filterState.value).some((x) => x);
    if (!active) return pass;

    // re-use the ownership filter, the logic is identical.
    return (card: Card) =>
      filterOwnership(card, metadata, lookupTables, filterState.value);
  },
);

/**
 * Properties
 */

function filterBonded(bondedTable: LookupTables["relations"]["bonded"]) {
  return (card: Card) => !!bondedTable[card.code];
}

function filterCustomizable(card: Card) {
  return !!card.customization_options;
}

function filterExile(card: Card) {
  return !!card.exile;
}

function filterFast(fastTable: LookupTables["properties"]["fast"]) {
  return (card: Card) => !!fastTable[card.code];
}

function filterUnique(card: Card) {
  return !!card.is_unique;
}

function filterVictory(card: Card) {
  return !!card.victory;
}

function filterSeal(sealTable: LookupTables["properties"]["seal"]) {
  return (card: Card) => !!sealTable[card.code];
}

function filterPermanent(slotTable: LookupTables["slots"]) {
  return (card: Card) => !!slotTable["Permanent"]?.[card.code];
}

function filterSucceedBy(
  succeedByTable: LookupTables["properties"]["succeedBy"],
) {
  return (card: Card) => !!succeedByTable[card.code];
}

function filterHealsDamage(
  healsDamageTable: LookupTables["properties"]["healsDamage"],
) {
  return (card: Card) => !!healsDamageTable[card.code];
}

function filterHealsHorror(
  healsHorrorTable: LookupTables["properties"]["healsHorror"],
) {
  return (card: Card) => !!healsHorrorTable[card.code];
}

function filterProperties(
  filterState: PropertiesFilter["value"],
  lookupTables: LookupTables,
) {
  const filters: Filter[] = [];

  if (filterState.bonded) {
    filters.push(filterBonded(lookupTables.relations.bonded));
  }

  if (filterState.customizable) {
    filters.push(filterCustomizable);
  }

  if (filterState.exile) {
    filters.push(filterExile);
  }

  if (filterState.fast) {
    filters.push(filterFast(lookupTables.properties.fast));
  }

  if (filterState.unique) {
    filters.push(filterUnique);
  }

  if (filterState.permanent) {
    filters.push(filterPermanent(lookupTables.slots));
  }

  if (filterState.seal) {
    filters.push(filterSeal(lookupTables.properties.seal));
  }

  if (filterState.victory) {
    filters.push(filterVictory);
  }

  if (filterState.healsDamage) {
    filters.push(filterHealsDamage(lookupTables.properties.healsDamage));
  }

  if (filterState.healsHorror) {
    filters.push(filterHealsHorror(lookupTables.properties.healsHorror));
  }

  if (filterState.succeedBy) {
    filters.push(filterSucceedBy(lookupTables.properties.succeedBy));
  }

  const filter = and(filters);

  return (card: Card) => {
    return filter(card);
  };
}

const selectPropertiesFilter = createSelector(
  (state: StoreState) => state.lookupTables,
  (state: StoreState) => state.filters[state.filters.cardType].properties,
  (lookupTables, filterState) =>
    filterProperties(filterState.value, lookupTables),
);

/**
 * Skill Icons
 */

function filterSkill(skill: SkillKey, amount: number) {
  return (card: Card) =>
    card.type_code !== "investigator" &&
    (card[`skill_${skill}`] ?? 0) >= amount;
}

function filterSkillIcons(filterState: SkillIconsFilter["value"]) {
  const iconFilter: Filter[] = [];
  const anyFilter: Filter[] = [];

  const anyV = filterState.any;

  for (const skill of SKILL_KEYS) {
    const v = filterState[skill];

    if (v) {
      iconFilter.push(filterSkill(skill, v));
    }

    if (anyV) {
      anyFilter.push(filterSkill(skill, anyV));
    }
  }

  const filter = anyFilter.length
    ? and([or(anyFilter), and(iconFilter)])
    : and(iconFilter);

  return (card: Card) => {
    return filter(card);
  };
}

const selectSkillIconsFilter = createSelector(
  (state: StoreState) => state.filters[state.filters.cardType].skillIcons,
  (filterState) => filterSkillIcons(filterState.value),
);

/**
 * Subtype
 */

function filterSubtypes(filterState: MultiselectFilter["value"]) {
  const enabledTypeCodes = Object.entries(filterState)
    .filter(([, v]) => !!v)
    .map(([k]) => k);

  if (!enabledTypeCodes.length) return pass;

  return (card: Card) => {
    return !!card.subtype_code && filterState[card.subtype_code];
  };
}

const selectSubtypeFilter = createSelector(
  (state: StoreState) => state.filters[state.filters.cardType].subtype,
  (state) => filterSubtypes(state.value),
);

/**
 * Taboo Set
 */

function filterTabooSet(tabooSetId: number | null) {
  if (!tabooSetId) return undefined;
  return (card: Card) => card.taboo_set_id === tabooSetId;
}

const selectTabooSetFilter = createSelector(
  (state: StoreState) => state.filters.player.tabooSet,
  (filterState) =>
    filterState.value ? filterTabooSet(filterState.value) : undefined,
);

/**
 * Trait
 */

function filterTraits(
  filterState: MultiselectFilter["value"],
  traitTable: LookupTables["traits"],
) {
  const filters: Filter[] = [];

  for (const [key, value] of Object.entries(filterState)) {
    if (value) filters.push((c: Card) => !!traitTable[key][c.code]);
  }

  const filter = or(filters);
  return (card: Card) => filter(card);
}

const selectTraitsFilter = createSelector(
  (state: StoreState) => state.lookupTables.traits,
  (state: StoreState) => state.filters[state.filters.cardType].trait,
  (traitsTable, filterState) => filterTraits(filterState.value, traitsTable),
);

/**
 * Type
 */

function filterType(filterState: MultiselectFilter["value"]) {
  const enabledTypeCodes = Object.entries(filterState)
    .filter(([, v]) => !!v)
    .map(([k]) => k);

  if (!enabledTypeCodes.length) return pass;
  return (card: Card) => filterState[card.type_code];
}

const selectTypeFilter = createSelector(
  (state: StoreState) => state.filters[state.filters.cardType].type,
  (filterState) => filterType(filterState.value),
);

/**
 * Investigator Access
 */

function filterRequired(
  code: string,
  relationsTable: LookupTables["relations"],
) {
  return (card: Card) =>
    !!relationsTable.advanced[code]?.[card.code] ||
    !!relationsTable.requiredCards[code]?.[card.code] ||
    !!relationsTable.parallelCards[code]?.[card.code] ||
    !!relationsTable.replacement[code]?.[card.code];
}

const selectInvestigatorWeaknessFilter = createSelector(
  (state: StoreState) => state.metadata.cards,
  (state: StoreState) => state.lookupTables,
  (state: StoreState) => state.filters.player.investigator.value,
  (metadata, lookupTables, cardCode) => {
    if (!cardCode) return undefined;

    const card = metadata[cardCode];
    if (!card) return undefined;

    // normalize parallel investigators to root for lookups.
    const code = card.alternate_of_code ?? cardCode;

    const ors: Filter[] = [
      filterRequired(code, lookupTables.relations),
      filterSubtypes({ basicweakness: true }),
    ];

    return or(ors);
  },
);

const selectInvestigatorFilter = createSelector(
  (state: StoreState) => state.metadata.cards,
  (state: StoreState) => state.lookupTables,
  (state: StoreState) => state.filters.player.investigator.value,
  (metadata, lookupTables, cardCode) => {
    if (!cardCode) return undefined;

    const card = metadata[cardCode];
    if (!card) return undefined;

    const requirements = card.deck_requirements?.card;
    const options = card.deck_options;

    if (!requirements || !options) {
      throw new TypeError(`${cardCode} is not an investigator.`);
    }

    // normalize parallel investigators to root for lookups.
    const code = card.alternate_of_code ?? cardCode;

    const ors: Filter[] = [filterRequired(code, lookupTables.relations)];

    const ands: Filter[] = [];

    for (const option of options) {
      // unknown rules or duplicate rules.
      if (
        option.deck_size_select ||
        option.tag?.includes("st") ||
        option.tag?.includes("uc")
      ) {
        continue;
      }

      const optionFilter = [];

      let filterCount = 0;

      if (option.not) {
        filterCount += 1;
      }

      if (option.faction) {
        filterCount += 1;
        optionFilter.push(filterFactions(option.faction));
      }

      if (option.faction_select) {
        filterCount += 1;
        optionFilter.push(filterFactions(option.faction_select));
      }

      if (option.level) {
        filterCount += 1;
        optionFilter.push(
          filterCardLevel([option.level.min, option.level.max]),
        );
      }

      if (option.limit) {
        filterCount += 1;
      }

      if (option.trait) {
        filterCount += 1;
        // traits are stored lowercased for whatever reason.
        const traits = option.trait.reduce(
          (acc, curr) => ({
            ...acc,
            [`${capitalize(curr)}`]: true,
          }),
          {},
        );

        optionFilter.push(filterTraits(traits, lookupTables.traits));
      }

      if (option.uses) {
        filterCount += 1;

        const usesFilters: Filter[] = [];

        for (const uses of option.uses) {
          usesFilters.push(filterUses(uses, lookupTables.uses));
        }

        optionFilter.push(or(usesFilters));
      }

      if (option.type) {
        filterCount += 1;

        const types = option.type.reduce(
          (acc, curr) => ({
            ...acc,
            [curr]: true,
          }),
          {},
        );

        optionFilter.push(filterType(types));
      }

      // parallel wendy
      if (option.option_select) {
        const selectFilters: Filter[] = [];

        for (const select of option.option_select) {
          const optionSelectFilters: Filter[] = [];

          if (select.level) {
            optionSelectFilters.push(
              filterCardLevel([select.level.min, select.level.max]),
            );
          }

          if (select.trait) {
            const traits = select.trait.reduce(
              (acc, curr) => ({
                ...acc,
                [`${capitalize(curr)}`]: true,
              }),
              {},
            );

            optionSelectFilters.push(filterTraits(traits, lookupTables.traits));
          }

          selectFilters.push(and(optionSelectFilters));
        }

        filterCount += selectFilters.length;
        optionFilter.push(or(selectFilters));
      }

      // special case: allessandra
      if (option.text && option.text.some((s) => s.includes("Parley"))) {
        filterCount += 1;
        optionFilter.push(
          filterActions({ parley: true }, lookupTables["actions"]),
        );
      }

      // carolyn fern
      if (option.tag?.includes("hh")) {
        filterCount += 1;
        optionFilter.push(
          filterProperties(
            { healsHorror: true } as PropertiesFilter["value"],
            lookupTables,
          ),
        );
      }

      // vincent
      if (option.tag?.includes("hd")) {
        filterCount += 1;
        optionFilter.push(
          filterProperties(
            { healsDamage: true } as PropertiesFilter["value"],
            lookupTables,
          ),
        );
      }

      if (filterCount > 1) {
        const filter = and(optionFilter);

        if (option.not) {
          ands.push(not(filter));
        } else {
          ors.push(filter);
        }
      } else {
        console.debug(`unknown deck requirement`, option);
      }
    }

    return and([or(ors), ...ands]);
  },
);

/**
 * Combined list filters
 */

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
  selectPackCodeFilter,
  selectAssetFilter,
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
    packCodeFilter,
    assetFilter,
  ) => {
    const filters = [
      actionsFilter,
      filterDuplicates,
      filterEncounterCards,
      filterMythosCards,
      filterWeaknesses,
      ownershipFilter,
      packCodeFilter,
      propertiesFilter,
      skillIconsFilter,
      subtypeFilter,
      traitsFilter,
      typeFilter,
      assetFilter,
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
  selectPackCodeFilter,
  selectAssetFilter,
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
    packCodeFilter,
    assetFilter,
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
      packCodeFilter,
      assetFilter,
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
  selectEncounterSetFilter,
  selectPackCodeFilter,
  selectAssetFilter,
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
    encounterSetFilter,
    packCodeFilter,
    assetFilter,
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
      encounterSetFilter,
      packCodeFilter,
      assetFilter,
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
  (state: StoreState) => state.search,
  selectCanonicalTabooSetId,
  selectPlayerCardGroups,
  selectWeaknessGroups,
  selectEncounterSetGroups,
  (
    activeCardType,
    playerCardFilter,
    weaknessFilter,
    encounterFilters,
    metadata,
    lookupTables,
    search,
    tabooSetId,
    playerCardGroups,
    weaknessGroups,
    encounterSetGroups,
  ) => {
    if (!Object.keys(metadata.cards).length) {
      console.warn("player cards selected before store is initialized.");
      return undefined;
    }

    const groups: Grouping[] = [];
    const cards: Card[] = [];
    const groupCounts = [];

    if (activeCardType === "player") {
      console.time("[performance] select_player_cards");

      for (const grouping of playerCardGroups) {
        const groupCards = getGroupCards(
          grouping,
          metadata,
          lookupTables,
          playerCardFilter,
          tabooSetId ? (c) => applyTaboo(c, tabooSetId, metadata) : undefined,
        );

        const filteredCards = applySearch(search, groupCards, metadata);

        if (filteredCards.length) {
          filteredCards.sort(sortAlphabetically(lookupTables));
          groups.push(grouping);
          cards.push(...filteredCards);
          groupCounts.push(filteredCards.length);
        }
      }

      for (const grouping of weaknessGroups) {
        const groupCards = applySearch(
          search,
          getGroupCards(grouping, metadata, lookupTables, weaknessFilter),
          metadata,
        );

        const filteredCards = applySearch(search, groupCards, metadata);

        if (filteredCards.length) {
          groupCards.sort(sortAlphabetically(lookupTables));
          groups.push(grouping);
          cards.push(...filteredCards);
          groupCounts.push(filteredCards.length);
        }
      }

      console.timeEnd("[performance] select_player_cards");
    } else {
      console.time("[performance] select_encounter_cards");

      for (const grouping of encounterSetGroups) {
        const groupCards = getGroupCards(
          grouping,
          metadata,
          lookupTables,
          encounterFilters,
        );

        const filteredCards = applySearch(search, groupCards, metadata);

        if (filteredCards.length) {
          filteredCards.sort(sortByEncounterPosition);
          groups.push(grouping);
          cards.push(...filteredCards);
          groupCounts.push(filteredCards.length);
        }
      }

      console.timeEnd("[performance] select_encounter_cards");
    }

    return {
      key: activeCardType,
      groups,
      cards,
      groupCounts,
    } as ListState;
  },
);
