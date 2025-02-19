import { not, or } from "@/utils/fp";
import { createSelector } from "reselect";
import {
  filterAlternates,
  filterEncounterCards,
  filterInvestigatorAccess,
  filterInvestigatorWeaknessAccess,
} from "../lib/filtering";
import { resolveCardWithRelations } from "../lib/resolve-card";
import { makeSortFunction } from "../lib/sorting";
import type { ResolvedDeck } from "../lib/types";
import type { Card } from "../services/queries.types";
import type { StoreState } from "../slices";
import { selectCanonicalTabooSetId } from "./lists";

export const selectCardWithRelations = createSelector(
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.lookupTables,
  (_: StoreState, code: string) => code,
  (_: StoreState, __: string, withRelations: boolean) => withRelations,
  (_: StoreState, __: string, ___, resolvedDeck: ResolvedDeck) => resolvedDeck,
  (
    state: StoreState,
    __: string,
    ___,
    resolvedDeck: ResolvedDeck | undefined,
  ) => selectCanonicalTabooSetId(state, resolvedDeck),
  (
    metadata,
    lookupTables,
    code,
    withRelations,
    resolvedDeck,
    canonicalTabooSetId,
  ) =>
    resolveCardWithRelations(
      metadata,
      lookupTables,
      code,
      canonicalTabooSetId,
      resolvedDeck?.customizations,
      withRelations,
    ),
);

export const selectUsableByInvestigators = createSelector(
  (state: StoreState) => state.lookupTables,
  (state: StoreState) => state.metadata,
  (_: StoreState, card: Card) => card,
  (lookupTables, metadata, card) => {
    const investigatorCodes = Object.keys(
      lookupTables.typeCode["investigator"],
    );

    const cards = investigatorCodes
      .map((code) => metadata.cards[code])
      .filter((investigator) => {
        const isValidInvestigator =
          not(filterEncounterCards)(investigator) &&
          filterAlternates(investigator);

        if (!isValidInvestigator) return false;

        const access = filterInvestigatorAccess(investigator);
        if (!access) return false;

        const weaknessAccess = filterInvestigatorWeaknessAccess(investigator);

        return or([access, weaknessAccess])(card);
      });

    const sorting = makeSortFunction(["name", "cycle"], metadata);

    return cards.sort(sorting);
  },
);
