import { useStore } from "@/store";
import type {
  DeckSortPayload,
  SortCriteria,
  SortOrder,
} from "@/store/slices/deck-collection-filters.types";
import { ArrowDownNarrowWideIcon } from "lucide-react";
import { Select } from "../ui/select";
import css from "./deck-sorting-options.module.css";

const SORTING_OPTIONS: {
  label: string;
  sorting: DeckSortPayload;
}[] = [
  {
    label: "Updated recently",
    sorting: { order: "desc", criteria: "date_updated" },
  },
  {
    label: "Created recently",
    sorting: { order: "desc", criteria: "date_created" },
  },
  {
    label: "Alphabetical (A -> Z)",
    sorting: { order: "asc", criteria: "alphabetical" },
  },
  {
    label: "Alphabetical (Z -> A)",
    sorting: { order: "desc", criteria: "alphabetical" },
  },
  {
    label: "Most XP spent",
    sorting: { order: "desc", criteria: "xp" },
  },
  {
    label: "Least XP spent",
    sorting: { order: "asc", criteria: "xp" },
  },
];

type Props = {
  filteredCount: number;
  totalCount: number;
};

export function DeckSortingOptions(props: Props) {
  const { filteredCount, totalCount } = props;

  const setSort = useStore((state) => state.setDeckSort);
  const sort = useStore((state) => state.deckFilters.sort);

  const handleValueChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const [criteria, order] = evt.target.value.split("|");
    if (criteria && order) {
      setSort({
        criteria: criteria as SortCriteria,
        order: order as SortOrder,
      });
    }
  };

  const diff = totalCount - filteredCount;

  return (
    <div className={css["options-container"]}>
      <p className={css["results-label"]}>
        {filteredCount} decks{diff > 0 && <em>&nbsp;({diff} hidden)</em>}
      </p>
      <div className={css["options-input"]}>
        <ArrowDownNarrowWideIcon />
        <Select
          emptyLabel="Sort by"
          variant="compressed"
          data-testid="deck-sorting-options"
          name="sorting-options"
          onChange={handleValueChange}
          required
          value={formatDeckSortOption(sort)}
          options={SORTING_OPTIONS.map((option) => {
            return {
              value: formatDeckSortOption(option.sorting),
              label: option.label,
            };
          })}
        />
      </div>
    </div>
  );
}

function formatDeckSortOption(option: DeckSortPayload) {
  return `${option.criteria}|${option.order}`;
}
