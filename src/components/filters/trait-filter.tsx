import { useStore } from "@/store";
import {
  selectActiveListFilter,
  selectMultiselectChanges,
  selectTraitOptions,
} from "@/store/selectors/lists";
import { isTraitFilterObject } from "@/store/slices/lists.type-guards";
import { assert } from "@/utils/assert";

import { MultiselectFilter } from "./primitives/multiselect-filter";

export function TraitFilter({ id }: { id: number }) {
  const filter = useStore((state) => selectActiveListFilter(state, id));
  assert(
    isTraitFilterObject(filter),
    `PackFilter instantiated with '${filter?.type}'`,
  );

  const changes = selectMultiselectChanges(filter.value);
  const options = useStore(selectTraitOptions);

  return (
    <MultiselectFilter
      changes={changes}
      id={id}
      open={filter.open}
      options={options}
      placeholder="Select trait(s)..."
      title="Trait"
      value={filter.value}
    />
  );
}
