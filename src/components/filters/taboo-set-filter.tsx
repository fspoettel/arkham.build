import { useStore } from "@/store";
import {
  selectChanges,
  selectOptions,
  selectValue,
} from "@/store/selectors/filters/taboo-set";

import { SelectFilter } from "./primitives/select-filter";

export function TabooSetFilter() {
  const tabooSets = useStore(selectOptions);
  const value = useStore(selectValue);
  const changes = useStore(selectChanges);

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
