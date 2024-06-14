import { useStore } from "@/store";
import { selectActiveCardType } from "@/store/selectors/filters/shared";
import {
  selectChanges,
  selectOptions,
  selectValue,
} from "@/store/selectors/filters/type";
import { Type } from "@/store/services/types";

import { MultiselectFilter } from "./primitives/multiselect-filter";

const nameRenderer = (item: Type) => item.name;
const itemToString = (item: Type) => item.name.toLowerCase();

export function TypeFilter() {
  const cardType = useStore(selectActiveCardType);
  const changes = useStore(selectChanges);
  const types = useStore(selectOptions);
  const value = useStore(selectValue);

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
