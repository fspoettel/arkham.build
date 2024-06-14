import { type MouseEvent, useCallback, useRef } from "react";

import { useStore } from "@/store";
import { selectCardQuantitiesForSlot } from "@/store/selectors/decks";
import type { Card } from "@/store/services/queries.types";
import type { Slot } from "@/store/slices/deck-view.types";

import css from "./card-modal.module.css";

import { QuantityInput } from "../ui/quantity-input";

type Props = {
  card: Card;
  canEdit?: boolean;
  showExtraQuantities?: boolean;
  onClickBackground?: () => void;
};

export function CardModalQuantities({
  card,
  canEdit,
  showExtraQuantities,
  onClickBackground,
}: Props) {
  const divRef = useRef<HTMLDivElement>(null);

  const onClick = useCallback(
    (evt: MouseEvent<HTMLDivElement>) => {
      if (evt.target === divRef.current) {
        onClickBackground?.();
      }
    },
    [onClickBackground],
  );

  const changeCardQuantity = useStore((state) => state.changeCardQuantity);

  const quantities = useStore((state) =>
    selectCardQuantitiesForSlot(state, "slots"),
  );

  const sideSlotQuantities = useStore((state) =>
    selectCardQuantitiesForSlot(state, "sideSlots"),
  );

  const extraSlotQuantities = useStore((state) =>
    selectCardQuantitiesForSlot(state, "extraSlots"),
  );

  const onChangeQuantity = (quantity: number, slot: Slot) => {
    changeCardQuantity(card.code, quantity, slot);
  };

  const code = card.code;
  const limit = card.deck_limit ?? card.quantity;

  return (
    <div className={css["cardmodal-quantities"]} onClick={onClick} ref={divRef}>
      <article className={css["cardmodal-quantity"]}>
        <h3>Deck</h3>
        <QuantityInput
          disabled={!canEdit}
          limit={limit}
          onValueChange={(quantity) => onChangeQuantity(quantity, "slots")}
          value={quantities?.[code] ?? 0}
        />
      </article>
      <article className={css["cardmodal-quantity"]}>
        <h3>Side deck</h3>
        <QuantityInput
          disabled={!canEdit}
          limit={limit}
          onValueChange={(quantity) => onChangeQuantity(quantity, "sideSlots")}
          value={sideSlotQuantities?.[code] ?? 0}
        />
      </article>
      {showExtraQuantities && (
        <article className={css["cardmodal-quantity"]}>
          <h3>Spirits</h3>
          <QuantityInput
            disabled={!canEdit}
            limit={limit}
            onValueChange={(quantity) =>
              onChangeQuantity(quantity, "extraSlots")
            }
            value={extraSlotQuantities?.[code] ?? 0}
          />
        </article>
      )}
    </div>
  );
}
