import { createSelector } from "reselect";
import { resolveCardWithRelations } from "../lib/resolve-card";
import type { ResolvedDeck } from "../lib/types";
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
