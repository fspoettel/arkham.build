import { useStore } from "@/store";
import {
  selectActiveListFilter,
  selectInvestigatorChanges,
  selectInvestigatorOptions,
} from "@/store/selectors/lists";
import { isInvestigatorFilterObject } from "@/store/slices/lists.type-guards";
import { assert } from "@/utils/assert";

import type { FilterProps } from "./filters.types";
import { SelectFilter } from "./primitives/select-filter";

export function InvestigatorFilter({ id }: FilterProps) {
  const filter = useStore((state) => selectActiveListFilter(state, id));
  assert(
    isInvestigatorFilterObject(filter),
    `InvestigatorFilter instantiated with '${filter?.type}'`,
  );

  const options = useStore(selectInvestigatorOptions);
  const changes = useStore((state) =>
    selectInvestigatorChanges(state, filter.value),
  );

  return (
    <SelectFilter
      changes={changes}
      id={id}
      open={filter.open}
      options={options}
      renderOption={(card) => (
        <option key={card.code} value={card.code}>
          {card.real_name}
          {card.parallel && " (Parallel)"}
        </option>
      )}
      title="Investigator"
      value={filter.value}
    />
  );
}
