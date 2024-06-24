import { resolveCardWithRelations } from "../lib/resolve-card";
import type { CardWithRelations, ResolvedCard } from "../lib/types";
import type { StoreState } from "../slices";
import type { Id } from "../slices/data.types";
import { selectResolvedDeckById } from "./deck-view";
import { selectCanonicalTabooSetId } from "./lists";

export function selectCardWithRelations<T extends boolean>(
  state: StoreState,
  code: string | undefined,
  withRelations: T,
  deckId: Id | undefined,
  applyEdits?: boolean,
): T extends true ? undefined | CardWithRelations : undefined | ResolvedCard {
  return resolveCardWithRelations(
    state.metadata,
    state.lookupTables,
    code,
    selectCanonicalTabooSetId(state, deckId, applyEdits),
    selectResolvedDeckById(state, deckId, applyEdits)?.customizations,
    withRelations,
  );
}
