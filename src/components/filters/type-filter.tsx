import { useStore } from "@/store";
import {
  selectActiveCardType,
  selectTypeChanges,
  selectTypeOptions,
  selectTypeValue,
} from "@/store/selectors/filters";
import type { Type } from "@/store/services/types";

import { MultiselectFilter } from "./primitives/multiselect-filter";

const nameRenderer = (item: Type) => item.name;
const itemToString = (item: Type) => item.name.toLowerCase();

export function TypeFilter() {
  const cardType = useStore(selectActiveCardType);
  const changes = useStore(selectTypeChanges);
  const types = useStore(selectTypeOptions);
  const value = useStore(selectTypeValue);

  return (
    <MultiselectFilter
      cardType={cardType}
      path="type"
      title="Type"
      changes={changes}
      options={types}
      placeholder="Select type(s)..."
      value={value}
      itemToString={itemToString}
      nameRenderer={nameRenderer}
    />
  );
}
