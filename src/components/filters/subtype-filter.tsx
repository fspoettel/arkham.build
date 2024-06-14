import { useStore } from "@/store";
import {
  selectActiveListFilter,
  selectSubtypeChanges,
  selectSubtypeOptions,
} from "@/store/selectors/lists";
import type { SubType } from "@/store/services/queries.types";
import { isSubtypeFilterObject } from "@/store/slices/lists.type-guards";
import { assert } from "@/utils/assert";

import { MultiselectFilter } from "./primitives/multiselect-filter";

const nameRenderer = (item: SubType) => item.name;
const itemToString = (item: SubType) => item.name.toLowerCase();

export function SubtypeFilter({ id }: { id: number }) {
  const filter = useStore((state) => selectActiveListFilter(state, id));
  assert(
    isSubtypeFilterObject(filter),
    `SubtypeFilter instantiated with '${filter?.type}'`,
  );

  const changes = useStore((state) =>
    selectSubtypeChanges(state, filter.value),
  );
  const options = useStore(selectSubtypeOptions);

  return (
    <MultiselectFilter
      changes={changes}
      id={id}
      itemToString={itemToString}
      nameRenderer={nameRenderer}
      open={filter.open}
      options={options}
      placeholder="Select subtype(s)..."
      title="Subtype"
      value={filter.value}
    />
  );
}
