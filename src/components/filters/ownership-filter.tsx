import { File, FileCheck, FileWarning } from "lucide-react";
import { useCallback } from "react";

import { useStore } from "@/store";
import {
  selectActiveCardType,
  selectFilterOpen,
  selectOwnershipValue,
} from "@/store/selectors/filters";

import {
  RadioButtonGroup,
  RadioButtonGroupItem,
} from "../ui/radio-button-group";
import { FilterContainer } from "./primitives/filter-container";

export function OwnershipFilter() {
  const cardType = useStore(selectActiveCardType);
  const open = useStore(selectFilterOpen(cardType, "ownership"));
  const value = useStore(selectOwnershipValue);

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
      setFilter(cardType, "ownership", "value", value);
    },
    [setFilter, cardType],
  );

  const currentTitle =
    value === "all" ? "All" : value === "owned" ? "Owned" : "Unavailable";

  return (
    <FilterContainer
      alwaysShowFilterString
      filterString={currentTitle}
      onOpenChange={onOpenChange}
      open={open}
      title="Ownership"
    >
      <RadioButtonGroup icons onValueChange={onValueChange} value={value ?? ""}>
        <RadioButtonGroupItem title="All" value="all">
          <File />
        </RadioButtonGroupItem>
        <RadioButtonGroupItem title="Owned" value="owned">
          <FileCheck />
        </RadioButtonGroupItem>
        <RadioButtonGroupItem title="Unavailable" value="unowned">
          <FileWarning />
        </RadioButtonGroupItem>
      </RadioButtonGroup>
    </FilterContainer>
  );
}
