import { useStore } from "@/store";
import { selectActiveCardType } from "@/store/selectors/filters/shared";
import {
  selectChanges,
  selectOptions,
  selectValue,
} from "@/store/selectors/filters/traits";

import { MultiselectFilter } from "./primitives/multiselect-filter";

export function TraitFilter() {
  const cardType = useStore(selectActiveCardType);
  const changes = useStore(selectChanges);
  const traits = useStore(selectOptions);
  const value = useStore(selectValue);

  return (
    <MultiselectFilter
      cardType={cardType}
      path="trait"
      title="Trait"
      options={traits}
      changes={changes}
      value={value}
      placeholder="Select trait(s)..."
    />
  );
}
