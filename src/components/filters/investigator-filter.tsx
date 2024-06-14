import { ChangeEvent, useCallback } from "react";

import { useStore } from "@/store";
import {
  selectChanges,
  selectOpen,
  selectOptions,
  selectValue,
} from "@/store/selectors/filters/investigator";

import { FilterContainer } from "./filter-container";

export function InvestigatorFilter() {
  const investigators = useStore(selectOptions);
  const value = useStore(selectValue);
  const changes = useStore(selectChanges);
  const open = useStore(selectOpen);

  const setFilter = useStore((state) => state.setActiveFilter);
  const setFilterOpen = useStore((state) => state.setFilterOpen);
  const resetFilter = useStore((state) => state.resetFilterKey);

  const onReset = useCallback(() => {
    resetFilter("player", "investigator");
  }, [resetFilter]);

  const onOpenChange = useCallback(
    (val: boolean) => {
      setFilterOpen("player", "investigator", val);
    },
    [setFilterOpen],
  );

  const onSelectInvestigator = useCallback(
    (evt: ChangeEvent<HTMLSelectElement>) => {
      setFilter(
        "player",
        "investigator",
        "value",
        evt.target.value || undefined,
      );
    },
    [setFilter],
  );

  return (
    <FilterContainer
      title="Investigator"
      filterString={changes}
      onReset={onReset}
      open={open}
      onOpenChange={onOpenChange}
    >
      <select onChange={onSelectInvestigator} value={value ?? ""}>
        <option value="">Choose an investigator</option>
        {investigators.map((card) => (
          <option key={card.code} value={card.code}>
            {card.real_name}
            {card.parallel && ` (Parallel)`}
          </option>
        ))}
      </select>
    </FilterContainer>
  );
}
