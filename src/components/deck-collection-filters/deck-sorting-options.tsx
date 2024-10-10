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
    label: "Latest updated",
    sorting: { order: -1, criteria: "date_updated" },
  },
  lastcreated: {
    label: "Latest created",
    sorting: { order: -1, criteria: "date_created" },
  },
  alphabeticaldesc: {
    label: "Alphabetical (A -> Z)",
    sorting: { order: 1, criteria: "alphabetical" },
  },
  alphabeticalasc: {
    label: "Alphabetical (Z -> A)",
    sorting: { order: -1, criteria: "alphabetical" },
  },
  xpdesc: {
    label: "Most XP first",
    sorting: { order: -1, criteria: "xp" },
  },
  xpasc: {
    label: "Least XP first",
    sorting: { order: 1, criteria: "xp" },
  },
};

export function DeckSortingOptions() {
  const setSort = useStore((state) => state.setDeckSort);

  const handleValueChange = (val: keyof typeof SORTING_OPTIONS) => {
    const { order, criteria } = SORTING_OPTIONS[val].sorting;
    setSort(order, criteria);
  };

  return (
    <div className={css["options-container"]}>
      <Select
        emptyLabel="Sort by..."
        variant="compressed"
        data-testid="deck-sorting-options"
        name="sorting-options"
        onChange={(e) =>
          handleValueChange(e.target.value as keyof typeof SORTING_OPTIONS)
        }
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
