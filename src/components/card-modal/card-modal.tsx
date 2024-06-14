import { useCallback } from "react";

import { useStore } from "@/store";
import { selectCardWithRelations } from "@/store/selectors/card-view";
import { selectActiveDeck, selectCanEditDeck } from "@/store/selectors/decks";
import { useMedia } from "@/utils/use-media";

import css from "./card-modal.module.css";

import { Card } from "../card/card";
import { CardCustomizations } from "../card/customizations/card-customizations";
import { CardCustomizationsEdit } from "../card/customizations/card-customizations-edit";
import { Button } from "../ui/button";
import { useDialogContext } from "../ui/dialog";
import { Modal } from "../ui/modal";
import { CardModalQuantities } from "./card-modal-quantities";

type Props = {
  code: string;
};

export function CardModal({ code }: Props) {
  const modalContext = useDialogContext();

  const onCloseModal = useCallback(() => {
    modalContext?.setOpen(false);
  }, [modalContext]);

  const activeDeck = useStore(selectActiveDeck);
  const canEdit = useStore(selectCanEditDeck);

  const cardWithRelations = useStore((state) =>
    selectCardWithRelations(state, code, true),
  );

  const showQuantities =
    !!activeDeck && cardWithRelations?.card.type_code !== "investigator";
  const showExtraQuantities = activeDeck?.hasExtraDeck;

  const canRenderFull = useMedia("(min-width: 45rem)");

  if (!cardWithRelations) return null;

  const cardNode = (
    <Card
      canToggleBackside
      resolvedCard={cardWithRelations}
      size={canRenderFull ? "full" : "compact"}
    >
      {cardWithRelations.card.customization_options ? (
        activeDeck ? (
          <CardCustomizationsEdit
            activeDeck={activeDeck}
            canEdit={canEdit}
            card={cardWithRelations.card}
          />
        ) : (
          <CardCustomizations card={cardWithRelations.card} />
        )
      ) : undefined}
    </Card>
  );

  return (
    <Modal
      actions={
        <Button
          as="a"
          href={`/card/${cardWithRelations.card.code}`}
          tabIndex={2}
          target="_blank"
        >
          Open card page
        </Button>
      }
      onClose={onCloseModal}
    >
      {showQuantities ? (
        <div className={css["cardmodal-row"]}>
          {cardNode}
          {showQuantities && (
            <CardModalQuantities
              canEdit={canEdit}
              showExtraQuantities={showExtraQuantities}
              card={cardWithRelations.card}
              onClickBackground={onCloseModal}
            />
          )}
        </div>
      ) : (
        cardNode
      )}
    </Modal>
  );
}
