import type { Card } from "@/store/services/queries.types";
import { cardLimit } from "@/utils/card-utils";
import { QuantityInput } from "../ui/quantity-input";
import css from "./card-actions.module.css";
import type { CardListItemProps } from "./types";

type Props = Pick<
  CardListItemProps,
  "onChangeCardQuantity" | "quantities" | "renderCardAction" | "renderCardExtra"
> & {
  card: Card;
  limitOverride?: number;
  quantity?: number;
};

export function CardActions(props: Props) {
  const {
    card,
    limitOverride,
    onChangeCardQuantity,
    quantity,
    renderCardAction,
    renderCardExtra,
  } = props;

  if (!onChangeCardQuantity || quantity == null) return null;

  return (
    <div className={css["actions"]}>
      <QuantityInput
        className={css["actions-quantity"]}
        limit={cardLimit(card, limitOverride)}
        value={quantity || 0}
        onValueChange={(quantity, limit) =>
          onChangeCardQuantity(card, quantity, limit)
        }
      />
      {renderCardAction?.(card)}
      {renderCardExtra?.(card, quantity)}
    </div>
  );
}
