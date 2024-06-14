import { useStore } from "@/store";
import {
  selectActiveListFilter,
  selectTabooSetChanges,
  selectTabooSetOptions,
} from "@/store/selectors/lists";
import { isTabooSetFilterObject } from "@/store/slices/lists.type-guards";
import { assert } from "@/utils/assert";
import { formatTabooSet } from "@/utils/formatting";

import { SelectFilter } from "./primitives/select-filter";

export function TabooSetFilter({ id }: { id: number }) {
  const filter = useStore((state) => selectActiveListFilter(state, id));
  assert(
    isTabooSetFilterObject(filter),
    `TabooSetFilter instantiated with '${filter?.type}'`,
  );

  const changes = useStore((state) =>
    selectTabooSetChanges(state, filter.value),
  );
  const options = useStore(selectTabooSetOptions);

  return (
    <SelectFilter
      changes={changes}
      id={id}
      mapValue={(val) => (val ? +val : undefined)}
      open={filter.open}
      options={options}
      renderOption={(set) => (
        <option key={set.id} value={set.id}>
          {formatTabooSet(set)}
        </option>
      )}
      title="Taboo Set"
      value={filter.value}
    />
  );
}
