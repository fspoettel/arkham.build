import { resolveCardWithRelations } from "../lib/resolve-card";
import type { CardWithRelations, ResolvedCard } from "../lib/types";
import type { StoreState } from "../slices";
import { selectActiveDeck } from "./decks";
import { selectCanonicalTabooSetId } from "./filters";

export function selectCardWithRelations<T extends boolean>(
  state: StoreState,
  code: string | undefined,
  withRelations: T,
): T extends true ? undefined | CardWithRelations : undefined | ResolvedCard {
  return resolveCardWithRelations(
    state.metadata,
    state.lookupTables,
    code,
    selectCanonicalTabooSetId(state),
    selectActiveDeck(state)?.customizations,
    withRelations,
  );
}
