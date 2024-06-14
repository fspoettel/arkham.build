import { useCallback } from "react";

import SvgOwned from "@/assets/icons/card_all.svg?react";
import SvgUnowned from "@/assets/icons/card_unowned.svg?react";
import SvgAll from "@/assets/icons/cards.svg?react";
import { useStore } from "@/store";
import { selectOpen, selectValue } from "@/store/selectors/filters/ownership";
import { selectActiveCardType } from "@/store/selectors/filters/shared";
import type { OwnershipFilter as OwnershipFilterType } from "@/store/slices/filters/types";
import { capitalize } from "@/utils/capitalize";

import {
  RadioButtonGroup,
  RadioButtonGroupItem,
} from "../ui/radio-button-group";
import { FilterContainer } from "./primitives/filter-container";

export function OwnershipFilter() {
  const cardType = useStore(selectActiveCardType);
  const open = useStore(selectOpen);
  const value = useStore(selectValue);

  const activeOwnershipFilter = useStore(
    (state) => state.filters[state.filters.cardType].ownership.value,
  );

  const setFilter = useStore((state) => state.setFilter);
  const setFilterOpen = useStore((state) => state.setFilterOpen);

  const onOpenChange = useCallback(
    (val: boolean) => {
      setFilterOpen(cardType, "ownership", val);
    },
    [setFilterOpen, cardType],
  );

  const onValueChange = useCallback(
    (value: string) => {
      setFilter(
        cardType,
        "ownership",
        "value",
        value as unknown as OwnershipFilterType["value"],
      );
    },
    [setFilter, cardType],
  );

  return (
    <FilterContainer
      title="Ownership"
      alwaysShowFilterString
      filterString={capitalize(value)}
      open={open}
      onOpenChange={onOpenChange}
    >
      <RadioButtonGroup
        icons
        value={activeOwnershipFilter ?? ""}
        onValueChange={onValueChange}
      >
        <RadioButtonGroupItem title="All" value="all">
          <SvgAll />
        </RadioButtonGroupItem>
        <RadioButtonGroupItem title="Owned" value="owned">
          <SvgOwned />
        </RadioButtonGroupItem>
        <RadioButtonGroupItem title="Unowned" value="unowned">
          <SvgUnowned />
        </RadioButtonGroupItem>
      </RadioButtonGroup>
    </FilterContainer>
  );
}
