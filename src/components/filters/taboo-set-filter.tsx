import { useStore } from "@/store";
import {
  selectTabooSetChanges,
  selectTabooSetOptions,
  selectTabooSetValue,
} from "@/store/selectors/filters";
import { formatTabooSet } from "@/utils/formatting";

import { SelectFilter } from "./primitives/select-filter";

export function TabooSetFilter() {
  const tabooSets = useStore(selectTabooSetOptions);
  const value = useStore(selectTabooSetValue);
  const changes = useStore(selectTabooSetChanges);

  return (
    <SelectFilter
      cardType="player"
      changes={changes}
      mapValue={(val) => (val ? +val : undefined)}
      options={tabooSets}
      path="tabooSet"
      renderOption={(set) => (
        <option key={set.id} value={set.id}>
          {formatTabooSet(set)}
        </option>
      )}
      title="Taboo Set"
      value={value}
    />
  );
}
