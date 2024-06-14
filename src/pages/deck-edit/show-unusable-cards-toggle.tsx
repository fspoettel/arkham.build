import { Checkbox } from "@/components/ui/checkbox";
import { useStore } from "@/store";

import css from "./deck-edit.module.css";

export function ShowUnusableCardsToggle() {
  const showUnusableCards = useStore((state) =>
    state.deckView?.mode === "edit" ? state.deckView.showUnusableCards : false,
  );

  const updateShowUnusableCards = useStore(
    (state) => state.updateShowUnusableCards,
  );

  const handleValueChange = (val: boolean) => {
    updateShowUnusableCards(val);
  };

  return (
    <div className={css["show-unusable-filter"]}>
      <Checkbox
        checked={showUnusableCards}
        id="show-unusable-cards"
        label="Show unusable cards"
        onCheckedChange={handleValueChange}
      />
    </div>
  );
}
