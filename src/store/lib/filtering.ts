import { capitalize } from "@/utils/capitalize";
import { cardLevel } from "@/utils/card-utils";
import type { SkillKey } from "@/utils/constants";
import { SKILL_KEYS } from "@/utils/constants";
import type { Filter } from "@/utils/fp";
import { and, not, or, pass } from "@/utils/fp";

import type { Card, DeckOption } from "../services/types";
import type {
  AssetFilter,
  CostFilter,
  LevelFilter,
  MultiselectFilter,
  PropertiesFilter,
  SkillIconsFilter,
} from "../slices/filters/types";
import type { LookupTables } from "../slices/lookup-tables/types";
import type { Metadata } from "../slices/metadata/types";

/**
 * Misc.
 */

export function filterWeaknesses(card: Card) {
  return !card.subtype_code;
}

export function filterDuplicates(card: Card) {
  return (
    !card.hidden && // filter hidden cards (usually backsides)
    !card.alt_art_investigator && // filter novellas && parallel investigators
    !card.duplicate_of_code // filter revised_code.
  );
}

export function filterEncounterCards(card: Card) {
  return !card.encounter_code; // filter out encounter cards (story player cards).
}

// needs to filter out some bad data that would otherwise end up in player cards (i.e. 04325).
export function filterMythosCards(card: Card) {
  return card.faction_code !== "mythos";
}

export function filterBacksides(card: Card) {
  return !card.linked;
}

/**
 * Actions
 */

export function filterActions(
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

// FIXME: consider customizable options.
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

export function filterAssets(
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

export function filterCost(filterState: CostFilter["value"]) {
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

/**
 * Encounter Set
 */

export function filterEncounterCode(filterState: MultiselectFilter["value"]) {
  const filters: Filter[] = [];

  for (const [key, value] of Object.entries(filterState)) {
    if (value) filters.push((c: Card) => c.encounter_code === key);
  }

  const filter = or(filters);
  return (card: Card) => filter(card);
}

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

export function filterFactions(factions: string[]) {
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
    const level = cardLevel(card);
    return level != null && level >= value[0] && level <= value[1];
  };
}

export function filterLevel(filterState: LevelFilter["value"]) {
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

/**
 * Ownership
 */

export function filterOwnership(
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

function filterTag(tag: string, checkCustomizableOptions: boolean) {
  return (card: Card) => {
    const healsDamage = !!card.tags?.includes(tag);

    if (healsDamage || !checkCustomizableOptions || !card.customization_options)
      return healsDamage;

    return !!card.customization_options?.some((o) => o.tags?.includes("hd"));
  };
}

function filterHealsDamage(checkCustomizableOptions: boolean) {
  return filterTag("hd", checkCustomizableOptions);
}

function filterHealsHorror(checkCustomizableOptions: boolean) {
  return filterTag("hh", checkCustomizableOptions);
}

export function filterProperties(
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
    filters.push(filterHealsDamage(true));
  }

  if (filterState.healsHorror) {
    filters.push(filterHealsHorror(true));
  }

  if (filterState.succeedBy) {
    filters.push(filterSucceedBy(lookupTables.properties.succeedBy));
  }

  const filter = and(filters);

  return (card: Card) => {
    return filter(card);
  };
}

/**
 * Skill Icons
 */

function filterSkill(skill: SkillKey, amount: number) {
  return (card: Card) =>
    card.type_code !== "investigator" &&
    (card[`skill_${skill}`] ?? 0) >= amount;
}

export function filterSkillIcons(filterState: SkillIconsFilter["value"]) {
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

/**
 * Subtype
 */

export function filterSubtypes(filterState: MultiselectFilter["value"]) {
  const enabledTypeCodes = Object.entries(filterState)
    .filter(([, v]) => !!v)
    .map(([k]) => k);

  if (!enabledTypeCodes.length) return pass;

  return (card: Card) => {
    return !!card.subtype_code && filterState[card.subtype_code];
  };
}

/**
 * Taboo Set
 */

export function filterTabooSet(tabooSetId: number | null) {
  if (!tabooSetId) return undefined;
  return (card: Card) => card.taboo_set_id === tabooSetId;
}

/**
 * Trait
 */

export function filterTraits(
  filterState: MultiselectFilter["value"],
  traitTable: LookupTables["traits"],
  checkCustomizableOptions?: boolean,
) {
  const filters: Filter[] = [];

  for (const [key, value] of Object.entries(filterState)) {
    if (value) {
      filters.push((card: Card) => {
        const hasTrait = !!traitTable[key][card.code];

        if (
          hasTrait ||
          !card.customization_options ||
          !checkCustomizableOptions
        ) {
          return hasTrait;
        }

        return !!card.customization_options?.some((o) =>
          o.real_traits?.includes(key),
        );
      });
    }
  }

  const filter = or(filters);
  return (card: Card) => filter(card);
}

/**
 * Type
 */

export function filterType(filterState: MultiselectFilter["value"]) {
  const enabledTypeCodes = Object.entries(filterState)
    .filter(([, v]) => !!v)
    .map(([k]) => k);

  if (!enabledTypeCodes.length) return pass;
  return (card: Card) => filterState[card.type_code];
}

/**
 * Investigator access
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

export type InvestigatorAccessConfig = {
  // Customizable options can alter whether an investigator has access to a card.
  // Example: a card gains a trait, or the option to heal horror.
  //  -> when showing options, we want to show these cards.
  //  -> when validating decks, we only want to consider actually applied options.
  // This works because we apply the current card changes before we pass cards to the filter.
  // NOTE: this currently does not consider the "level" of the customizable option for access
  // because all current cases work. This assumption might break in the future.
  ignoreUnselectedCustomizableOptions?: boolean;
  optionSelected?: string;
  factionSelected?: string;
  // special case: charlie kane.
  faction1?: string;
  faction2?: string;
  additionalDeckOptions?: DeckOption[];
};

export function makeOptionFilter(
  option: DeckOption,
  lookupTables: LookupTables,
  config?: InvestigatorAccessConfig,
) {
  // unknown rules or duplicate rules.
  if (
    option.deck_size_select ||
    option.tag?.includes("st") ||
    option.tag?.includes("uc")
  ) {
    return undefined;
  }

  const optionFilter = [];

  let filterCount = 0;

  if (option.not) {
    filterCount += 1;
  }

  if (option.limit) {
    filterCount += 1;
  }

  if (option.faction) {
    filterCount += 1;
    optionFilter.push(filterFactions(option.faction));
  }

  if (option.faction_select) {
    filterCount += 1;

    // special case: charlie kane.
    let targetKey: keyof InvestigatorAccessConfig = "factionSelected";
    if (option.id === "faction_1") {
      targetKey = "faction1";
    } else if (option.id === "faction_2") {
      targetKey = "faction2";
    }

    optionFilter.push(
      config && targetKey in config
        ? filterFactions([config[targetKey] as string])
        : filterFactions(option.faction_select),
    );
  }

  if (option.base_level || option.level) {
    const level = option.base_level ?? option.level;
    if (level) {
      filterCount += 1;
      optionFilter.push(filterCardLevel([level.min, level.max]));
    }
  }

  if (option.permanent) {
    optionFilter.push(filterPermanent(lookupTables.slots));
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

    optionFilter.push(
      filterTraits(
        traits,
        lookupTables.traits,
        !config?.ignoreUnselectedCustomizableOptions,
      ),
    );
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
      if (config?.optionSelected && select.id !== config.optionSelected) {
        continue;
      }

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

    filterCount += selectFilters.length + 1;
    optionFilter.push(or(selectFilters));
  }

  // special case: allessandra
  if (option.text && option.text.some((s) => s.includes("Parley"))) {
    filterCount += 1;
    optionFilter.push(filterActions({ parley: true }, lookupTables["actions"]));
  }

  // carolyn fern
  if (option.tag?.includes("hh")) {
    filterCount += 1;
    optionFilter.push(
      filterHealsHorror(!config?.ignoreUnselectedCustomizableOptions),
    );
  }

  // vincent
  if (option.tag?.includes("hd")) {
    filterCount += 1;
    optionFilter.push(
      filterHealsDamage(!config?.ignoreUnselectedCustomizableOptions),
    );
  }

  // on your own
  if (option.slot) {
    filterCount += 1;
    for (const slot of option.slot) {
      optionFilter.push(filterSlots(slot, lookupTables.slots));
    }
  }

  if (filterCount <= 1) {
    console.debug(`unknown deck requirement`, option);
  }

  return filterCount > 1 ? and(optionFilter) : undefined;
}

export function filterInvestigatorAccess(
  investigator: Card,
  lookupTables: LookupTables,
  config?: InvestigatorAccessConfig,
) {
  const requirements = investigator.deck_requirements?.card;

  const options = config?.additionalDeckOptions
    ? investigator.deck_options?.concat(config.additionalDeckOptions)
    : investigator.deck_options;

  if (!requirements || !options) {
    throw new TypeError(`${investigator.code} is not an investigator.`);
  }

  // normalize parallel investigators to root for lookups.
  const code = investigator.alternate_of_code ?? investigator.code;

  const ors: Filter[] = [filterRequired(code, lookupTables.relations)];
  const ands: Filter[] = [];

  for (const option of options) {
    const filter = makeOptionFilter(option, lookupTables, config);
    if (!filter) continue;

    if (option.not) {
      ands.push(not(filter));
    } else {
      ors.push(filter);
    }
  }

  return and([or(ors), ...ands]);
}

export function filterInvestigatorWeaknessAccess(
  card: Card,
  lookupTables: LookupTables,
) {
  // normalize parallel investigators to root for lookups.
  const code = card.alternate_of_code ?? card.code;

  const ors: Filter[] = [
    filterRequired(code, lookupTables.relations),
    filterSubtypes({ basicweakness: true }),
  ];

  return or(ors);
}
