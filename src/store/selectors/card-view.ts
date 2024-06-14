import type { CardResolved, CardWithRelations } from "../lib/card-resolver";
import { resolveCardWithRelations } from "../lib/card-resolver";
import type { StoreState } from "../slices";
import { selectCanonicalTabooSetId } from "./filters";

export function selectCardWithRelations<T extends boolean>(
  state: StoreState,
  code: string | undefined,
  withRelations: T,
): T extends true ? undefined | CardWithRelations : undefined | CardResolved {
  return resolveCardWithRelations(
    state.metadata,
    state.lookupTables,
    code,
    selectCanonicalTabooSetId(state),
    withRelations,
  );
}
