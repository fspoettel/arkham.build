import { createSelector } from "reselect";

import { sortedEncounterSets } from "@/store/lib/sorting";
import type { Card, Coded, Cycle, Pack } from "@/store/services/types";
import type { StoreState } from "@/store/slices";
import type {
  CardTypeFilter,
  FilterObject,
  Filters,
} from "@/store/slices/filters/types";
import { ASSET_SLOT_ORDER, SKILL_KEYS } from "@/utils/constants";
import { capitalize, formatTabooSet } from "@/utils/formatting";

import type { Metadata } from "../slices/metadata/types";
import { selectActiveDeck } from "./decks";

/**
 * Shared
 */

export const selectActiveCardType = (state: StoreState) =>
  state.filters.cardType;

export function selectFilterOpen<C extends CardTypeFilter>(
  cardType: C,
  path: keyof Filters[C],
) {
  return (state: StoreState) => {
    const filter = state.filters[cardType][path] as FilterObject<unknown>;
    return filter.open;
  };
}

function defaultResolver<T extends Coded>(key: string): T {
  return { code: key } as T;
}

export function makeMultiselectValueSelector<T extends Coded>(
  inputSelector: (state: StoreState) => Record<string, boolean>,
  resolver: (key: string, metadata: Metadata) => T = defaultResolver,
) {
  return createSelector(
    inputSelector,
    (state: StoreState) => state.metadata,
    (filters, metadata) =>
      Object.fromEntries(
        Object.entries(filters).reduce<[string, { code: string }][]>(
          (acc, [key, val]) => {
            if (val) acc.push([key, resolver(key, metadata)]);
            return acc;
          },
          [],
        ),
      ) as Record<string, T>,
  );
}

/**
 * Action
 */

export const selectActionOptions = createSelector(
  (state: StoreState) => state.lookupTables.actions,
  (actionTable) => {
    const actions = Object.keys(actionTable).map((code) => ({ code }));
    actions.sort((a, b) => a.code.localeCompare(b.code));
    return actions;
  },
);

export const selectActionValue = (state: StoreState) =>
  state.filters[state.filters.cardType].action.value;

export const selectActionChanges = (state: StoreState) => {
  const val = selectActionValue(state);
  return val.map(capitalize).join(" or ");
};

/**
 * Asset
 */

export const selectAssetOptions = createSelector(
  (state: StoreState) => state.lookupTables,
  (lookupTables) => {
    const health = Object.keys(lookupTables.health).map((x) => +x);
    const sanity = Object.keys(lookupTables.sanity).map((x) => +x);
    const uses = Object.keys(lookupTables.uses).map((code) => ({ code }));
    const skillBoosts = SKILL_KEYS.filter((x) => x !== "wild");

    health.sort();
    sanity.sort();
    uses.sort();

    return {
      health: { min: Math.max(health[0], 0), max: health[health.length - 1] },
      sanity: { min: Math.max(sanity[0], 0), max: sanity[sanity.length - 1] },
      uses,
      slots: ASSET_SLOT_ORDER.map((code) => ({ code })),
      skillBoosts,
    };
  },
);

export const selectAssetUsesValue = (state: StoreState) =>
  state.filters[state.filters.cardType].asset.value.uses;

export const selectAssetSlotValue = (state: StoreState) =>
  state.filters[state.filters.cardType].asset.value.slots;

export const selectAssetHealthValue = (state: StoreState) =>
  state.filters[state.filters.cardType].asset.value.health;

export const selectAssetHealthXValue = (state: StoreState) =>
  state.filters[state.filters.cardType].asset.value.healthX;

export const selectAssetSanityValue = (state: StoreState) =>
  state.filters[state.filters.cardType].asset.value.sanity;

export const selectAssetSkillBoostsValue = (state: StoreState) =>
  state.filters[state.filters.cardType].asset.value.skillBoosts;

export const selectAssetChanges = (state: StoreState) => {
  const filterState = state.filters[state.filters.cardType].asset.value;

  const slot = filterState.slots.reduce((acc, key) => {
    return !acc ? `Slot: ${capitalize(key)}` : `${acc} or ${key}`;
  }, "");

  const uses = filterState.uses.reduce((acc, key) => {
    return !acc ? `Uses: ${capitalize(key)}` : `${acc} or ${key}`;
  }, "");

  const skillBoosts = filterState.skillBoosts.reduce((acc, key) => {
    return !acc
      ? `Skill boost: ${capitalize(key)}`
      : `${acc} or ${capitalize(key)}`;
  }, "");

  let healthFilter = "";

  if (filterState.health) {
    let s = `${filterState.health[0]}`;
    if (filterState.health[1] !== filterState.health[0]) {
      s = `${s}-${filterState.health[1]}`;
    }
    healthFilter = `Health: ${s}`;
  }

  let sanityFilter = "";

  if (filterState.sanity) {
    let s = `${filterState.sanity[0]}`;

    if (filterState.sanity[1] !== filterState.sanity[0]) {
      s = `${s}-${filterState.sanity[1]}`;
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

export const selectCostMinMax = (state: StoreState) => {
  const costs = Object.keys(state.lookupTables.cost).map((x) =>
    Number.parseInt(x, 10),
  );

  if (costs.length < 2) {
    throw new TypeError(
      "selector {selectCostMinMax} expects store to contain metadata.",
    );
  }

  costs.sort((a, b) => a - b);

  const min = 0; // arkhamdb data has some cards set to negative values.
  const max = costs[costs.length - 1];
  return [min, max];
};

export const selectCostValue = (state: StoreState) =>
  state.filters[state.filters.cardType].cost.value;

export const selectCostChanges = (state: StoreState) => {
  const val = selectCostValue(state);
  if (!val.range) return "";

  let s = `${val.range[0]}`;
  if (val.range[1] !== val.range[0]) s = `${s}-${val.range[1]}`;
  if (val.even) s = `${s}, even`;
  if (val.odd) s = `${s}, odd`;
  if (val.x) s = `${s}, X`;

  return s;
};

/**
 * Encounter Set
 */

export const selectEncounterSetOptions = createSelector(
  (state: StoreState) => state.metadata,
  (metadata) => sortedEncounterSets(metadata),
);

export const selectEncounterSetValue = (state: StoreState) =>
  state.filters.encounter.encounterSet.value;

export const selectEncounterSetChanges = (state: StoreState) => {
  const val = selectEncounterSetValue(state);
  return val.map((id) => state.metadata.encounterSets[id].name).join(" or ");
};

/**
 * Faction
 */

const FACTION_SORT = [
  "guardian",
  "seeker",
  "rogue",
  "mystic",
  "survivor",
  "multiclass",
  "neutral",
  "mythos",
];

export const selectFactionOptions = createSelector(
  selectActiveCardType,
  (state: StoreState) => state.metadata.factions,
  (cardType, factionMeta) => {
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
      (a, b) => FACTION_SORT.indexOf(a.code) - FACTION_SORT.indexOf(b.code),
    );

    return factions;
  },
);

export const selectFactionValue = (state: StoreState) =>
  state.filters[state.filters.cardType].faction.value;

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
          !card.encounter_code &&
          (!card.alt_art_investigator || card.parallel)
        ) {
          acc.push(card);
        }

        return acc;
      },
      [],
    );

    investigators.sort((a, b) => a.real_name.localeCompare(b.real_name));

    return investigators;
  },
);

export const selectInvestigatorValue = (state: StoreState) =>
  state.filters.player.investigator.value;

export const selectInvestigatorChanges = (state: StoreState) => {
  const val = selectInvestigatorValue(state);
  if (!val) return "";

  const card = state.metadata.cards[val];
  return `${card.real_name}${card.parallel ? " (Parallel)" : ""}`;
};

/**
 * Level
 */

export const selectLevelValue = (state: StoreState) =>
  state.filters.player.level.value;

export const selectLevelChanges = (state: StoreState) => {
  const val = selectLevelValue(state);

  if (!val.range) return undefined;
  let s = `${val.range[0]}`;
  if (val.range[1] !== val.range[0]) s = `${s}-${val.range[1]}`;
  if (val.exceptional) s = `${s}, exceptional`;
  if (val.nonexceptional) s = `${s}, nonexceptional`;
  return s;
};

/**
 * Ownership
 */

export const selectOwnershipValue = (state: StoreState) =>
  state.filters[state.filters.cardType].ownership.value;

/**
 * Pack
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

const filterNewFormat = (packs: Pack[], cardType: CardTypeFilter) => {
  return packs.filter((pack) =>
    cardType === "encounter"
      ? pack.code.endsWith("c")
      : pack.code.endsWith("p"),
  );
};

export const selectPackOptions = createSelector(
  selectCyclesAndPacks,
  selectActiveCardType,
  (cycles, cardType) => {
    return cycles.flatMap((cycle) => {
      if (cycle.reprintPacks.length && cycle.code !== "core") {
        return filterNewFormat(cycle.reprintPacks, cardType);
      }

      return cycle.packs.length === 2
        ? filterNewFormat(cycle.packs, cardType)
        : [...cycle.reprintPacks, ...cycle.packs];
    });
  },
);

export const selectPackValue = (state: StoreState) =>
  state.filters[state.filters.cardType].packCode.value;

export const selectPackChanges = (state: StoreState) => {
  const val = selectPackValue(state);
  return val.map((id) => state.metadata.packs[id].real_name).join(" or ");
};

/**
 * Properties
 */

export const selectPropertiesValue = (state: StoreState) =>
  state.filters[state.filters.cardType].properties.value;

export const selectPropertiesChanges = (state: StoreState) => {
  const val = selectPropertiesValue(state);

  return Object.entries(val).reduce((acc, [key, filterValue]) => {
    if (!filterValue) return acc;
    return !acc ? capitalize(key) : `${acc} and ${capitalize(key)}`;
  }, "");
};

/**
 * Skill Icons
 */

export const selectSkillIconsValue = (state: StoreState) =>
  state.filters[state.filters.cardType].skillIcons.value;

export const selectSkillIconsChanges = (state: StoreState) => {
  const value = selectSkillIconsValue(state);

  return Object.entries(value).reduce((acc, [key, val]) => {
    if (!val) return acc;
    const s = `${val}+ ${capitalize(key)}`;
    return acc ? `${acc} and ${s}` : s;
  }, "");
};

/**
 * Subtype
 */

export const selectSubtypeOptions = createSelector(
  (state: StoreState) => state.metadata,
  (metadata) => {
    const types = Object.values(metadata.subtypes);
    types.sort((a, b) => a.name.localeCompare(b.name));
    return types;
  },
);

export const selectSubtypeValue = (state: StoreState) =>
  state.filters[state.filters.cardType].subtype.value;

export const selectSubtypeChanges = (state: StoreState) => {
  const val = selectSubtypeValue(state);
  const metadata = state.metadata;
  return val.map((id) => metadata.subtypes[id].name).join(" or ");
};

/**
 * Taboo Set
 */

export const selectCanonicalTabooSetId = (state: StoreState) => {
  const filterValue = selectTabooSetValue(state);
  if (filterValue) return filterValue;

  const activeDeck = selectActiveDeck(state);
  if (activeDeck) return activeDeck.taboo_id;

  return state.settings.tabooSetId;
};

export const selectTabooSetOptions = (state: StoreState) => {
  const sets = Object.values(state.metadata.tabooSets);
  sets.sort((a, b) => b.date.localeCompare(a.date));
  return sets;
};

export const selectTabooSetSelectOptions = (state: StoreState) => {
  const sets = Object.values(state.metadata.tabooSets);
  sets.sort((a, b) => b.date.localeCompare(a.date));
  return sets.map((s) => ({
    label: formatTabooSet(s),
    value: s.id,
  }));
};

export const selectTabooSetValue = (state: StoreState) => {
  return state.filters.player.tabooSet.value;
};

export const selectTabooSetChanges = (state: StoreState) => {
  const val = selectTabooSetValue(state);
  return val ? state.metadata.tabooSets[val].name : "";
};

/**
 * Trait
 */

export const selectTraitOptions = createSelector(
  (state: StoreState) => state.filters.cardType,
  (state: StoreState) => state.lookupTables.traitsByCardTypeSelection,
  (cardType, traitTable) => {
    const types = Object.keys(traitTable[cardType]).map((code) => ({ code }));
    types.sort((a, b) => a.code.localeCompare(b.code));
    return types;
  },
);

export const selectTraitValue = (state: StoreState) =>
  state.filters[state.filters.cardType].trait.value;

export const selectTraitChanges = (state: StoreState) => {
  const val = selectTraitValue(state);
  return val.map(capitalize).join(" or ");
};

/**
 * Type
 */

export const selectTypeOptions = createSelector(
  (state: StoreState) => state.filters.cardType,
  (state: StoreState) => state.metadata.types,
  (state: StoreState) => state.lookupTables,
  (cardType, typeTable, lookupTables) => {
    const types = Object.keys(
      lookupTables.typesByCardTypeSelection[cardType],
    ).map((type) => typeTable[type]);
    types.sort((a, b) => a.name.localeCompare(b.name));
    return types;
  },
);

export const selectTypeValue = (state: StoreState) =>
  state.filters[state.filters.cardType].type.value;

export const selectTypeChanges = (state: StoreState) => {
  const val = selectTypeValue(state);
  return val.map(capitalize).join(" or ");
};
