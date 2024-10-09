import {
  SORT_CRITERIA_LIST,
  type SortCriteria,
} from "@/store/slices/deck-collection-filters.types";
import { ArrowDown01, ArrowUp01 } from "lucide-react";
import { useState } from "react";
import {
  RadioButtonGroup,
  RadioButtonGroupItem,
} from "../ui/radio-button-group";
import { Select } from "../ui/select";
import css from "./deck-sorting-options.module.css";

export function DeckSortingOptions() {
  const [sortCriteria, setSortCriteria] = useState<string>("date_updated");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  return (
    <div className={css["options-container"]}>
      <Select
        emptyLabel="Sort by..."
        variant="compressed"
        data-testid="deck-sorting-options"
        name="sorting-options"
        onChange={(e) => setSortCriteria(e.target.value)}
        value={sortCriteria}
        options={Object.keys(SORT_CRITERIA_LIST).map((set) => {
          return {
            label: SORT_CRITERIA_LIST[set as SortCriteria],
            value: set,
          };
        })}
      />

      <RadioButtonGroup
        icons
        onValueChange={(e) => setSortOrder(e as "asc" | "desc")}
        value={sortOrder}
      >
        <RadioButtonGroupItem tooltip="Descending" value={"desc"} size="small">
          <ArrowDown01 />
        </RadioButtonGroupItem>
        <RadioButtonGroupItem tooltip="Ascending" value={"asc"} size="small">
          <ArrowUp01 />
        </RadioButtonGroupItem>
      </RadioButtonGroup>
    </div>
  );
}
