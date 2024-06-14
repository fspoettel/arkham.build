import { createSelector } from "reselect";

import type { Card } from "@/store/services/types";
import type { StoreState } from "@/store/slices";
import type { Filter } from "@/utils/fp";
import { and, or, pass } from "@/utils/fp";

import { selectActiveCardType } from "./shared";

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

export const selectFactionFilter = createSelector(
  (state: StoreState) => state.filters[state.filters.cardType].faction,
  (filterState) =>
    filterState.value ? filterFactions(filterState.value) : undefined,
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

export const selectActiveFactions = (state: StoreState) =>
  state.filters[state.filters.cardType].faction;
