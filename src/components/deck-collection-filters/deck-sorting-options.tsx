import { useStore } from "@/store";
import type {
  SortCriteria,
  SortOrder,
} from "@/store/slices/deck-collection-filters.types";
import { Select } from "../ui/select";
import css from "./deck-sorting-options.module.css";

const SORTING_OPTIONS: Record<
  string,
  { label: string; sorting: { order: SortOrder; criteria: SortCriteria } }
> = {
  lastupdated: {
    label: "Updated recently",
    sorting: { order: "desc", criteria: "date_updated" },
  },
  lastcreated: {
    label: "Created recently",
    sorting: { order: "desc", criteria: "date_created" },
  },
  alphabeticaldesc: {
    label: "Alphabetical (A -> Z)",
    sorting: { order: "asc", criteria: "alphabetical" },
  },
  alphabeticalasc: {
    label: "Alphabetical (Z -> A)",
    sorting: { order: "desc", criteria: "alphabetical" },
  },
  xpdesc: {
    label: "Most XP spent",
    sorting: { order: "desc", criteria: "xp" },
  },
  xpasc: {
    label: "Least XP spent",
    sorting: { order: "asc", criteria: "xp" },
  },
};

export function DeckSortingOptions() {
  const setSort = useStore((state) => state.setDeckSort);

  const handleValueChange = (val: string) => {
    const { order, criteria } =
      SORTING_OPTIONS[val as keyof typeof SORTING_OPTIONS].sorting;
    setSort(order, criteria);
  };

  return (
    <div className={css["options-container"]}>
      <p className={css["results-label"]}>Results</p>
      <Select
        emptyLabel="Sort by"
        variant="compressed"
        data-testid="deck-sorting-options"
        name="sorting-options"
        onChange={(e) => handleValueChange(e.target.value)}
        options={Object.keys(SORTING_OPTIONS).map((option) => {
          return {
            value: option,
            label: SORTING_OPTIONS[option].label,
          };
        })}
      />
    </div>
  );
}
