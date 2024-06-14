import { createSelector } from "reselect";
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

export const selectActiveFactions = createSelector(
  (state: StoreState) => state.filters[state.filters.cardType],
  (filterState) => filterState.faction,
);

export const selectActiveCost = createSelector(
  (state: StoreState) => state.filters[state.filters.cardType],
  (filterState) => filterState.cost,
);

export const selectActiveLevel = (state: StoreState) =>
  state.filters.player.level;

export const selectActiveSkillIcons = createSelector(
  (state: StoreState) => state.filters[state.filters.cardType],
  (filterState) => filterState.skillIcons,
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
