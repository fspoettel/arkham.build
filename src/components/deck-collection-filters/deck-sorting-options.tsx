import { useStore } from "@/store";
import { selectDecksSorting } from "@/store/selectors/deck-filters";
import {
  SORT_CRITERIA_LIST,
  type SortCriteria,
} from "@/store/slices/deck-collection-filters.types";
import { ArrowDown01, ArrowUp01 } from "lucide-react";
import {
  RadioButtonGroup,
  RadioButtonGroupItem,
} from "../ui/radio-button-group";
import { Select } from "../ui/select";
import css from "./deck-sorting-options.module.css";

export function DeckSortingOptions() {
  const setCriteria = useStore((state) => state.setDeckSortCriteria);
  const setOrder = useStore((state) => state.setDeckSortOrder);
  const selectedSort = useStore(selectDecksSorting);

  return (
    <div className={css["options-container"]}>
      <Select
        emptyLabel="Sort by..."
        variant="compressed"
        data-testid="deck-sorting-options"
        name="sorting-options"
        onChange={(e) => setCriteria(e.target.value as SortCriteria)}
        value={selectedSort.criteria}
        options={Object.keys(SORT_CRITERIA_LIST).map((set) => {
          return {
            label: SORT_CRITERIA_LIST[set as SortCriteria],
            value: set,
          };
        })}
      />

      <RadioButtonGroup
        icons
        onValueChange={(e) => setOrder(e as "asc" | "desc")}
        value={selectedSort.order}
      >
        <RadioButtonGroupItem
          tooltip="Ascending"
          value={"asc"}
          size="small"
          variant="bare"
        >
          <ArrowUp01 />
        </RadioButtonGroupItem>
        <RadioButtonGroupItem
          tooltip="Descending"
          value={"desc"}
          size="small"
          variant="bare"
        >
          <ArrowDown01 />
        </RadioButtonGroupItem>
      </RadioButtonGroup>
    </div>
  );
}
