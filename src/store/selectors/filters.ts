import { createSelector } from "reselect";

import { SubType, Type } from "../graphql/types";
import { StoreState } from "../slices";

export function selectCostMinMax(state: StoreState) {
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
}

export const selectActiveCardType = (state: StoreState) =>
  state.filters.cardType;

export const selectTypes = createSelector(
  selectActiveCardType,
  (state: StoreState) => state.metadata.types,
  (state: StoreState) => state.lookupTables,
  (cardType, typesMap, lookupTables) => {
    const types = Object.keys(
      lookupTables.typesByCardTypeSelection[cardType],
    ).map((type) => typesMap[type]);
    types.sort((a, b) => a.name.localeCompare(b.name));
    return types;
  },
);

export const selectSubtypes = createSelector(
  (state: StoreState) => state.metadata,
  (metadata) => {
    const types = Object.values(metadata.subtypes);
    types.sort((a, b) => a.name.localeCompare(b.name));
    return types;
  },
);

const FACTION_SORT = [
  "seeker",
  "guardian",
  "rogue",
  "mystic",
  "survivor",
  "multiclass",
  "mythos",
  "neutral",
];

export const selectFactions = createSelector(
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

export const selectTraits = createSelector(
  selectActiveCardType,
  (state: StoreState) => state.lookupTables.traitsByCardTypeSeletion,
  (cardType, traitMap) => {
    const types = Object.keys(traitMap[cardType]).map((code) => ({ code }));
    types.sort((a, b) => a.code.localeCompare(b.code));
    return types;
  },
);

export const selectActions = createSelector(
  (state: StoreState) => state.lookupTables.actions,
  (actionMap) => {
    const actions = Object.keys(actionMap).map((code) => ({ code }));
    actions.sort((a, b) => a.code.localeCompare(b.code));
    return actions;
  },
);

export const selectActiveFactions = (state: StoreState) =>
  state.filters[state.filters.cardType].faction;

export const selectActiveCost = (state: StoreState) =>
  state.filters[state.filters.cardType].cost;

export const selectActiveLevel = (state: StoreState) =>
  state.filters.player.level;

export const selectActiveSkillIcons = (state: StoreState) =>
  state.filters[state.filters.cardType].skillIcons;

export const selectActiveSubtypes = createSelector(
  (state: StoreState) => state.metadata.subtypes,
  (state: StoreState) => state.filters[state.filters.cardType].subtype,
  (metadata, filters) =>
    Object.fromEntries(
      Object.entries(filters).reduce(
        (acc, [key, val]) => {
          if (val) acc.push([key, metadata[key]]);
          return acc;
        },
        [] as [string, SubType][],
      ),
    ),
);

export const selectActiveTypes = createSelector(
  (state: StoreState) => state.metadata.types,
  (state: StoreState) => state.filters[state.filters.cardType].type,
  (metadata, filters) =>
    Object.fromEntries(
      Object.entries(filters).reduce(
        (acc, [key, val]) => {
          if (val) acc.push([key, metadata[key]]);
          return acc;
        },
        [] as [string, Type][],
      ),
    ),
);

export const selectActiveTraits = createSelector(
  (state: StoreState) => state.filters[state.filters.cardType].trait,
  (filters) =>
    Object.fromEntries(
      Object.entries(filters).reduce(
        (acc, [key, val]) => {
          if (val) acc.push([key, { code: key }]);
          return acc;
        },
        [] as [string, { code: string }][],
      ),
    ),
);

export const selectActiveActions = createSelector(
  (state: StoreState) => state.filters[state.filters.cardType].action,
  (filters) =>
    Object.fromEntries(
      Object.entries(filters).reduce(
        (acc, [key, val]) => {
          if (val) acc.push([key, { code: key }]);
          return acc;
        },
        [] as [string, { code: string }][],
      ),
    ),
);

export const selectActiveProperties = (state: StoreState) =>
  state.filters[state.filters.cardType].properties;
