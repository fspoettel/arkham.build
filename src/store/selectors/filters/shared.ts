import { Card } from "@/store/graphql/types";
import { StoreState } from "@/store/slices";

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

export const selectActiveCardType = (state: StoreState) =>
  state.filters.cardType;
