import { Checkbox } from "@/components/ui/checkbox";
import { useStore } from "@/store";
import { useCallback } from "react";
import css from "./card-recommender.module.css";

export function IncludeSideDeckToggle() {
  const checked = useStore((state) => state.recommender.includeSideDeck);
  const setChecked = useStore((state) => state.setIncludeSideDeck);

  const onValueChange = useCallback(
    (val: boolean) => {
      setChecked(val);
    },
    [setChecked],
  );

  return (
    <Checkbox
      className={css["include-side-deck-filter"]}
      checked={checked}
      id="include-side-deck"
      label="Analyze side decks"
      onCheckedChange={onValueChange}
    />
  );
}
