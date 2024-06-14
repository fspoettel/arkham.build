import { ChangeEvent, useCallback } from "react";

import { useStore } from "@/store";
import {
  selectActiveTabooSet,
  selectTabooSets,
} from "@/store/selectors/filters/taboo-set";

import { Collapsible, CollapsibleContent } from "../ui/collapsible";

export function TabooSetFilter() {
  const tabooSets = useStore(selectTabooSets);
  const setFilter = useStore((state) => state.setActiveFilter);
  const activeTaboo = useStore(selectActiveTabooSet);

  const onSelectTabooSet = useCallback(
    (evt: ChangeEvent<HTMLSelectElement>) => {
      const val = evt.target.value;
      setFilter("player", "tabooSet", "value", val ? +val : undefined);
    },
    [setFilter],
  );

  return (
    <Collapsible title="Taboo Set">
      <CollapsibleContent>
        <select onChange={onSelectTabooSet} value={activeTaboo ?? ""}>
          <option value="">All cards</option>
          {tabooSets.map((set) => (
            <option key={set.id} value={set.id}>
              {set.name} - {set.date}
            </option>
          ))}
        </select>
      </CollapsibleContent>
    </Collapsible>
  );
}
