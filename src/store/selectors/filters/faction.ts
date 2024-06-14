import { createSelector } from "reselect";

import { Card } from "@/store/graphql/types";
import { StoreState } from "@/store/slices";

import { selectActiveCardType } from "./shared";

export function filterFactions(factions: string[]) {
  return (card: Card) => {
    if (!factions.length) return true;

    if (factions.length === 1 && factions[0] === "multiclass") {
      return !!card.faction2_code;
    }

    return (
      factions.includes(card.faction_code) ||
      (!!card.faction2_code && factions.includes(card.faction2_code)) ||
      (!!card.faction3_code && factions.includes(card.faction3_code))
    );
  };
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
