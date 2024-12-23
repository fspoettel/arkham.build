import { useStore } from "@/store";
import {
  deckDateTickRange,
  deckTickToString,
} from "@/store/slices/recommender";
import { cx } from "@/utils/cx";
import { useCallback } from "react";
import { RangeSelect } from "../ui/range-select";
import css from "./card-recommender.module.css";

export function DeckDateRangeFilter() {
  const value = useStore((state) => state.recommender.deckFilter);
  const setFilterValue = useStore((state) => state.setRecommenderDeckFilter);
  const [min, max] = deckDateTickRange();
  const onValueCommit = useCallback(
    (value: [number, number]) => {
      setFilterValue(value);
    },
    [setFilterValue],
  );

  return (
    <RangeSelect
      className={cx(css["date-range-selector"])}
      data-testid="deck-date-range"
      id="deck-date-range-select"
      label="Publication date"
      max={max}
      min={min}
      onValueChange={onValueCommit}
      onValueCommit={onValueCommit}
      value={value}
      labelClassName={cx(css["date-range-label"])}
      renderLabel={deckTickToString}
      showLabel
    />
  );
}
