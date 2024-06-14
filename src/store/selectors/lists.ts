import { createSelector } from "reselect";

import { ASSET_SLOT_ORDER, FACTION_ORDER, SKILL_KEYS } from "@/utils/constants";
import { capitalize, formatTabooSet } from "@/utils/formatting";

import {
  sortAlphabetical,
  sortByName,
  sortedEncounterSets,
} from "../lib/sorting";
import type { Card, Cycle, Pack } from "../services/queries.types";
import type { StoreState } from "../slices";
import type {
  AssetFilter,
  CostFilter,
  LevelFilter,
  MultiselectFilter,
  PropertiesFilter,
  SelectFilter,
  SkillIconsFilter,
} from "../slices/lists.types";
import { selectActiveDeck } from "./decks";

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
  (state: StoreState, id: number) => id,
  (list, id) => {
    return list ? list.filterValues[id] : undefined;
  },
);

/**
 * Filter options
 */

export const selectActionOptions = createSelector(
  (state: StoreState) => state.lookupTables.actions,
  (actionTable) => {
    const actions = Object.keys(actionTable).map((code) => ({ code }));
    actions.sort((a, b) => sortAlphabetical(a.code, b.code));
    return actions;
  },
);

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

export const selectEncounterSetOptions = createSelector(
  (state: StoreState) => state.metadata,
  (metadata) => sortedEncounterSets(metadata),
);

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
      (a, b) => FACTION_ORDER.indexOf(a.code) - FACTION_ORDER.indexOf(b.code),
    );

    return factions;
  },
);

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

    investigators.sort(sortByName);
    return investigators;
  },
);

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

export const selectSubtypeOptions = createSelector(
  (state: StoreState) => state.metadata,
  (metadata) => {
    const types = Object.values(metadata.subtypes);
    types.sort((a, b) => sortAlphabetical(a.name, b.name));
    return types;
  },
);

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

export const selectTraitOptions = createSelector(
  selectActiveList,
  (state: StoreState) => state.lookupTables.traitsByCardTypeSelection,
  (activeList, traitTable) => {
    if (!activeList) return [];
    const types = Object.keys(traitTable[activeList.cardType]).map((code) => ({
      code,
    }));
    types.sort((a, b) => sortAlphabetical(a.code, b.code));
    return types;
  },
);

export const selectTypeOptions = createSelector(
  selectActiveList,
  (state: StoreState) => state.metadata.types,
  (state: StoreState) => state.lookupTables,
  (activeList, typeTable, lookupTables) => {
    if (!activeList) return [];

    const types = Object.keys(
      lookupTables.typesByCardTypeSelection[activeList.cardType],
    ).map((type) => typeTable[type]);
    types.sort((a, b) => sortAlphabetical(a.name, b.name));
    return types;
  },
);

/**
 * Filter changes
 */

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

export const selectCostChanges = (value: CostFilter) => {
  if (!value.range) return "";

  let s = `${value.range[0]}`;
  if (value.range[1] !== value.range[0]) s = `${s}-${value.range[1]}`;
  if (value.even) s = `${s}, even`;
  if (value.odd) s = `${s}, odd`;
  if (value.x) s = `${s}, X`;

  return s;
};

export const selectEncounterSetChanges = createSelector(
  (_: StoreState, value: MultiselectFilter) => value,
  (state: StoreState) => state.metadata,
  (value, metadata) => {
    return value.map((id) => metadata.encounterSets[id].name).join(" or ");
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

export const selectLevelChanges = (value: LevelFilter) => {
  if (!value.range) return undefined;
  let s = `${value.range[0]}`;
  if (value.range[1] !== value.range[0]) s = `${s}-${value.range[1]}`;
  if (value.exceptional) s = `${s}, exceptional`;
  if (value.nonexceptional) s = `${s}, nonexceptional`;
  return s;
};

export const selectMultiselectChanges = (value: MultiselectFilter) => {
  if (!value) return "";
  return value.map(capitalize).join(" or ");
};

export const selectPropertiesChanges = (value: PropertiesFilter) => {
  return Object.entries(value).reduce((acc, [key, filterValue]) => {
    if (!filterValue) return acc;
    return !acc ? capitalize(key) : `${acc} and ${capitalize(key)}`;
  }, "");
};

export const selectPackChanges = createSelector(
  (_: StoreState, value: MultiselectFilter) => value,
  (state: StoreState) => state.metadata,
  (value, metadata) => {
    if (!value) return "";
    return value.map((id) => metadata.packs[id].real_name).join(" or ");
  },
);

export const selectSkillIconsChanges = (value: SkillIconsFilter) => {
  return Object.entries(value).reduce((acc, [key, val]) => {
    if (!val) return acc;
    const s = `${val}+ ${capitalize(key)}`;
    return acc ? `${acc} and ${s}` : s;
  }, "");
};

export const selectSubtypeChanges = createSelector(
  (_: StoreState, value: MultiselectFilter) => value,
  (state: StoreState) => state.metadata,
  (value, metadata) => {
    if (!value) return "";
    return value.map((id) => metadata.subtypes[id].name).join(" or ");
  },
);

export const selectTabooSetChanges = createSelector(
  (_: StoreState, value: SelectFilter) => value,
  (state: StoreState) => state.metadata,
  (value, metadata) => {
    if (!value) return "";
    const set = metadata.tabooSets[value];
    return set ? formatTabooSet(set) : value.toString();
  },
);

export const selectCanonicalTabooSetId = (state: StoreState) => {
  const filters = selectActiveListFilters(state);
  const filterId = filters.findIndex((f) => f === "tabooSet");

  const filterValue = filterId
    ? selectActiveListFilter(state, filterId)
    : undefined;
  if (typeof filterValue === "number") return filterValue;

  const activeDeck = selectActiveDeck(state);
  if (activeDeck) return activeDeck.taboo_id;

  return state.settings.tabooSetId;
};

/**
 * Search
 */

export const selectActiveListSearch = createSelector(
  selectActiveList,
  (list) => list?.search,
);
