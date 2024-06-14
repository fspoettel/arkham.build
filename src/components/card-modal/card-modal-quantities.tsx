import { type MouseEvent, useCallback, useRef } from "react";

import { useStore } from "@/store";
import {
  selectCardQuantitiesForSlot,
  selectShowIgnoreDeckLimitSlots,
} from "@/store/selectors/decks";
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

  const bondedSlotQuantities = useStore((state) =>
    selectCardQuantitiesForSlot(state, "bondedSlots"),
  );

  const ignoreDeckLimitQuantities = useStore((state) =>
    selectCardQuantitiesForSlot(state, "ignoreDeckLimitSlots"),
  );

  const onChangeQuantity = (quantity: number, slot: Slot) => {
    changeCardQuantity(card.code, quantity, slot);
  };

  const showIgnoreDeckLimitSlots = useStore((state) =>
    selectShowIgnoreDeckLimitSlots(state, card),
  );

  const code = card.code;
  const limit = card.deck_limit || card.quantity;

  const isBonded = !!(bondedSlotQuantities && bondedSlotQuantities?.[code]);

  return (
    <div className={css["cardmodal-quantities"]} onClick={onClick} ref={divRef}>
      {!isBonded && (
        <article className={css["cardmodal-quantity"]}>
          <h3>Deck</h3>
          <QuantityInput
            disabled={!canEdit}
            limit={limit + (ignoreDeckLimitQuantities?.[code] ?? 0)}
            onValueChange={(quantity) => onChangeQuantity(quantity, "slots")}
            value={quantities?.[code] ?? 0}
          />
        </article>
      )}
      {!isBonded && (
        <article className={css["cardmodal-quantity"]}>
          <h3>Side deck</h3>
          <QuantityInput
            disabled={isBonded || !canEdit}
            limit={limit}
            onValueChange={(quantity) =>
              onChangeQuantity(quantity, "sideSlots")
            }
            value={sideSlotQuantities?.[code] ?? 0}
          />
        </article>
      )}
      {isBonded && (
        <article className={css["cardmodal-quantity"]}>
          <h3>Bonded</h3>
          <QuantityInput
            disabled
            limit={limit}
            value={bondedSlotQuantities[code]}
          />
        </article>
      )}
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
      {!isBonded && showIgnoreDeckLimitSlots && (
        <article className={css["cardmodal-quantity"]}>
          <h3>Ignore deck limit</h3>
          <QuantityInput
            disabled={!canEdit}
            limit={limit}
            onValueChange={(quantity) =>
              onChangeQuantity(quantity, "ignoreDeckLimitSlots")
            }
            value={ignoreDeckLimitQuantities?.[code] ?? 0}
          />
        </article>
      )}
    </div>
  );
}
