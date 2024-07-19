import { resolveCardWithRelations } from "../lib/resolve-card";
import type {
  CardWithRelations,
  ResolvedCard,
  ResolvedDeck,
} from "../lib/types";
import type { StoreState } from "../slices";
import { selectCanonicalTabooSetId } from "./lists";

export function selectCardWithRelations<T extends boolean>(
  state: StoreState,
  code: string | undefined,
  withRelations: T,
  resolvedDeck: ResolvedDeck | undefined,
): T extends true ? undefined | CardWithRelations : undefined | ResolvedCard {
  return resolveCardWithRelations(
    state.metadata,
    state.lookupTables,
    code,
    selectCanonicalTabooSetId(state, resolvedDeck),
    resolvedDeck?.customizations,
    withRelations,
  );
}
