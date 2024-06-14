import { ChangeEvent, useCallback } from "react";

import { useStore } from "@/store";
import {
  selectChanges,
  selectOpen,
  selectOptions,
  selectValue,
} from "@/store/selectors/filters/taboo-set";

import { FilterContainer } from "./filter-container";

export function TabooSetFilter() {
  const tabooSets = useStore(selectOptions);
  const value = useStore(selectValue);
  const changes = useStore(selectChanges);
  const open = useStore(selectOpen);

  const setFilter = useStore((state) => state.setActiveFilter);
  const setFilterOpen = useStore((state) => state.setFilterOpen);
  const resetFilter = useStore((state) => state.resetFilterKey);

  const onReset = useCallback(() => {
    resetFilter("player", "tabooSet");
  }, [resetFilter]);

  const onOpenChange = useCallback(
    (val: boolean) => {
      setFilterOpen("player", "tabooSet", val);
    },
    [setFilterOpen],
  );

  const onSelectTabooSet = useCallback(
    (evt: ChangeEvent<HTMLSelectElement>) => {
      const val = evt.target.value;
      setFilter("player", "tabooSet", "value", val ? +val : undefined);
    },
    [setFilter],
  );

  return (
    <FilterContainer
      title="Taboo Set"
      filterString={changes}
      onReset={onReset}
      open={open}
      onOpenChange={onOpenChange}
    >
      <select onChange={onSelectTabooSet} value={value ?? ""}>
        <option value="">All cards</option>
        {tabooSets.map((set) => (
          <option key={set.id} value={set.id}>
            {set.name} - {set.date}
          </option>
        ))}
      </select>
    </FilterContainer>
  );
}
