import { useCallback } from "react";

import { useStore } from "@/store";
import {
  selectActionChanges,
  selectActionOptions,
  selectActionValue,
  selectActiveCardType,
} from "@/store/selectors/filters";
import type { Trait } from "@/store/slices/filters/types";
import { capitalize } from "@/utils/capitalize";

import { MultiselectFilter } from "./primitives/multiselect-filter";

export function ActionFilter() {
  const cardType = useStore(selectActiveCardType);
  const changes = useStore(selectActionChanges);
  const actions = useStore(selectActionOptions);
  const value = useStore(selectActionValue);

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
