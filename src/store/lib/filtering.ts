import { cardLevel, splitMultiValue } from "@/utils/card-utils";
import type { SkillKey } from "@/utils/constants";
import { SKILL_KEYS, SPECIAL_CARD_CODES } from "@/utils/constants";
import { capitalize } from "@/utils/formatting";
import type { Filter } from "@/utils/fp";
import { and, not, notUnless, or } from "@/utils/fp";
import { isEmpty } from "@/utils/is-empty";
import type { Card, DeckOption } from "../services/queries.types";
import type {
  AssetFilter,
  CostFilter,
  LevelFilter,
  MultiselectFilter,
  PropertiesFilter,
  SkillIconsFilter,
  SubtypeFilter,
} from "../slices/lists.types";
import type { LookupTables } from "../slices/lookup-tables.types";
import type { Metadata } from "../slices/metadata.types";
import { ownedCardCount } from "./card-ownership";
import type { SealedDeck, Selections } from "./types";
import { isOptionSelect } from "./types";

/**
 * Misc.
 */

export function filterDuplicates(card: Card) {
  return (
    (!card.hidden || card.code === SPECIAL_CARD_CODES.RANDOM_BASIC_WEAKNESS) && // filter hidden cards (usually backsides)
    !card.alt_art_investigator && // filter novellas && parallel investigators
    !card.duplicate_of_code // filter revised_code.
  );
}

export function filterAlternates(card: Card) {
  return filterDuplicates(card) || !!card.parallel;
}

export function filterEncounterCards(card: Card) {
  return !!card.encounter_code; // filter out encounter cards (story player cards).
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
  filterState: MultiselectFilter,
  actionTable: LookupTables["actions"],
) {
  const filters: Filter[] = [];

  for (const key of filterState) {
    filters.push((c: Card) => !!actionTable[key][c.code]);
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

function filterSlots(slot: string) {
  return (card: Card) => !!card.real_slot?.includes(slot);
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

export function filterAssets(value: AssetFilter, lookupTables: LookupTables) {
  const filters: Filter[] = [];

  if (value.health) {
    filters.push(filterHealthProp(value.health, value.healthX, "health"));
  }

  if (value.sanity) {
    filters.push(filterHealthProp(value.sanity, value.healthX, "sanity"));
  }

  if (value.skillBoosts.length) {
    const skillBoostFilters: Filter[] = value.skillBoosts.map((key) =>
      filterSkillBoost(key, lookupTables.skillBoosts),
    );
    filters.push(or(skillBoostFilters));
  }

  if (value.uses.length) {
    const usesFilters: Filter[] = value.uses.map((key) =>
      filterUses(key, lookupTables.uses),
    );
    filters.push(or(usesFilters));
  }

  if (value.slots.length) {
    const slotFilters: Filter[] = value.slots.map(filterSlots);
    filters.push(or(slotFilters));
  }

  return filters.length ? and(filters) : undefined;
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

function filterXCost(card: Card) {
  return card.cost === -2;
}

function filterNoCost(card: Card) {
  return card.cost == null;
}

function filterCardCost(value: [number, number]) {
  return (card: Card) =>
    card.cost != null && card.cost >= value[0] && card.cost <= value[1];
}

export function filterCost(filterState: CostFilter) {
  // apply level range if provided. `0-5` is assumed, null-costed cards are excluded.
  const filters = [];

  if (filterState.range) {
    filters.push(filterCardCost(filterState.range));
  }

  // apply even / odd filters
  const moduloFilters = [];

  if (filterState.even) moduloFilters.push(filterEvenCost);
  if (filterState.odd) moduloFilters.push(filterOddCost);

  filters.push(or(moduloFilters));

  const altCostFilters = [];

  if (filterState.x) altCostFilters.push(filterXCost);
  if (filterState.nocost) altCostFilters.push(filterNoCost);

  const filter = or([...altCostFilters, and(filters)]);

  return (card: Card) => filter(card);
}

/**
 * Encounter Set
 */

export function filterEncounterCode(filterState: MultiselectFilter) {
  const filters: Filter[] = [];

  for (const key of filterState) {
    filters.push((c: Card) => c.encounter_code === key);
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

function filterCardLevel(value: [number, number], checkCustomizable = false) {
  return (card: Card) => {
    const level = cardLevel(card);

    // customizable cards can have any level, always show them when flag set.
    if (!checkCustomizable && card.customization_options) return true;

    return level != null && level >= value[0] && level <= value[1];
  };
}

export function filterLevel(filterState: LevelFilter) {
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
  collection: Record<string, number | boolean>,
  showAllCards: boolean,
) {
  return (
    ownedCardCount(card, metadata, lookupTables, collection, showAllCards) > 0
  );
}

/**
 * Pack Code
 */

export function filterPackCode(
  value: MultiselectFilter,
  metadata: Metadata,
  lookupTables: LookupTables,
) {
  if (isEmpty(value)) return undefined;

  const active = Object.values(value).some((x) => x);
  if (!active) return undefined;

  const filterValue = value.reduce<Record<string, boolean>>((acc, curr) => {
    acc[curr] = true;
    return acc;
  }, {});

  return (card: Card) =>
    filterOwnership(card, metadata, lookupTables, filterValue, false);
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

function filterPermanent(card: Card) {
  return !!card.permanent;
}

function filterSucceedBy(
  succeedByTable: LookupTables["properties"]["succeedBy"],
) {
  return (card: Card) => !!succeedByTable[card.code];
}

function filterTag(tag: string, checkCustomizableOptions: boolean) {
  return (card: Card) => {
    const hasTag = !!card.tags?.includes(tag);

    if (hasTag || !checkCustomizableOptions || !card.customization_options)
      return hasTag;

    return !!card.customization_options?.some((o) => o.tags?.includes(tag));
  };
}

function filterHealsDamage(checkCustomizableOptions: boolean) {
  return filterTag("hd", checkCustomizableOptions);
}

function filterHealsHorror(checkCustomizableOptions: boolean) {
  return filterTag("hh", checkCustomizableOptions);
}

/**
 * Restrictions
 */

function filterRestrictions(card: Card, investigator: Card) {
  if (Array.isArray(card.restrictions?.trait)) {
    const targetTraits = card.restrictions.trait;
    return splitMultiValue(investigator.real_traits).some((t) =>
      targetTraits.includes(t.toLowerCase()),
    );
  }

  return true;
}

export function filterProperties(
  filterState: PropertiesFilter,
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
    filters.push(filterPermanent);
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

  if (filterState.specialist) {
    filters.push((c: Card) => Array.isArray(c.restrictions?.trait));
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

export function filterSkillIcons(filterState: SkillIconsFilter) {
  const iconFilter: Filter[] = [];
  const anyFilter: Filter[] = [];

  const anyValue = filterState.any;

  for (const skill of SKILL_KEYS) {
    const value = filterState[skill];

    if (value) {
      iconFilter.push(filterSkill(skill, value));
    } else if (anyValue) {
      anyFilter.push(filterSkill(skill, anyValue));
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

export function filterSubtypes(filter: SubtypeFilter) {
  return (card: Card) => {
    return (
      (!!card.subtype_code &&
        filter[card.subtype_code as keyof SubtypeFilter]) ||
      (!card.subtype_code && filter["none"])
    );
  };
}

/**
 * Taboo Set
 */

export function filterTabooSet(tabooSetId: number, metadata: Metadata) {
  return (card: Card) => !!metadata.taboos[`${card.code}-${tabooSetId}`];
}

/**
 * Trait
 */

export function filterTraits(
  filterState: MultiselectFilter,
  traitTable: LookupTables["traits"],
  checkCustomizableOptions?: boolean,
) {
  const filters: Filter[] = [];

  for (const key of filterState) {
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

  const filter = or(filters);
  return (card: Card) => filter(card);
}

/**
 * Type
 */

export function filterType(enabledTypeCodes: MultiselectFilter) {
  return (card: Card) => enabledTypeCodes.includes(card.type_code);
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
  additionalDeckOptions?: DeckOption[];
  // Customizable options can alter whether an investigator has access to a card.
  // Example: a card gains a trait, or the option to heal horror.
  //  -> when showing options, we want to show these cards.
  //  -> when validating decks, we only want to consider actually applied options.
  // This works because we apply the current card changes before we pass cards to the filter.
  // NOTE: this currently does not consider the "level" of the customizable option for access
  // because all current cases work. This assumption might break in the future.
  ignoreUnselectedCustomizableOptions?: boolean;
  selections?: Selections;
  targetDeck?: "slots" | "extraSlots" | "both";
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

    const targetKey = option.id ?? "faction_selected";

    const selection = config?.selections?.[targetKey]?.value;

    optionFilter.push(
      typeof selection === "string"
        ? filterFactions([selection])
        : filterFactions(option.faction_select),
    );
  }

  if (option.base_level || option.level) {
    const level = option.base_level ?? option.level;
    if (level) {
      filterCount += 1;
      optionFilter.push(filterCardLevel([level.min, level.max], true));
    }
  }

  if (option.permanent) {
    optionFilter.push(filterPermanent);
    // explicit `false` means "forbidden", absence of `permanent` means "either allowed".
  } else if (option.permanent === false) {
    optionFilter.push(not(filterPermanent));
  }

  if (option.trait) {
    filterCount += 1;

    optionFilter.push(
      filterTraits(
        // traits are stored lowercased for whatever reason.
        option.trait.map(capitalize),
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
    optionFilter.push(filterType(option.type));
  }

  // parallel wendy
  if (option.option_select) {
    const selectFilters: Filter[] = [];

    let selection = config?.selections?.["option_selected"]?.value;
    selection = isOptionSelect(selection) ? selection.id : undefined;

    for (const select of option.option_select) {
      if (selection && select.id !== selection) {
        continue;
      }

      const optionSelectFilters: Filter[] = [];

      if (select.level) {
        optionSelectFilters.push(
          filterCardLevel([select.level.min, select.level.max], true),
        );
      }

      if (select.trait) {
        optionSelectFilters.push(
          filterTraits(select.trait.map(capitalize), lookupTables.traits),
        );
      }

      selectFilters.push(and(optionSelectFilters));
    }

    filterCount += selectFilters.length + 1;
    optionFilter.push(or(selectFilters));
  }

  // TODO: generalize tag based access.

  // special case: allessandra
  if (option.text?.some((s) => s.includes("Parley"))) {
    filterCount += 1;
    optionFilter.push(filterTag("pa", true));
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

  // parallel mateo
  if (option.tag?.includes("se")) {
    filterCount += 1;
    optionFilter.push(filterSeal(lookupTables.properties.seal));
  }

  // on your own
  if (option.slot) {
    filterCount += 1;
    for (const slot of option.slot) {
      optionFilter.push(filterSlots(slot));
    }
  }

  if (filterCount <= 1) {
    console.debug("unknown deck requirement", option);
  }

  return filterCount > 1 ? and(optionFilter) : undefined;
}

export function filterInvestigatorAccess(
  investigator: Card,
  lookupTables: LookupTables,
  config?: InvestigatorAccessConfig,
): Filter | undefined {
  const mode = config?.targetDeck ?? "slots";

  const deckFilter =
    mode !== "extraSlots"
      ? makePlayerCardsFilter(
          investigator,
          lookupTables,
          "deck_options",
          "deck_requirements",
          config,
        )
      : undefined;

  const extraDeckFilter =
    mode !== "slots"
      ? makePlayerCardsFilter(
          investigator,
          lookupTables,
          "side_deck_options",
          "side_deck_requirements",
          config,
        )
      : undefined;

  if (mode !== "extraSlots" && !deckFilter) {
    console.warn(
      `filter is a noop: ${investigator.code} is not an investigator.`,
    );
  }

  if (mode === "slots") return deckFilter;
  if (mode === "extraSlots") return extraDeckFilter;

  const filters = [];

  if (deckFilter) filters.push(deckFilter);
  if (extraDeckFilter) filters.push(extraDeckFilter);
  return or(filters);
}

function makePlayerCardsFilter(
  investigator: Card,
  lookupTables: LookupTables,
  optionsAccessor: "deck_options" | "side_deck_options",
  requiredAccessor: "deck_requirements" | "side_deck_requirements",
  config?: InvestigatorAccessConfig,
) {
  let options = investigator[optionsAccessor];
  const requirements = investigator[requiredAccessor]?.card;

  if (!requirements || !options) {
    return undefined;
  }

  // normalize parallel investigators to root for lookups.
  const code = investigator.alternate_of_code ?? investigator.code;

  // special case: suzi's additional deck options allow any xp card.
  if (code === SPECIAL_CARD_CODES.SUZI) {
    options = [...options];
    options.splice(1, 0, {
      level: { max: 5, min: 0 },
      faction: ["neutral", "guardian", "mystic", "rogue", "seeker", "survivor"],
    });
  }

  const ands: Filter[] = [
    (card: Card) => filterRestrictions(card, investigator),
    not(filterType(["investigator", "location", "story"])),
  ];

  const ors: Filter[] = [];

  if (config?.targetDeck === "extraSlots") {
    ors.push((card: Card) => card.code in requirements);
  } else {
    ors.push(
      filterRequired(code, lookupTables.relations),
      (card: Card) => card.subtype_code === "basicweakness",
      (card: Card) =>
        !!card.encounter_code &&
        !!card.deck_limit &&
        !card.back_link_id &&
        !card.double_sided &&
        card.faction_code !== "mythos",
    );
  }

  const filters: Filter[] = [];

  for (const option of options) {
    const filter = makeOptionFilter(option, lookupTables, config);

    if (!filter) continue;

    if (option.not) {
      // When encountering a NOT, every filter that comes before can be considered an "unless".
      ands.push(filters.length ? notUnless(filter, [...filters]) : not(filter));
    } else {
      filters.push(filter);
    }
  }

  ors.push(...filters);

  if (config?.targetDeck !== "extraSlots" && config?.additionalDeckOptions) {
    for (const option of config.additionalDeckOptions) {
      const filter = makeOptionFilter(option, lookupTables, config);
      if (!filter) continue;

      if (option.not) {
        ands.push(not(filter));
      } else {
        ors.push(filter);
      }
    }
  }

  return and([or(ors), ...ands]);
}

export function filterInvestigatorWeaknessAccess(
  investigator: Card,
  lookupTables: LookupTables,
  config?: Pick<InvestigatorAccessConfig, "targetDeck">,
) {
  // normalize parallel investigators to root for lookups.
  const code = investigator.alternate_of_code ?? investigator.code;

  const ors: Filter[] =
    config?.targetDeck !== "extraSlots"
      ? [
          filterRequired(code, lookupTables.relations),
          filterSubtypes({ basicweakness: true, weakness: false, none: false }),
          (card: Card) => card.xp == null && !card.restrictions,
        ]
      : [(c: Card) => !!investigator.side_deck_requirements?.card?.[c.code]];

  return and([
    filterSubtypes({ basicweakness: true, weakness: true, none: false }),
    not(filterBonded(lookupTables.relations.bonded)),
    or(ors),
  ]);
}

export function filterSealed(
  sealedDeck: SealedDeck["cards"],
  lookupTables: LookupTables,
) {
  return (c: Card) => {
    if (sealedDeck[c.code]) return true;

    const duplicates = lookupTables.relations.duplicates[c.code];
    if (!duplicates) return false;

    return Object.keys(duplicates).some((code) => !!sealedDeck[code]);
  };
}
