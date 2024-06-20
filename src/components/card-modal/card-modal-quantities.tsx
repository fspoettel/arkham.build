import { useCallback, useEffect, useRef } from "react";

import { useStore } from "@/store";
import type { DisplayDeck } from "@/store/lib/deck-grouping";
import { selectShowIgnoreDeckLimitSlotsById } from "@/store/selectors/deck-view";
import type { Card } from "@/store/services/queries.types";
import type { Slot } from "@/store/slices/deck-edits.types";

import css from "./card-modal.module.css";

import { QuantityInput } from "../ui/quantity-input";

type Props = {
  card: Card;
  canEdit?: boolean;
  deck?: DisplayDeck;
  showExtraQuantities?: boolean;
  onClickBackground?: () => void;
};

export function CardModalQuantities({
  card,
  canEdit,
  deck,
  showExtraQuantities,
  onClickBackground,
}: Props) {
  const divRef = useRef<HTMLDivElement>(null);

  const onClick = useCallback(
    (evt: React.MouseEvent) => {
      if (evt.target === divRef.current) {
        onClickBackground?.();
      }
    },
    [onClickBackground],
  );

  const updateCardQuantity = useStore((state) => state.updateCardQuantity);

  useEffect(() => {
    if (!canEdit) return;

    function onKeyDown(evt: KeyboardEvent) {
      if (evt.metaKey || !deck?.id) return;

      if (evt.key === "ArrowRight") {
        evt.preventDefault();
        updateCardQuantity(deck.id, card.code, 1, "slots");
      } else if (evt.key === "ArrowLeft") {
        evt.preventDefault();
        updateCardQuantity(deck.id, card.code, -1, "slots");
      } else if (Number.parseInt(evt.key) >= 0) {
        evt.preventDefault();
        updateCardQuantity(
          deck.id,
          card.code,
          Number.parseInt(evt.key),
          "slots",
          "set",
        );
        onClickBackground?.();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [canEdit, card.code, updateCardQuantity, onClickBackground, deck?.id]);

  const quantities = deck?.slots;
  const sideSlotQuantities = deck?.sideSlots;
  const extraSlotQuantities = deck?.extraSlots;
  const bondedSlotQuantities = deck?.bondedSlots;
  const ignoreDeckLimitQuantities = deck?.ignoreDeckLimitSlots;

  const onChangeQuantity = (quantity: number, slot: Slot) => {
    if (!deck?.id) return;
    updateCardQuantity(deck.id, card.code, quantity, slot);
  };

  const showIgnoreDeckLimitSlots = useStore((state) =>
    deck
      ? selectShowIgnoreDeckLimitSlotsById(state, deck.id, false, card)
      : false,
  );

  const code = card.code;
  const limit = card.deck_limit || card.quantity;

  const isBonded = !!(bondedSlotQuantities && bondedSlotQuantities?.[code]);

  return (
    <div className={css["quantities"]} onClick={onClick} ref={divRef}>
      {!isBonded && (
        <article className={css["quantity"]}>
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
        <article className={css["quantity"]}>
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
        <article className={css["quantity"]}>
          <h3>Bonded</h3>
          <QuantityInput
            disabled
            limit={limit}
            value={bondedSlotQuantities[code]}
          />
        </article>
      )}
      {showExtraQuantities && (
        <article className={css["quantity"]}>
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
        <article className={css["quantity"]}>
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
