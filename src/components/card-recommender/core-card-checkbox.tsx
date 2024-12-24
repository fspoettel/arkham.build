import { useStore } from "@/store";
import type { ResolvedDeck } from "@/store/lib/types";
import type { Card } from "@/store/services/queries.types";
import { cx } from "@/utils/cx";
import { useCallback, useId } from "react";
import { Checkbox } from "../ui/checkbox";
import css from "./card-recommender.module.css";

export type CoreCardCheckboxProps = {
  card: Card;
  deck: ResolvedDeck;
};

export function CoreCardCheckbox(props: CoreCardCheckboxProps) {
  const { card, deck } = props;

  const id = useId();

  const checked = useStore((state) =>
    state.recommender.coreCards[props.deck.id]?.includes(props.card.code),
  );

  const addCoreCard = useStore((state) => state.addCoreCard);
  const removeCoreCard = useStore((state) => state.removeCoreCard);

  const onCheck = useCallback(
    (val: boolean | string) => {
      if (val) {
        addCoreCard(deck.id, card.code);
      } else {
        removeCoreCard(deck.id, card.code);
      }
    },
    [addCoreCard, removeCoreCard, card.code, deck.id],
  );

  return (
    <Checkbox
      label="Core"
      checked={checked}
      onCheckedChange={onCheck}
      className={cx(css["core-card-checkbox"])}
      id={id}
    />
  );
}
