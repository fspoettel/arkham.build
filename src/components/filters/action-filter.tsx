import { useCallback } from "react";

import { useStore } from "@/store";
import {
  selectActionChanges,
  selectActionOptions,
  selectActionValue,
  selectActiveCardType,
} from "@/store/selectors/filters";
import type { Trait } from "@/store/slices/filters/types";
import { capitalize } from "@/utils/formatting";

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
      changes={changes}
      nameRenderer={nameRenderer}
      options={actions}
      path="action"
      placeholder="Select actions..."
      title="Actions"
      value={value}
    />
  );
}
