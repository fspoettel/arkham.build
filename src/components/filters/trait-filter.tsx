import { useStore } from "@/store";
import {
  selectActiveCardType,
  selectTraitChanges,
  selectTraitOptions,
  selectTraitValue,
} from "@/store/selectors/filters";

import { MultiselectFilter } from "./primitives/multiselect-filter";

export function TraitFilter() {
  const cardType = useStore(selectActiveCardType);
  const changes = useStore(selectTraitChanges);
  const traits = useStore(selectTraitOptions);
  const value = useStore(selectTraitValue);

  return (
    <MultiselectFilter
      cardType={cardType}
      changes={changes}
      options={traits}
      path="trait"
      placeholder="Select trait(s)..."
      title="Trait"
      value={value}
    />
  );
}
