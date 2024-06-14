import { ChangeEvent, useCallback } from "react";

import { useStore } from "@/store";
import {
  selectActiveInvestigator,
  selectInvestigators,
} from "@/store/selectors/filters/investigator";

import { Collapsible, CollapsibleContent } from "../ui/collapsible";

export function InvestigatorFilter() {
  const investigators = useStore(selectInvestigators);
  const setFilter = useStore((state) => state.setActiveFilter);
  const activeInvestigator = useStore(selectActiveInvestigator);

  const onSelectInvestigator = useCallback(
    (evt: ChangeEvent<HTMLSelectElement>) => {
      setFilter(
        "player",
        "investigator",
        "value",
        evt.target.value || undefined,
      );
    },
    [setFilter],
  );

  return (
    <Collapsible title="Investigator">
      <CollapsibleContent>
        <select
          onChange={onSelectInvestigator}
          value={activeInvestigator ?? ""}
        >
          <option value="">Pick an investigator</option>
          {investigators.map((card) => (
            <option key={card.code} value={card.code}>
              {card.real_name}
              {card.parallel && ` (Parallel)`}
            </option>
          ))}
        </select>
      </CollapsibleContent>
    </Collapsible>
  );
}
