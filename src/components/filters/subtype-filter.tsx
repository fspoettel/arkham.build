import { useStore } from "@/store";
import { selectActiveCardType } from "@/store/selectors/filters/shared";
import {
  selectChanges,
  selectOptions,
  selectValue,
} from "@/store/selectors/filters/subtype";
import type { SubType } from "@/store/services/types";

import { MultiselectFilter } from "./primitives/multiselect-filter";

const nameRenderer = (item: SubType) => item.name;
const itemToString = (item: SubType) => item.name.toLowerCase();

export function SubtypeFilter() {
  const cardType = useStore(selectActiveCardType);
  const changes = useStore(selectChanges);
  const subtypes = useStore(selectOptions);
  const value = useStore(selectValue);

  return (
    <MultiselectFilter
      cardType={cardType}
      path="subtype"
      placeholder="Select subtype(s)..."
      title="Subtype"
      changes={changes}
      options={subtypes}
      value={value}
      itemToString={itemToString}
      nameRenderer={nameRenderer}
    />
  );
}
