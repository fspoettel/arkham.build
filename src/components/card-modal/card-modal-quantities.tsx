import { useEffect } from "react";

import { useStore } from "@/store";
import type { Card } from "@/store/services/queries.types";
import type { Slot } from "@/store/slices/deck-edits.types";

import css from "./card-modal.module.css";

import type { ResolvedDeck } from "@/store/lib/types";
import { SPECIAL_CARD_CODES } from "@/utils/constants";
import { QuantityInput } from "../ui/quantity-input";

type Props = {
  card: Card;
  canEdit?: boolean;
  deck?: ResolvedDeck;
  showExtraQuantities?: boolean;
  onCloseModal(): void;
};

export function CardModalQuantities(props: Props) {
  const { card, canEdit, deck, showExtraQuantities, onCloseModal } = props;

  const updateCardQuantity = useStore((state) => state.updateCardQuantity);

  useEffect(() => {
    if (!canEdit) return;

    function onKeyDown(evt: KeyboardEvent) {
      if (evt.metaKey || !deck?.id) return;

      if (evt.key === "ArrowRight") {
        evt.preventDefault();
        updateCardQuantity(deck.id, card.code, 1, limit, "slots");
      } else if (evt.key === "ArrowLeft") {
        evt.preventDefault();
        updateCardQuantity(deck.id, card.code, -1, limit, "slots");
      } else if (Number.parseInt(evt.key) >= 0) {
        evt.preventDefault();
        updateCardQuantity(
          deck.id,
          card.code,
          Number.parseInt(evt.key),
          limit,
          "slots",
          "set",
        );
        onCloseModal();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [canEdit, card.code, updateCardQuantity, onCloseModal, deck?.id]);

  const quantities = deck?.slots;
  const sideSlotQuantities = deck?.sideSlots;
  const extraSlotQuantities = deck?.extraSlots;
  const bondedSlotQuantities = deck?.bondedSlots;
  const ignoreDeckLimitQuantities = deck?.ignoreDeckLimitSlots;

  const onChangeQuantity = (quantity: number, slot: Slot) => {
    if (!deck?.id) return;
    updateCardQuantity(deck.id, card.code, quantity, limit, slot);
  };

  const code = card.code;
  const limit = card.deck_limit || card.quantity;

  const isBonded = !!bondedSlotQuantities?.[code];

  return (
    <>
      {!isBonded && (
        <article className={css["quantity"]}>
          <h3 className={css["quantity-title"]}>Deck</h3>
          <QuantityInput
            data-testid="card-modal-quantities-main"
            disabled={!canEdit}
            limit={limit + (ignoreDeckLimitQuantities?.[code] ?? 0)}
            onValueChange={(quantity) => onChangeQuantity(quantity, "slots")}
            value={quantities?.[code] ?? 0}
          />
        </article>
      )}
      {!isBonded && (
        <article className={css["quantity"]}>
          <h3 className={css["quantity-title"]}>Side deck</h3>
          <QuantityInput
            data-testid="card-modal-quantities-side"
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
          <h3 className={css["quantity-title"]}>Bonded</h3>
          <QuantityInput
            disabled
            data-testid="card-modal-quantities-bonded"
            limit={limit}
            value={bondedSlotQuantities[code]}
          />
        </article>
      )}
      {showExtraQuantities && (
        <article className={css["quantity"]}>
          <h3 className={css["quantity-title"]}>Spirits</h3>
          <QuantityInput
            data-testid="card-modal-quantities-extra"
            disabled={!canEdit}
            limit={limit}
            onValueChange={(quantity) =>
              onChangeQuantity(quantity, "extraSlots")
            }
            value={extraSlotQuantities?.[code] ?? 0}
          />
        </article>
      )}
      {!isBonded && showIgnoreDeckLimitSlots(deck, card) && (
        <article className={css["quantity"]}>
          <h3 className={css["quantity-title"]}>Ignore deck limit</h3>
          <QuantityInput
            data-testid="card-modal-quantities-ignored"
            disabled={!canEdit}
            limit={limit}
            onValueChange={(quantity) =>
              onChangeQuantity(quantity, "ignoreDeckLimitSlots")
            }
            value={ignoreDeckLimitQuantities?.[code] ?? 0}
          />
        </article>
      )}
    </>
  );
}

function showIgnoreDeckLimitSlots(deck: ResolvedDeck | undefined, card: Card) {
  if (!deck) return false;

  const traits = card.real_traits ?? "";
  const investigator = deck.investigatorBack.card.code;

  return (
    // cards that are already ignored.
    !!deck.ignoreDeckLimitSlots?.[card.code] ||
    // parallel agnes & spells
    (investigator === SPECIAL_CARD_CODES.PARALLEL_AGNES &&
      traits.includes("Spell")) ||
    // parallel skids & gambit / fortune
    (investigator === SPECIAL_CARD_CODES.PARALLEL_SKIDS &&
      (traits.includes("Gambit") || traits.includes("Fortunes"))) ||
    // ace of rods
    card.code === SPECIAL_CARD_CODES.ACE_OF_RODS
  );
}
