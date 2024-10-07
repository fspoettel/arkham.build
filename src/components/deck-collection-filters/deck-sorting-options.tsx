import { ArrowDown01, ArrowUp01 } from "lucide-react";
import { useState } from "react";
import {
  RadioButtonGroup,
  RadioButtonGroupItem,
} from "../ui/radio-button-group";
import css from "./deck-sorting-options.module.css";

export function DeckSortingOptions() {
  const [sortCriteria, setSortCriteria] = useState<string>("date_updated");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  return (
    <div className={css["options-container"]}>
      <select
        className={css["options-select"]}
        data-testid="deck-sorting-options-select"
        name="sorting-options"
        onChange={(e) => setSortCriteria(e.target.value)}
        value={sortCriteria}
      >
        <option value={"date_updated"}>Date Updated</option>
        <option value={"date_created"}>Date Created</option>
        <option value={"alphabetical"}>Alphabetical</option>
        <option value={"xp"}>Xp</option>
      </select>

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
