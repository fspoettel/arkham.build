import type { StoreState } from "../slices";
import type { CardResolved, CardWithRelations } from "../utils/card-resolver";
import { resolveCardWithRelations } from "../utils/card-resolver";
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
