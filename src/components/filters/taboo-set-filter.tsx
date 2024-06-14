import { useStore } from "@/store";
import {
  selectTabooSetChanges,
  selectTabooSetOptions,
  selectTabooSetValue,
} from "@/store/selectors/filters";

import { SelectFilter } from "./primitives/select-filter";

export function TabooSetFilter() {
  const tabooSets = useStore(selectTabooSetOptions);
  const value = useStore(selectTabooSetValue);
  const changes = useStore(selectTabooSetChanges);

  return (
    <SelectFilter
      cardType="player"
      path="tabooSet"
      changes={changes}
      title="Taboo Set"
      value={value}
      options={tabooSets}
      mapValue={(val) => (val ? +val : undefined)}
      renderOption={(set) => (
        <option key={set.id} value={set.id}>
          {set.name} - {set.date}
        </option>
      )}
    />
  );
}
