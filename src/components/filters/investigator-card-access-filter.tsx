import { useStore } from "@/store";
import {
  selectActiveListFilter,
  selectCardOptions,
  selectInvestigatorCardAccessChanges,
} from "@/store/selectors/lists";
import { isInvestigatorCardAccessFilterObject } from "@/store/slices/lists.type-guards";
import { assert } from "@/utils/assert";
import { useMemo } from "react";
import { CardsCombobox } from "../cards-combobox";
import type { FilterProps } from "./filters.types";
import { FilterContainer } from "./primitives/filter-container";
import { useFilterCallbacks } from "./primitives/filter-hooks";

export function InvestigatorCardAccessFilter(props: FilterProps) {
  const { id } = props;

  const { onReset, onChange, onOpenChange } = useFilterCallbacks(id);

  const filter = useStore((state) => selectActiveListFilter(state, id));

  const cards = useStore(selectCardOptions);

  assert(
    isInvestigatorCardAccessFilterObject(filter),
    `InvestigatorCardAccessFilter instantiated with '${filter?.type}'`,
  );

  const value = useMemo(() => filter.value ?? [], [filter.value]);

  const changes = selectInvestigatorCardAccessChanges(value);

  return (
    <FilterContainer
      filterString={changes}
      onReset={onReset}
      onOpenChange={onOpenChange}
      open={filter.open}
      title="Card access"
    >
      <CardsCombobox
        id={`${id}-choose-cards`}
        items={cards}
        onValueChange={onChange}
        selectedItems={value}
        label="Cards"
      />
      <p className="small">
        If you need more, use arkham-starter's{" "}
        <a
          href="https://arkham-starter.com/tool/who"
          target="_blank"
          rel="noreferrer"
        >
          /who tool
        </a>
        .
      </p>
    </FilterContainer>
  );
}
