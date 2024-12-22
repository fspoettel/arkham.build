import { useStore } from "@/store";
import type { ResolvedDeck } from "@/store/lib/types";
import type { Card } from "@/store/services/queries.types";
import { cx } from "@/utils/cx";
import { useCallback } from "react";
import { Checkbox } from "../ui/checkbox";
import css from "./card-recommender.module.css";

export type CoreCardCheckboxProps = {
  card: Card;
  deck: ResolvedDeck;
};

export function CoreCardCheckbox(props: CoreCardCheckboxProps) {
  const checked = useStore((state) =>
    state.recommender.coreCards[props.deck.id]?.includes(props.card.code),
  );
  const addCoreCard = useStore((state) => state.addCoreCard);
  const removeCoreCard = useStore((state) => state.removeCoreCard);
  const onCheck = useCallback(
    (val: boolean | string) => {
      if (val) {
        addCoreCard(props.deck.id, props.card.code);
      } else {
        removeCoreCard(props.deck.id, props.card.code);
      }
    },
    [addCoreCard, removeCoreCard, props.card.code, props.deck.id],
  );

  return (
    <Checkbox
      label="Core"
      checked={checked}
      onCheckedChange={onCheck}
      className={cx(css["core-card-checkbox"])}
      actAsButton={true}
    />
  );
}
