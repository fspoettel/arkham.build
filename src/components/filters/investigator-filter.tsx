import { useStore } from "@/store";
import {
  selectChanges,
  selectOptions,
  selectValue,
} from "@/store/selectors/filters/investigator";

import { SelectFilter } from "./primitives/select-filter";

export function InvestigatorFilter() {
  const investigators = useStore(selectOptions);
  const value = useStore(selectValue);
  const changes = useStore(selectChanges);

  return (
    <SelectFilter
      cardType="player"
      path="investigator"
      options={investigators}
      title="Investigator"
      changes={changes}
      value={value}
      renderOption={(card) => (
        <option key={card.code} value={card.code}>
          {card.real_name}
          {card.parallel && ` (Parallel)`}
        </option>
      )}
    />
  );
}
