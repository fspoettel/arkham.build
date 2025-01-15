import type { Card } from "@/store/services/queries.types";
import { cardLimit } from "@/utils/card-utils";
import { QuantityInput } from "../ui/quantity-input";
import css from "./card-actions.module.css";
import type { CardListItemProps } from "./types";

type Props = Pick<CardListItemProps, "listCardProps"> & {
  card: Card;
  quantity?: number;
};

export function CardActions(props: Props) {
  const { card, listCardProps, quantity } = props;

  if (!listCardProps?.onChangeCardQuantity || quantity == null) return null;

  return (
    <div className={css["actions"]}>
      <QuantityInput
        className={css["actions-quantity"]}
        limit={cardLimit(card, listCardProps?.limitOverride)}
        value={quantity || 0}
        onValueChange={(quantity, limit) =>
          listCardProps?.onChangeCardQuantity?.(card, quantity, limit)
        }
      />
      {listCardProps?.renderCardAction?.(card)}
      {listCardProps?.renderCardExtra?.(card, quantity)}
    </div>
  );
}
