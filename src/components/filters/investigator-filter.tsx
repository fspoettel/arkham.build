import { useStore } from "@/store";
import {
  selectInvestigatorChanges,
  selectInvestigatorOptions,
  selectInvestigatorValue,
} from "@/store/selectors/filters";

import { SelectFilter } from "./primitives/select-filter";

export function InvestigatorFilter() {
  const investigators = useStore(selectInvestigatorOptions);
  const value = useStore(selectInvestigatorValue);
  const changes = useStore(selectInvestigatorChanges);

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
