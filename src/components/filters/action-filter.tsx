import { useCallback } from "react";

import { useStore } from "@/store";
import {
  selectChanges,
  selectOptions,
  selectValue,
} from "@/store/selectors/filters/action";
import { selectActiveCardType } from "@/store/selectors/filters/shared";
import type { Trait } from "@/store/slices/filters/types";
import { capitalize } from "@/utils/capitalize";

import { MultiselectFilter } from "./primitives/multiselect-filter";

export function ActionFilter() {
  const cardType = useStore(selectActiveCardType);
  const changes = useStore(selectChanges);
  const actions = useStore(selectOptions);
  const value = useStore(selectValue);

  const nameRenderer = useCallback((item: Trait) => capitalize(item.code), []);

  return (
    <MultiselectFilter
      cardType={cardType}
      path="action"
      options={actions}
      value={value}
      placeholder="Select actions..."
      title="Actions"
      nameRenderer={nameRenderer}
      changes={changes}
    />
  );
}
