import { useStore } from "@/store";
import {
  selectActiveListFilter,
  selectMultiselectChanges,
  selectTypeOptions,
} from "@/store/selectors/lists";
import type { Type } from "@/store/services/queries.types";
import { isTypeFilterObject } from "@/store/slices/lists.type-guards";
import { assert } from "@/utils/assert";

import { MultiselectFilter } from "./primitives/multiselect-filter";

const nameRenderer = (item: Type) => item.name;
const itemToString = (item: Type) => item.name.toLowerCase();

export function TypeFilter({ id }: { id: number }) {
  const filter = useStore((state) => selectActiveListFilter(state, id));
  assert(
    isTypeFilterObject(filter),
    `TypeFilter instantiated with '${filter?.type}'`,
  );

  const changes = selectMultiselectChanges(filter.value);
  const options = useStore(selectTypeOptions);

  return (
    <MultiselectFilter
      changes={changes}
      id={id}
      itemToString={itemToString}
      nameRenderer={nameRenderer}
      open={filter.open}
      options={options}
      placeholder="Select type(s)..."
      title="Type"
      value={filter.value}
    />
  );
}
