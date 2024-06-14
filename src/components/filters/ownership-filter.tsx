import { useCallback } from "react";

import SvgOwned from "@/assets/icons/card_all.svg?react";
import SvgUnowned from "@/assets/icons/card_unowned.svg?react";
import SvgAll from "@/assets/icons/cards.svg?react";
import { useStore } from "@/store";
import { selectActiveCardType } from "@/store/selectors/filters/shared";
import { OwnershipFilter as OwnershipFilterType } from "@/store/slices/filters/types";

import { Collapsible, CollapsibleContent } from "../ui/collapsible";
import {
  RadioButtonGroup,
  RadioButtonGroupItem,
} from "../ui/radio-button-group";

export function OwnershipFilter() {
  const activeCardType = useStore(selectActiveCardType);
  const activeOwnershipFilter = useStore(
    (state) => state.filters[state.filters.cardType].ownership.value,
  );

  const setFilter = useStore((state) => state.setActiveFilter);

  const onValueChange = useCallback(
    (value: string) => {
      setFilter(
        activeCardType,
        "ownership",
        "value",
        value as unknown as OwnershipFilterType["value"],
      );
    },
    [setFilter, activeCardType],
  );

  return (
    <Collapsible title="Ownership">
      <CollapsibleContent>
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
      </CollapsibleContent>
    </Collapsible>
  );
}
