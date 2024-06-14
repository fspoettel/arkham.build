import { useStore } from "@/store";
import {
  selectActiveCardType,
  selectSubtypeChanges,
  selectSubtypeOptions,
  selectSubtypeValue,
} from "@/store/selectors/filters";
import type { SubType } from "@/store/services/types";

import { MultiselectFilter } from "./primitives/multiselect-filter";

const nameRenderer = (item: SubType) => item.name;
const itemToString = (item: SubType) => item.name.toLowerCase();

export function SubtypeFilter() {
  const cardType = useStore(selectActiveCardType);
  const changes = useStore(selectSubtypeChanges);
  const subtypes = useStore(selectSubtypeOptions);
  const value = useStore(selectSubtypeValue);

  return (
    <MultiselectFilter
      cardType={cardType}
      changes={changes}
      itemToString={itemToString}
      nameRenderer={nameRenderer}
      options={subtypes}
      path="subtype"
      placeholder="Select subtype(s)..."
      title="Subtype"
      value={value}
    />
  );
}
